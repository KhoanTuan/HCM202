// Trình chiếu dạng "cuộn 3D": cuộn chuột / phím mũi tên / vuốt → slide kế tiếp bay từ chiều sâu tới,
// slide cũ bay vụt qua người xem. Toàn màn hình chỉ có slide, không có thanh điều khiển.
//
// Phím ẩn: ↓ → PageDown Space = tiếp · ↑ ← PageUp = lùi · Home/End · O tổng quan · N ghi chú · F toàn màn hình · 3 khám phá 3D
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { meta, slides } from '../content/deck.js';
import { DrumRings } from '../art/Ornaments.jsx';
import { layouts } from './layouts.jsx';
import { RevealContext } from './reveal.js';
import './deck.css';

const W = 1920, H = 1080;
const N = slides.length;
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('hcm-deck') : null;
const EASE = [0.65, 0, 0.35, 1];

function readIndex() {
  const m = location.hash.match(/#\/slide\/(\d+)/);
  const n = m ? parseInt(m[1], 10) - 1 : 0;
  return Math.min(Math.max(n, 0), N - 1);
}

function useStageScale() {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return scale;
}

export function SlideView({ index }) {
  const s = slides[index];
  const L = layouts[s.layout] ?? layouts.cards;
  return <L s={s} meta={meta} index={index} total={N} />;
}

/* Một lớp slide đặt trong không gian 3D. p = vị trí trình chiếu (số thực). */
function SlideLayer({ i, p, scale }) {
  const z = useTransform(p, [i - 1, i, i + 1], [-1800, 0, 900]);
  const y = useTransform(p, [i - 1, i, i + 1], [420, 0, -260]);
  const rx = useTransform(p, [i - 1, i, i + 1], [32, 0, -14]);
  const opacity = useTransform(p, [i - 1, i - 0.6, i, i + 0.25, i + 0.5], [0, 1, 1, 0.35, 0]);
  const visibility = useTransform(p, (v) => (Math.abs(v - i) < 1 ? 'visible' : 'hidden'));
  const pointerEvents = useTransform(p, (v) => (Math.abs(v - i) < 0.25 ? 'auto' : 'none'));
  const [shown, setShown] = useState(() => p.get() > i - 0.3);
  useMotionValueEvent(p, 'change', (v) => {
    const next = v > i - 0.3;
    if (next !== shown) setShown(next);
  });

  return (
    <motion.div className="deck-layer" style={{ z, y, rotateX: rx, opacity, visibility, pointerEvents }}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <RevealContext.Provider value={shown}>
          <SlideView index={i} />
        </RevealContext.Provider>
      </div>
    </motion.div>
  );
}

export default function Deck() {
  const [index, setIndex] = useState(readIndex);
  const idx = useRef(index);
  const p = useMotionValue(index);
  const lock = useRef(0);
  const [overview, setOverview] = useState(false);
  const scale = useStageScale();
  const touchY = useRef(null);

  const go = useCallback((next) => {
    const n = Math.min(Math.max(next, 0), N - 1);
    const cur = idx.current;
    if (n === cur) return;
    // nhảy xa (từ tổng quan): đặt ngay sát slide đích rồi mới bay tới
    if (Math.abs(n - cur) > 1) p.set(n - Math.sign(n - cur));
    idx.current = n;
    setIndex(n);
  }, [p]);

  useEffect(() => {
    const c = animate(p, index, { duration: 1.15, ease: EASE });
    const h = `#/slide/${index + 1}`;
    if (location.hash !== h) history.replaceState(null, '', h);
    channel?.postMessage({ type: 'state', index });
    return () => c.stop();
  }, [index, p]);

  // cửa sổ người trình bày điều khiển ngược lại
  useEffect(() => {
    if (!channel) return;
    const onMsg = (e) => {
      if (e.data?.type === 'go') go(e.data.index);
      if (e.data?.type === 'hello') channel.postMessage({ type: 'state', index: idx.current });
    };
    channel.addEventListener('message', onMsg);
    return () => channel.removeEventListener('message', onMsg);
  }, [go]);

  // cuộn chuột: mỗi lần cuộn = một slide (có khóa để không nhảy nhiều slide)
  useEffect(() => {
    const onWheel = (e) => {
      if (overview) return;
      e.preventDefault();
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 6) return;
      const now = performance.now();
      if (now < lock.current) return;
      lock.current = now + 950;
      go(idx.current + (d > 0 ? 1 : -1));
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [go, overview]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); go(idx.current + 1); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); go(idx.current - 1); }
      else if (k === 'Home') go(0);
      else if (k === 'End') go(N - 1);
      else if (k === 'o' || k === 'O') setOverview((v) => !v);
      else if (k === 'Escape') setOverview(false);
      else if (k === 'f' || k === 'F') toggleFull();
      else if (k === 'n' || k === 'N') openPresenter();
      else if (k === '3') location.hash = '#/';
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const progress = useTransform(p, [0, N - 1], ['0%', '100%']);

  return (
    <div
      className="viewport"
      onClick={(e) => {
        if (overview || e.target.closest('a, button')) return;
        go(idx.current + (e.clientX / window.innerWidth < 0.2 ? -1 : 1));
      }}
      onTouchStart={(e) => (touchY.current = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        const dy = e.changedTouches[0].clientY - (touchY.current ?? 0);
        if (Math.abs(dy) > 50) go(idx.current + (dy < 0 ? 1 : -1));
      }}
    >
      <div className="space-bg" aria-hidden>
        <DrumRings size={1800} color="#f1c94a" opacity={0.07} />
      </div>
      <div className="space">
        {slides.map((_, i) =>
          Math.abs(i - index) <= 1 ? <SlideLayer key={i} i={i} p={p} scale={scale} /> : null,
        )}
      </div>
      <motion.div className="progress-bar" style={{ width: progress }} />

      {overview && (
        <div className="overview" onClick={() => setOverview(false)}>
          <h2>Tổng quan · {N} slide</h2>
          <div className="ov-grid">
            {slides.map((s, i) => (
              <button key={i} className={`ov-item ${i === index ? 'active' : ''} ${s.layout === 'divider' ? 'divider-item' : ''}`}
                onClick={(e) => { e.stopPropagation(); go(i); setOverview(false); }}>
                <small>{String(i + 1).padStart(2, '0')} · {s.part ?? s.kicker ?? s.layout}</small>
                {s.title}
              </button>
            ))}
          </div>
          <p className="help">Cuộn chuột / ↓ ↑ / Space chuyển slide · O tổng quan · N cửa sổ ghi chú · F toàn màn hình · 3 khám phá 3D · Esc đóng</p>
        </div>
      )}
    </div>
  );
}

function toggleFull() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function openPresenter() {
  window.open(`${location.pathname}#/presenter`, 'hcm-presenter', 'width=1100,height=720');
}

// TRANG WEB THUYẾT TRÌNH 3D — một hành trình liền mạch.
// Cảnh 3D (trống đồng + 11 bia) nằm cố định phía sau; mỗi lần cuộn / bấm phím là tới một "điểm dừng":
// camera bay tới bia tương ứng, nội dung hiện lên thành một tấm thẻ lớn đọc rõ trước lớp.
import { Canvas } from '@react-three/fiber';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Star } from '../art/Ornaments.jsx';
import { meta } from '../content/deck.js';
import { nodes } from '../content/parts.js';
import { chapters, stopOfNode, stops } from '../content/stops.js';
import ErrorBoundary from '../ErrorBoundary.jsx';
import Scene from '../explore/Scene.jsx';
import { goTo, stopH } from './nav.js';
import StopView from './StopView.jsx';
import './site.css';
import './journey.css';

const N = stops.length;
const HAS_WEBGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
})();

export default function Site() {
  const progress = useRef(0);
  const prog = useMotionValue(0);
  const [idx, setIdx] = useState(0);
  const [reached, setReached] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    Promise.all([document.fonts.load('700 50px Lora'), document.fonts.load('700 200px "Playfair Display"')]).finally(() => setFontsReady(true));
  }, []);

  // vị trí cuộn → tiến trình (số thực) cho camera + điểm dừng hiện tại
  useEffect(() => {
    const on = () => {
      const p = window.scrollY / stopH();
      progress.current = p;
      prog.set(p / (N - 1));
      const i = Math.min(Math.max(Math.round(p), 0), N - 1);
      setIdx(i);
      setReached((r) => Math.max(r, i));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [prog]);

  // mở lại đúng chỗ khi tải lại trang (#/s/12)
  useEffect(() => {
    const m = location.hash.match(/#\/s\/(\d+)/);
    if (m) requestAnimationFrame(() => goTo(parseInt(m[1], 10) - 1, false));
  }, []);
  useEffect(() => {
    const h = idx === 0 ? location.pathname : `#/s/${idx + 1}`;
    history.replaceState(null, '', h);
  }, [idx]);

  // phím: → ↓ Space PageDown = tiếp · ← ↑ PageUp = lùi · Home/End · F toàn màn hình
  const idxRef = useRef(idx);
  idxRef.current = idx;
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.('input, textarea')) return;
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); goTo(idxRef.current + 1); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); goTo(idxRef.current - 1); }
      else if (k === 'Home') { e.preventDefault(); goTo(0); }
      else if (k === 'End') { e.preventDefault(); goTo(N - 1); }
      else if (k === 'f' || k === 'F') toggleFull();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cur = stops[idx];
  const visited = useMemo(() => new Set(stops.slice(0, reached + 1).map((s) => s.node).filter((v) => v != null)), [reached]);
  const lit = cur.view === 'all' || cur.view === 'end';
  const onSelect = useCallback((i) => goTo(stopOfNode(i)), []);
  const barW = useTransform(prog, [0, 1], ['0%', '100%']);
  const chapter = cur.chapter;

  return (
    <div className="journey">
      {/* lớp 3D cố định phía sau */}
      <div className={`j-canvas ${cur.type === 'block' || cur.type === 'arg' ? 'recede' : ''} ${cur.type === 'intro' ? 'at-intro' : ''}`} aria-hidden>
        {HAS_WEBGL ? (
          fontsReady && (
            <ErrorBoundary title="Không dựng được cảnh 3D">
              <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 11, 25], fov: 42 }}>
                <Suspense fallback={null}>
                  <Scene args={nodes} stops={stops} progress={progress} active={cur.node ?? -1} lit={lit} drumClose={cur.view === 'drum'} visited={visited} onSelect={onSelect} />
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          )
        ) : (
          <div className="j-nogl" />
        )}
        <div className="j-vignette" />
      </div>

      {/* thanh trên */}
      <motion.div className="j-bar" style={{ width: barW }} />
      <nav className="j-nav">
        <button className="brand" onClick={() => goTo(0)}>
          <Star size={22} /> <span>{meta.group} · {meta.cqid}</span>
        </button>
        <div className="links">
          {chapters.slice(1, -1).map((c, i) => (
            <button key={c.key} className={chapter === i + 1 ? 'on' : ''} onClick={() => goTo(c.start)}>
              <b>{c.num}</b> {c.label}
            </button>
          ))}
        </div>
        <span className="j-count">{String(idx + 1).padStart(2, '0')} / {N}</span>
      </nav>

      {/* thanh tiến trình theo chương (bên trái) */}
      <aside className="j-rail" aria-label="Mục lục">
        {chapters.map((c, ci) => {
          const end = ci + 1 < chapters.length ? chapters[ci + 1].start : N;
          return (
            <div key={c.key} className={`rail-ch ${chapter === ci ? 'on' : ''} ${chapter > ci ? 'done' : ''}`}>
              <button className="rail-num" onClick={() => goTo(c.start)} title={c.label}>{c.num}</button>
              <div className="rail-dots">
                {Array.from({ length: Math.max(end - c.start, 0) }, (_, k) => {
                  const s = c.start + k;
                  return <button key={s} className={`rail-dot ${s === idx ? 'cur' : ''} ${s < idx ? 'past' : ''}`} onClick={() => goTo(s)} aria-label={`Điểm dừng ${s + 1}`} />;
                })}
              </div>
            </div>
          );
        })}
      </aside>

      {/* các điểm dừng: mỗi điểm cao đúng một màn hình, cuộn sẽ "hít" vào từng điểm */}
      <main className="j-stops">
        {stops.map((s) => <StopView key={s.index} s={s} active={s.index === idx} />)}
      </main>

      <div className="j-hint">
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Lùi">↑</button>
        <span>Cuộn chuột · phím ← → · F toàn màn hình</span>
        <button onClick={() => goTo(idx + 1)} disabled={idx === N - 1} aria-label="Tiếp">↓</button>
      </div>
    </div>
  );
}

function toggleFull() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

// Chế độ khám phá 3D cho câu hỏi phản biện CQ9.
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { cq9 } from '../content/cq9.js';
import { slides } from '../content/deck.js';
import Scene from './Scene.jsx';
import './explore.css';

const N = cq9.args.length;
const HAS_WEBGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
})();
const BACK = `#/slide/${slides.findIndex((s) => s.layout === 'cq9') + 1}`;

export default function Explore3D() {
  const [focus, setFocus] = useState(-1); // -1 tổng quan · 0..N-1 lập luận · N ghép lại
  const [visited, setVisited] = useState(() => new Set());
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // chờ font để chữ trên bia vẽ đúng dấu tiếng Việt
    Promise.all([
      document.fonts.load('700 50px Lora'),
      document.fonts.load('700 200px "Playfair Display"'),
    ]).finally(() => setFontsReady(true));
  }, []);

  const select = useCallback((i) => {
    setFocus(i);
    if (i >= 0 && i < N) setVisited((v) => new Set(v).add(i));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(Math.min(focus + 1, N)); }
      else if (e.key === 'ArrowLeft') select(Math.max(focus - 1, -1));
      else if (e.key === 'Escape' || e.key === '0') select(-1);
      else if (/^[1-7]$/.test(e.key)) select(+e.key - 1);
      else if (e.key === 's' || e.key === 'S') location.hash = BACK;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus, select]);

  const arg = focus >= 0 && focus < N ? cq9.args[focus] : null;

  return (
    <div className="explore">
      {fontsReady && !HAS_WEBGL && <NoWebGL />}
      {fontsReady && HAS_WEBGL && (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 14, 30], fov: 42 }}
          fallback={<NoWebGL />}
          onPointerMissed={() => focus >= 0 && focus < N && select(-1)}
        >
          <Suspense fallback={null}>
            <Scene args={cq9.args} focus={focus} visited={visited} onSelect={select} />
          </Suspense>
        </Canvas>
      )}

      {/* thanh trên */}
      <header className="x-top">
        <a className="x-back" href={BACK}>← Về slide</a>
        <div className="x-q">
          <span className="x-tag">CQ9 · Câu hỏi phản biện</span>
          <h1>{cq9.question}</h1>
        </div>
      </header>

      {/* bảng nội dung */}
      <AnimatePresence mode="wait">
        {focus === -1 && (
          <motion.aside key="intro" className="x-panel intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
            <p>{cq9.intro}</p>
            <button className="x-cta" onClick={() => select(0)}>Bắt đầu khám phá →</button>
            <p className="x-hint">Kéo để xoay · cuộn để phóng to · bấm vào bia để xem · phím 1–7, ← →</p>
          </motion.aside>
        )}
        {arg && (
          <motion.aside key={arg.id} className="x-panel" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} transition={{ duration: 0.45 }}>
            <div className="x-panel-head">
              <span className="x-num">{focus + 1}</span>
              <div>
                <span className="x-label">Lập luận {focus + 1}/{N} · {arg.label}</span>
                <h2>{arg.title}</h2>
              </div>
            </div>
            <motion.p className="x-claim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{arg.claim}</motion.p>
            <ul>
              {arg.points.map((p, k) => (
                <motion.li key={k} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + k * 0.12 }}>{p}</motion.li>
              ))}
            </ul>
            <motion.blockquote initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              “{arg.quote.text}”<cite>— {arg.quote.source}</cite>
            </motion.blockquote>
            <p className="x-link">Liên hệ: {arg.link}</p>
          </motion.aside>
        )}
        {focus === N && (
          <motion.aside key="end" className="x-panel conclusion" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <span className="x-label">Kết luận</span>
            <h2>{cq9.conclusion.title}</h2>
            <p>{cq9.conclusion.text}</p>
            <div className="x-final">Văn hóa còn thì dân tộc còn.</div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* thanh điều hướng dưới */}
      <nav className="x-nav" aria-label="Các lập luận">
        <button onClick={() => select(Math.max(focus - 1, -1))} aria-label="Trước">←</button>
        <button className={`x-dot ${focus === -1 ? 'on' : ''}`} onClick={() => select(-1)}>Toàn cảnh</button>
        {cq9.args.map((a, i) => (
          <button key={a.id} className={`x-dot ${focus === i ? 'on' : ''} ${visited.has(i) ? 'seen' : ''}`} onClick={() => select(i)} title={a.title}>
            {i + 1}
          </button>
        ))}
        <button className={`x-dot gold ${focus === N ? 'on' : ''}`} onClick={() => select(N)}>Ghép lại ✦</button>
        <button onClick={() => select(Math.min(focus + 1, N))} aria-label="Sau">→</button>
      </nav>
    </div>
  );
}

function NoWebGL() {
  return (
    <div className="x-nogl">
      Trình duyệt không hỗ trợ WebGL. Nội dung từng lập luận vẫn xem được ở bảng bên phải.
    </div>
  );
}

// KHUNG ĐẦU TIÊN: trung tâm 3D chứa mọi thứ cần khai thác (Phần I–IV) và phản biện (CQ9).
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { cq9 } from '../content/cq9.js';
import { meta } from '../content/deck.js';
import { nodes, intro } from '../content/parts.js';
import Scene from '../explore/Scene.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';

const N = nodes.length;
const HAS_WEBGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
})();

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero({ focus, setFocus, visited }) {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    Promise.all([document.fonts.load('700 50px Lora'), document.fonts.load('700 200px "Playfair Display"')])
      .finally(() => setFontsReady(true));
  }, []);

  // phím tắt khi đang ở khung đầu
  useEffect(() => {
    const onKey = (e) => {
      if (window.scrollY > window.innerHeight * 0.5 || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); setFocus(Math.min(focus + 1, N)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setFocus(Math.max(focus - 1, -1)); }
      else if (e.key === 'Escape') setFocus(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus, setFocus]);

  const node = focus >= 0 && focus < N ? nodes[focus] : null;

  return (
    <section id="kham-pha" className={`hero ${focus !== -1 ? 'focused' : ''}`}>
      <div className="hero-canvas">
        {HAS_WEBGL ? (
          fontsReady && (
            <ErrorBoundary title="Không dựng được cảnh 3D">
              <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 16, 34], fov: 42 }} onPointerMissed={() => focus >= 0 && setFocus(-1)}>
                <Suspense fallback={null}>
                  <Scene args={nodes} focus={focus} visited={visited} onSelect={setFocus} />
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          )
        ) : (
          <div className="hero-nogl" />
        )}
      </div>

      <div className="hero-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {meta.course} · {meta.group} · Câu hỏi phản biện {meta.cqid}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
          Tại sao <em>“văn hóa còn thì dân tộc còn”</em>?
        </motion.h1>
        <motion.p className="hero-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {meta.title}
        </motion.p>
        {intro && (
          <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            {intro.stats.map((s) => (
              <div key={s.value}><b>{s.value}</b><span>{s.label}</span></div>
            ))}
          </motion.div>
        )}
        <motion.button className="scroll-cue" onClick={() => scrollToId('phan-1')} initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2 } }}>
          Cuộn xuống đọc chi tiết ↓
        </motion.button>
      </div>

      <Panel focus={focus} setFocus={setFocus} node={node} visited={visited} />
    </section>
  );
}

/* ---------------- Bảng nội dung bên phải ---------------- */
function Panel({ focus, setFocus, node, visited }) {
  return (
    <aside className="panel3d" aria-live="polite">
      <div className="panel3d-bar">
        {focus === -1 ? <span className="panel3d-title">Bản đồ khám phá</span> : <button onClick={() => setFocus(-1)}>← Bản đồ</button>}
        <div className="panel3d-arrows">
          <button onClick={() => setFocus(Math.max(focus - 1, -1))} aria-label="Trước">‹</button>
          <button onClick={() => setFocus(Math.min(focus + 1, N))} aria-label="Sau">›</button>
        </div>
      </div>
      <div className="panel3d-body">
        <AnimatePresence mode="wait">
          <motion.div key={focus} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            {focus === -1 && <MapView setFocus={setFocus} visited={visited} />}
            {node?.kind === 'part' && <PartView node={node} />}
            {node?.kind === 'arg' && <ArgView node={node} />}
            {focus === N && <ConclusionView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}

function MapView({ setFocus, visited }) {
  return (
    <>
      <p className="panel3d-lead">{cq9.intro}</p>
      <h3 className="panel3d-group gold">Khai thác nội dung</h3>
      <ul className="node-list">
        {nodes.map((n, i) => n.kind === 'part' && (
          <li key={n.key}>
            <button onClick={() => setFocus(i)} className={visited.has(i) ? 'seen' : ''}>
              <span className="nb gold">{n.num}</span>
              <span><b>{n.part.title.replace('Tư tưởng Hồ Chí Minh về ', 'Về ')}</b><small>{n.part.subtitle}</small></span>
            </button>
          </li>
        ))}
      </ul>
      <h3 className="panel3d-group">Phản biện CQ9 · 7 lập luận</h3>
      <ul className="node-list">
        {nodes.map((n, i) => n.kind === 'arg' && (
          <li key={n.key}>
            <button onClick={() => setFocus(i)} className={visited.has(i) ? 'seen' : ''}>
              <span className="nb">{n.num}</span>
              <span><b>{n.arg.title}</b><small>{n.label}</small></span>
            </button>
          </li>
        ))}
      </ul>
      <button className="btn-gold wide" onClick={() => setFocus(N)}>Ghép lại: trả lời CQ9 ✦</button>
    </>
  );
}

function PartView({ node }) {
  const p = node.part;
  return (
    <>
      <div className="pv-head">
        <span className="nb gold big">{node.num}</span>
        <div>
          <span className="pv-kicker">{p.part}</span>
          <h2>{p.title}</h2>
        </div>
      </div>
      <p className="panel3d-lead">{p.subtitle}</p>
      <ol className="topic-list">
        {p.blocks.map((b) => (
          <li key={b.id}>
            <button onClick={() => scrollToId(b.id)}>
              <small>{b.kicker}</small>
              <b>{b.title}</b>
              {(b.idea || b.lead || b.quote?.text) && <span>{trim(b.idea || b.lead || `“${b.quote.text}”`)}</span>}
            </button>
          </li>
        ))}
      </ol>
      <button className="btn-red wide" onClick={() => scrollToId(p.id)}>Đọc chi tiết {p.part} ↓</button>
    </>
  );
}

function ArgView({ node }) {
  const a = node.arg;
  return (
    <>
      <div className="pv-head">
        <span className="nb big">{node.num}</span>
        <div>
          <span className="pv-kicker">Lập luận {node.num}/7 · {a.label}</span>
          <h2>{a.title}</h2>
        </div>
      </div>
      <p className="claim">{a.claim}</p>
      <ul className="points">
        {a.points.map((t, k) => (
          <motion.li key={k} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.1 }}>{t}</motion.li>
        ))}
      </ul>
      <blockquote className="q-red">“{a.quote.text}”<cite>— {a.quote.source}</cite></blockquote>
      <p className="link-note">Liên hệ: {a.link}</p>
    </>
  );
}

function ConclusionView() {
  return (
    <>
      <span className="pv-kicker">Kết luận CQ9</span>
      <h2 className="concl-title">{cq9.conclusion.title}</h2>
      <p className="claim">{cq9.conclusion.text}</p>
      <div className="final">Văn hóa còn thì dân tộc còn.</div>
    </>
  );
}

function trim(t, n = 110) {
  return t.length > n ? `${t.slice(0, n).trim()}…` : t;
}

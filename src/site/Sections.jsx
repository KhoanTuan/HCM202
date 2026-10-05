// Các mục chi tiết khi cuộn xuống — bố cục web, mỗi khối "dựng" lên bằng hiệu ứng 3D khi vào khung nhìn.
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Icon from '../art/Icon.jsx';
import { Cranes, DrumRings, InkMountains, Lotus, SilkWaves } from '../art/Ornaments.jsx';
import { contentParts, cq9Part, sources, thanks } from '../content/parts.js';
import { meta } from '../content/deck.js';
import { scrollToId } from './Hero.jsx';

const ease = [0.22, 1, 0.36, 1];
const rise = {
  hidden: { opacity: 0, y: 90, rotateX: 24, scale: 0.94 },
  show: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.9, ease, staggerChildren: 0.07, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function Sections({ onExplore }) {
  return (
    <main>
      {contentParts.map((p, k) => <Part key={p.id} p={p} k={k} />)}
      {cq9Part && <Part p={cq9Part} k={contentParts.length} onExplore={onExplore} />}
      <footer className="site-foot">
        <div className="wrap">
          {sources && (
            <>
              <h2>Tài liệu tham khảo</h2>
              <ol>{sources.items.map((s) => <li key={s}>{s}</li>)}</ol>
            </>
          )}
          <div className="foot-end">
            <span>{meta.group} · {meta.course}</span>
            <span>{thanks?.title}</span>
            <a href="#/slide/1">Bản trình chiếu dự phòng</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Một phần: banner + các khối ---------- */
function Part({ p, k, onExplore }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const mtY = useTransform(scrollYProgress, [0, 1], ['10%', '-25%']);
  const drumR = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const red = k % 2 === 0;

  return (
    <section id={p.id} className="part">
      <header ref={ref} className={`part-banner ${red ? 'red' : 'ink'}`}>
        <motion.div className="pb-drum" style={{ rotate: drumR }}>
          <DrumRings size={1100} color={red ? '#f1c94a' : '#b8862b'} opacity={red ? 0.14 : 0.13} spin={false} />
        </motion.div>
        <motion.div className="pb-mountains" style={{ y: mtY }}>
          <InkMountains opacity={red ? 0.5 : 0.85} tint={red ? '#2b0606' : '#6b4a3a'} top={600} pagoda={!red} />
        </motion.div>
        <Cranes x={1400} y={200} count={4} color={red ? '#f1c94a' : '#8e1b1b'} />
        <motion.div className="wrap pb-copy" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={rise}>
          <motion.span className="pb-part" variants={item}>{p.part}</motion.span>
          <motion.h2 variants={item}>{p.title}</motion.h2>
          <motion.p variants={item}>{p.subtitle}</motion.p>
        </motion.div>
        <SilkWaves height={90} />
      </header>

      <div className="wrap blocks">
        {p.blocks.map((b) => <Block key={b.id} b={b} onExplore={onExplore} />)}
      </div>
    </section>
  );
}

/* ---------- Khối nội dung (tự chọn cách trình bày theo dữ liệu) ---------- */
function Block({ b, onExplore }) {
  return (
    <div className="block-3d">
      <motion.article id={b.id} className={`block layout-${b.layout}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.08 }} variants={rise}>
        <motion.header className="b-head" variants={item}>
          {b.kicker && <span className="b-kicker">{b.kicker}</span>}
          <h3>{b.title}</h3>
          {b.owner && <span className="b-owner">Phụ trách: {b.owner}</span>}
        </motion.header>

        {(b.idea || b.lead) && <motion.p className="b-lead" variants={item}>{b.idea || b.lead}</motion.p>}

        {b.layout === 'feature' ? (
          <div className="b-feature">
            <Quote q={b.quote} big />
            <Items items={b.items} list />
          </div>
        ) : (
          <>
            {b.quote && b.layout !== 'cards' && b.layout !== 'split' && <Quote q={b.quote} />}
            {b.stats && <Stats stats={b.stats} />}
            {b.center && <Hub center={b.center} items={b.items} />}
            {!b.center && b.items && b.layout !== 'pillars' && <Items items={b.items} numbered={b.numbered || b.layout === 'quoteCards' || b.layout === 'steps'} cols={b.cols} />}
            {b.layout === 'pillars' && <Pillars items={b.items} />}
            {b.left && <Split left={b.left} right={b.right} />}
            {b.phases && <Timeline phases={b.phases} chipsTitle={b.chipsTitle} chips={b.chips} />}
            {b.grid && <Principles grid={b.grid} />}
            {b.rows && <Rows rows={b.rows} />}
            {b.layers && <Layers layers={b.layers} conclusion={b.conclusion} onExplore={onExplore} />}
            {b.quote && (b.layout === 'cards' || b.layout === 'split') && <Quote q={b.quote} soft />}
          </>
        )}
        {b.footnote && <motion.p className="b-foot" variants={item}>{b.footnote}</motion.p>}
      </motion.article>
    </div>
  );
}

function Quote({ q, big, soft }) {
  if (!q) return null;
  return (
    <motion.blockquote className={`b-quote ${big ? 'big' : ''} ${soft ? 'soft' : ''}`} variants={item}>
      {big && <span className="bq-drum"><DrumRings size={520} color="#f1c94a" opacity={0.18} spin={false} /></span>}
      <p>“{q.text}”</p>
      <cite>— {q.source}</cite>
    </motion.blockquote>
  );
}

function Items({ items, numbered, list, cols }) {
  return (
    <div className={list ? 'b-list' : `b-grid cols-${cols || Math.min(items.length, 4)}`}>
      {items.map((it, i) => (
        <motion.div key={i} className="b-card" variants={item} whileHover={{ y: -6 }}>
          {numbered ? <span className="b-num">{it.n || String(i + 1).padStart(2, '0')}</span> : it.icon && <span className="b-icon"><Icon name={it.icon} size={22} /></span>}
          <div>
            <h4>{it.title}</h4>
            {it.text && <p>{it.text}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Stats({ stats }) {
  return (
    <div className="b-grid cols-2">
      {stats.map((s) => (
        <motion.div key={s.value} className="b-stat" variants={item}>
          <b>{s.value}</b><h4>{s.label}</h4><p>{s.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

function Hub({ center, items }) {
  const half = Math.ceil(items.length / 2);
  return (
    <div className="b-hub">
      <Items items={items.slice(0, half)} list />
      <motion.div className="hub-core" variants={item}>
        <DrumRings size={220} color="#f1c94a" opacity={0.45} />
        <span>{center}</span>
      </motion.div>
      <Items items={items.slice(half)} list />
    </div>
  );
}

function Split({ left, right }) {
  const P = ({ d }) => (
    <motion.div className="b-panel" variants={item}>
      <div className="b-panel-head"><Icon name={d.icon} size={22} /><h4>{d.title}</h4></div>
      <ul>{d.items.map((t) => <li key={t}>{t}</li>)}</ul>
    </motion.div>
  );
  return (
    <div className="b-split">
      <P d={left} />
      <span className="b-split-mid" aria-hidden>
        <svg viewBox="-160 -160 320 340" width="70"><Lotus s={0.8} color="#c9973a" sw={3} /></svg>
      </span>
      <P d={right} />
    </div>
  );
}

function Timeline({ phases, chipsTitle, chips }) {
  return (
    <>
      <div className="b-timeline">
        {phases.map((ph) => (
          <motion.div key={ph.when} className="tl" variants={item}>
            <span className="wtl-dot" />
            <b className="wtl-when">{ph.when}</b>
            <h4>{ph.title}</h4>
            <p>{ph.text}</p>
          </motion.div>
        ))}
      </div>
      {chips && (
        <motion.div className="b-chips" variants={item}>
          <span>{chipsTitle}:</span>
          {chips.map((c) => <em key={c}>{c}</em>)}
        </motion.div>
      )}
    </>
  );
}

function Principles({ grid }) {
  return (
    <div className="b-principles">
      {grid.map((g) => (
        <motion.div key={g.tag} className={`pr ${g.tone}`} variants={item} whileHover={{ scale: 1.02 }}>
          <b>{g.tag}</b><span>→</span><i>{g.action}</i>
        </motion.div>
      ))}
    </div>
  );
}

function Rows({ rows }) {
  return (
    <div className="b-rows">
      {rows.map((r) => (
        <motion.div key={r.field} className="row" variants={item}>
          <span className="row-f"><Icon name={r.icon} size={20} />{r.field}</span>
          <span>{r.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Layers({ layers, conclusion, onExplore }) {
  return (
    <>
      <div className="b-layers">
        {layers.map((l, i) => (
          <motion.div key={l.n} className="layer-row" variants={item} style={{ marginLeft: `${i * 4}%` }}>
            <span className="b-num">{l.n}</span>
            <h4>{l.title}</h4>
            <p>{l.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div className="b-concl" variants={item}>
        <p>{conclusion}</p>
        <button className="btn-gold" onClick={() => { scrollToId('kham-pha'); onExplore?.(); }}>Khám phá 7 lập luận ở khung đầu ↑</button>
      </motion.div>
    </>
  );
}

function Pillars({ items }) {
  return (
    <div className="b-pillars">
      {items.map((it, i) => (
        <motion.div key={it.title} className="wpillar" variants={{ hidden: { opacity: 0, scaleY: 0.3 }, show: { opacity: 1, scaleY: 1, transition: { duration: 0.8, delay: i * 0.15, ease } } }} style={{ originY: 1 }}>
          <span className="b-icon gold"><Icon name={it.icon} size={26} /></span>
          <h4>{it.title}</h4>
          <p>{it.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

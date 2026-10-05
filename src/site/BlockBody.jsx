// Phần thân của một khối nội dung (trích dẫn, thẻ, sơ đồ…) — tự chọn cách trình bày theo dữ liệu trong deck.js.
import { motion } from 'framer-motion';
import Icon from '../art/Icon.jsx';
import { DrumRings, Lotus } from '../art/Ornaments.jsx';

export const ease = [0.22, 1, 0.36, 1];
export const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export function BlockHead({ b }) {
  return (
    <motion.header className="b-head" variants={item}>
      {b.kicker && <span className="b-kicker">{b.kicker}</span>}
      <h3>{b.title}</h3>
      {b.owner && <span className="b-owner">Phụ trách: {b.owner}</span>}
    </motion.header>
  );
}

export default function BlockBody({ b }) {
  return (
    <>
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
          {b.layers && <Layers layers={b.layers} conclusion={b.conclusion} />}
          {b.quote && (b.layout === 'cards' || b.layout === 'split') && <Quote q={b.quote} soft />}
        </>
      )}
      {b.footnote && <motion.p className="b-foot" variants={item}>{b.footnote}</motion.p>}
    </>
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

function Layers({ layers, conclusion }) {
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
        <span className="b-next">Cuộn tiếp để đi qua các bia ↓</span>
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

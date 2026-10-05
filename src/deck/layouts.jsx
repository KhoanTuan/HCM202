// Các bố cục slide. Mỗi bố cục nhận `s` (dữ liệu slide) và `meta`.
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { RevealContext } from './reveal.js';
import Icon from '../art/Icon.jsx';
import { SilkWaves, TopRibbon, InkMountains, Cranes, Lotus, DrumRings, Bamboo, Cloud, Star } from '../art/Ornaments.jsx';
import { stagger, fadeUp, fadeIn, popIn, slideLeft, slideRight, draw, ruleGrow } from './motion.js';

const M = motion.div;

/* ---------------- Khung nền dùng chung ---------------- */
function PaperFrame({ children, s, meta, index, total, mountains = true, bamboo = false, cranes = true, drum = 'right' }) {
  return (
    <div className="slide paper">
      <TopRibbon />
      {drum && (
        <div className={`drum-wrap drum-${drum}`}>
          <DrumRings size={980} opacity={0.12} />
        </div>
      )}
      {mountains && <InkMountains opacity={0.55} top={760} />}
      {bamboo && <Bamboo x={30} />}
      {cranes && <Cranes x={1690} y={58} count={3} color="#8e1b1b" scale={0.55} />}
      <SilkWaves height={150} />
      <div className="content">{children}</div>
      <footer className="foot">
        <span>{s.owner ? `Phụ trách: ${s.owner}` : meta.group}</span>
        <span>Nguồn: {meta.source}</span>
        <span className="pageno">{String(index + 1).padStart(2, '0')} / {total}</span>
      </footer>
    </div>
  );
}

function Head({ s, center = false }) {
  return (
    <M className={`head ${center ? 'center' : ''}`} variants={stagger(0.08, 0)}>
      {s.kicker && <M className="kicker" variants={fadeUp}>{s.kicker}</M>}
      <M variants={fadeUp}><h2 className="title">{s.title}</h2></M>
      <M className="gold-rule" variants={ruleGrow} style={{ originX: center ? 0.5 : 0 }} />
    </M>
  );
}

// Nội dung chỉ "dựng" lên khi slide bay tới vị trí trình chiếu (RevealContext).
function Root({ children, className = '' }) {
  const shown = useContext(RevealContext);
  return (
    <M className={`stack ${className}`} variants={stagger(0.1, 0.1)} initial="hidden" animate={shown ? 'show' : 'hidden'}>
      {children}
    </M>
  );
}

function QuoteBand({ q, variant = 'red' }) {
  if (!q) return null;
  return (
    <M className={`quote-band ${variant}`} variants={fadeUp}>
      <span className="qmark">“</span>
      <p>{q.text}</p>
      <cite>— {q.source}</cite>
    </M>
  );
}

function IconBadge({ name, size = 30, variant = 'red' }) {
  return (
    <span className={`badge ${variant}`}>
      <Icon name={name} size={size} />
    </span>
  );
}

function CountUp({ value }) {
  const n = parseInt(value, 10);
  const mv = useMotionValue(0);
  const reduce = useReducedMotion();
  const shown = useContext(RevealContext);
  const out = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (isNaN(n) || !shown) return;
    if (reduce) { mv.set(n); return; }
    const from = n > 100 ? n - 60 : 0;
    mv.set(from);
    const c = animate(mv, n, { duration: 1.6, ease: 'easeOut', delay: 0.3 });
    return c.stop;
  }, [n, mv, reduce, shown]);
  if (isNaN(n)) return <span>{value}</span>;
  return <motion.span>{out}</motion.span>;
}

/* ================================================================== */
/*                               LAYOUTS                              */
/* ================================================================== */

function Title({ s }) {
  const words = s.title.split(' ');
  return (
    <div className="slide red">
      <div className="red-glow" />
      <div className="drum-wrap drum-right big"><DrumRings size={1300} color="#f1c94a" opacity={0.14} /></div>
      <InkMountains opacity={0.5} tint="#2b0606" top={640} pagoda />
      <svg className="lotus-corner" viewBox="-200 -260 400 520" aria-hidden>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <Lotus s={1.2} color="#f1c94a" opacity={0.55} sw={1.4} />
        </motion.g>
      </svg>
      <Cranes x={1380} y={180} count={5} color="#f1c94a" scale={0.9} />
      <SilkWaves height={120} />
      <Root className="title-stack">
        <M variants={popIn}><Star size={110} className="title-star" /></M>
        <M className="kicker gold" variants={fadeUp}>{s.kicker}</M>
        <M className="gold-rule light" variants={ruleGrow} style={{ originX: 0 }} />
        <h1 className="hero-title">
          {words.map((w, i) => (
            <motion.span key={i} className="word" variants={fadeUp}>{w}&nbsp;</motion.span>
          ))}
        </h1>
        <M className="gold-rule light short" variants={ruleGrow} style={{ originX: 0 }} />
        <M className="hero-sub" variants={fadeUp}>{s.subtitle}</M>
      </Root>
    </div>
  );
}

function Stats(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <div className="stats-row">
          {s.stats.map((st, i) => (
            <M key={i} className={`stat ${i === 0 ? 'stat-red' : ''}`} variants={popIn} whileHover={{ y: -8 }}>
              <div className="stat-value"><CountUp value={st.value} /></div>
              <div className="stat-label">{st.label}</div>
              <p>{st.text}</p>
            </M>
          ))}
          <M className="stat question" variants={slideLeft}>
            <span className="q-tag">CQ9</span>
            <p className="q-text">{s.question}</p>
            <motion.span className="q-pulse" animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.4, repeat: Infinity }} />
          </M>
        </div>
      </Root>
    </PaperFrame>
  );
}

function Agenda(p) {
  const { s } = p;
  return (
    <PaperFrame {...p} drum="left">
      <Root>
        <Head s={s} />
        <div className="agenda">
          {s.items.map((it, i) => (
            <M key={i} className={`agenda-tile ${it.n === 'CQ9' ? 'hot' : ''}`} variants={fadeUp} whileHover={{ y: -12, rotate: -0.5 }}>
              <span className="agenda-n">{it.n}</span>
              <span className="agenda-icon"><Icon name={it.icon} size={64} stroke={1.2} /></span>
              <span className="agenda-t">{it.title}</span>
            </M>
          ))}
        </div>
      </Root>
    </PaperFrame>
  );
}

function Divider({ s }) {
  const red = s.art === 'red';
  return (
    <div className={`slide ${red ? 'red' : 'paper'} divider`}>
      {red && <div className="red-glow" />}
      <div className="drum-wrap drum-center"><DrumRings size={1500} color={red ? '#f1c94a' : '#b8862b'} opacity={red ? 0.13 : 0.12} /></div>
      {!red && <motion.div className="sun" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4 }} />}
      <InkMountains opacity={red ? 0.55 : 0.9} tint={red ? '#2b0606' : '#6b4a3a'} top={red ? 700 : 600} pagoda={!red} />
      <Cranes x={red ? 1450 : 1300} y={red ? 200 : 170} count={5} color={red ? '#f1c94a' : '#8e1b1b'} />
      <svg className="clouds" viewBox="0 0 1920 1080" aria-hidden>
        <Cloud x={180} y={260} s={1.4} color={red ? '#f1c94a' : '#c9973a'} opacity={0.4} />
        <Cloud x={1560} y={720} s={1.1} color={red ? '#f1c94a' : '#c9973a'} opacity={0.35} />
      </svg>
      <SilkWaves height={150} tone={red ? 'red' : 'red'} />
      <Root className="divider-stack">
        <M className={`kicker ${red ? 'gold' : ''}`} variants={fadeUp}>{s.part}</M>
        <motion.h1 className="divider-title" variants={{ hidden: { opacity: 0, letterSpacing: '0.2em', y: 20 }, show: { opacity: 1, letterSpacing: '0em', y: 0, transition: { duration: 1.1 } } }}>
          {s.title}
        </motion.h1>
        <M className={`gold-rule ${red ? 'light' : ''}`} variants={ruleGrow} style={{ originX: 0.5 }} />
        <M className="divider-sub" variants={fadeUp}>{s.subtitle}</M>
      </Root>
    </div>
  );
}

function QuoteCards(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <QuoteBand q={s.quote} />
        <div className="grid-4">
          {s.items.map((it, i) => (
            <M key={i} className="card numbered" variants={fadeUp} whileHover={{ y: -8 }}>
              <span className="num-circle">{it.n}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </M>
          ))}
        </div>
      </Root>
    </PaperFrame>
  );
}

function Hub(p) {
  const { s } = p;
  const pos = [
    { x: 0, y: 0, side: 'l' }, { x: 0, y: 1, side: 'l' },
    { x: 1, y: 0, side: 'r' }, { x: 1, y: 1, side: 'r' },
  ];
  return (
    <PaperFrame {...p} drum={false}>
      <Root>
        <Head s={s} />
        <div className="hub">
          <svg className="hub-lines" viewBox="0 0 1640 660" aria-hidden>
            {[[600, 135], [600, 525], [1040, 135], [1040, 525]].map(([x, y], i) => (
              <motion.path key={i} d={`M820 330 Q ${(820 + x) / 2} ${y} ${x} ${y}`} stroke="#c9973a" strokeWidth="2.5" fill="none" strokeDasharray="6 8" variants={draw} />
            ))}
          </svg>
          <M className="hub-center" variants={popIn}>
            <div className="hub-ring"><DrumRings size={330} color="#f1c94a" opacity={0.5} /></div>
            <span>{s.center}</span>
          </M>
          {s.items.map((it, i) => (
            <M key={i} className={`hub-card hub-${pos[i].side} row-${pos[i].y}`} variants={pos[i].side === 'l' ? slideRight : slideLeft} whileHover={{ scale: 1.03 }}>
              <IconBadge name={it.icon} />
              <div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            </M>
          ))}
        </div>
      </Root>
    </PaperFrame>
  );
}

function Cards(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        {s.lead && <M className="lead-box" variants={fadeUp}><span className="lead-tag">Mục tiêu</span>{s.lead.replace(/^Mục tiêu:\s*/, '')}</M>}
        <div className={`grid-${s.cols || 4}`}>
          {s.items.map((it, i) => (
            <M key={i} className={`card icon-card ${s.numbered ? 'red-top' : ''}`} variants={fadeUp} whileHover={{ y: -10 }}>
              {s.numbered ? <span className="num-circle">{String(i + 1).padStart(2, '0')}</span> : <IconBadge name={it.icon} />}
              <h3>{it.title}</h3>
              <p>{it.text}</p>
              {s.numbered && <span className="card-icon-faint"><Icon name={it.icon} size={90} stroke={1} /></span>}
            </M>
          ))}
        </div>
        {s.quote && <QuoteBand q={s.quote} variant="light" />}
      </Root>
    </PaperFrame>
  );
}

function Split(p) {
  const { s } = p;
  const Panel = ({ d, v }) => (
    <M className="panel" variants={v} whileHover={{ y: -6 }}>
      <div className="panel-head"><Icon name={d.icon} size={34} /><h3>{d.title}</h3></div>
      <ul>
        {d.items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </M>
  );
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <div className="split">
          <Panel d={s.left} v={slideRight} />
          <M className="split-mid" variants={popIn}>
            <svg viewBox="-160 -160 320 340" width="150" aria-hidden><Lotus s={0.8} color="#c9973a" sw={2.5} /></svg>
          </M>
          <Panel d={s.right} v={slideLeft} />
        </div>
        {s.quote && <QuoteBand q={s.quote} variant="light" />}
      </Root>
    </PaperFrame>
  );
}

function Timeline(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <div className="timeline">
          <svg className="tl-line" viewBox="0 0 1640 40" preserveAspectRatio="none" aria-hidden>
            <motion.path d="M20 20 L1620 20" stroke="#8e1b1b" strokeWidth="4" variants={draw} />
          </svg>
          {s.phases.map((ph, i) => (
            <M key={i} className="tl-item" variants={fadeUp}>
              <span className="tl-dot" />
              <span className="tl-when">{ph.when}</span>
              <div className="card">
                <h3>{ph.title}</h3>
                <p>{ph.text}</p>
              </div>
            </M>
          ))}
        </div>
        <M className="chips-title" variants={fadeUp}>{s.chipsTitle}</M>
        <div className="chips">
          {s.chips.map((c, i) => (
            <M key={i} className="chip" variants={popIn} whileHover={{ scale: 1.06 }}>{c}</M>
          ))}
        </div>
      </Root>
    </PaperFrame>
  );
}

function Feature(p) {
  const { s } = p;
  return (
    <PaperFrame {...p} drum={false} bamboo>
      <Root>
        <Head s={s} />
        <div className="feature">
          <M className="feature-quote" variants={slideRight}>
            <div className="fq-drum"><DrumRings size={720} color="#f1c94a" opacity={0.18} /></div>
            <span className="qmark big">“</span>
            <p>{s.quote.text}</p>
            <cite>— {s.quote.source}</cite>
          </M>
          <div className="feature-list">
            {s.items.map((it, i) => (
              <M key={i} className="feature-item" variants={slideLeft} whileHover={{ x: -8 }}>
                <IconBadge name={it.icon} />
                <div>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </div>
              </M>
            ))}
            {s.footnote && <M className="footnote" variants={fadeIn}>{s.footnote}</M>}
          </div>
        </div>
      </Root>
    </PaperFrame>
  );
}

function Principles(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        {s.lead && <M className="lead" variants={fadeUp}>{s.lead}</M>}
        <div className="principles">
          {s.grid.map((g, i) => (
            <M key={i} className={`pr-tile ${g.tone}`} variants={popIn} whileHover={{ scale: 1.03 }}>
              <span className="pr-tag">{g.tag}</span>
              <motion.span className="pr-arrow" animate={{ x: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}>→</motion.span>
              <span className="pr-action">{g.action}</span>
            </M>
          ))}
        </div>
        {s.footnote && <M className="footnote" variants={fadeIn}>{s.footnote}</M>}
      </Root>
    </PaperFrame>
  );
}

function Steps(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <div className="steps">
          {s.items.map((it, i) => (
            <M key={i} className="step" variants={fadeUp} whileHover={{ y: -10 }}>
              <span className="step-n">{i + 1}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
              {i < s.items.length - 1 && <span className="step-arrow">⟶</span>}
            </M>
          ))}
        </div>
        {s.footnote && <M className="lead-box soft" variants={fadeUp}>{s.footnote}</M>}
      </Root>
    </PaperFrame>
  );
}

function Table(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <div className="vtable">
          <M className="vrow vhead" variants={fadeUp}><span>Lĩnh vực</span><span>Nội dung vận dụng</span></M>
          {s.rows.map((r, i) => (
            <M key={i} className="vrow" variants={slideRight} whileHover={{ x: 10 }}>
              <span className="vfield"><IconBadge name={r.icon} size={24} />{r.field}</span>
              <span>{r.text}</span>
            </M>
          ))}
        </div>
      </Root>
    </PaperFrame>
  );
}

function Cq9(p) {
  const { s } = p;
  return (
    <PaperFrame {...p} drum="right">
      <Root>
        <Head s={s} />
        <div className="cq9-layers">
          {s.layers.map((l, i) => (
            <M key={i} className="layer" variants={fadeUp} style={{ marginLeft: i * 60 }} whileHover={{ x: 12 }}>
              <span className="num-circle">{l.n}</span>
              <h3>{l.title}</h3>
              <p>{l.text}</p>
            </M>
          ))}
        </div>
        <M className="cq9-bottom" variants={fadeUp}>
          <p className="conclusion">{s.conclusion}</p>
          <motion.a href="#/" className="cta" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 0 0 0 rgba(241,201,74,.6)', '0 0 0 18px rgba(241,201,74,0)'] }}
            transition={{ duration: 1.8, repeat: Infinity }}>
            {s.cta} →
          </motion.a>
        </M>
      </Root>
    </PaperFrame>
  );
}

function Pillars(p) {
  const { s } = p;
  return (
    <PaperFrame {...p} drum="center">
      <Root>
        <Head s={s} center />
        <div className="pillars">
          {s.items.map((it, i) => (
            <motion.div key={i} className="pillar" variants={{ hidden: { opacity: 0, scaleY: 0.2 }, show: { opacity: 1, scaleY: 1, transition: { duration: 0.9, delay: i * 0.15 } } }} style={{ originY: 1 }}>
              <span className="pillar-cap" />
              <IconBadge name={it.icon} size={40} variant="gold" />
              <h3>{it.title}</h3>
              <p>{it.text}</p>
              <span className="pillar-base" />
            </motion.div>
          ))}
        </div>
      </Root>
    </PaperFrame>
  );
}

function Sources(p) {
  const { s } = p;
  return (
    <PaperFrame {...p}>
      <Root>
        <Head s={s} />
        <ol className="sources">
          {s.items.map((t, i) => <motion.li key={i} variants={fadeUp}>{t}</motion.li>)}
        </ol>
      </Root>
    </PaperFrame>
  );
}

function Thanks({ s }) {
  return (
    <div className="slide red divider">
      <div className="red-glow" />
      <div className="drum-wrap drum-center"><DrumRings size={1500} color="#f1c94a" opacity={0.16} /></div>
      <InkMountains opacity={0.5} tint="#2b0606" top={720} />
      <Cranes x={1400} y={220} count={5} color="#f1c94a" />
      <svg className="lotus-corner" viewBox="-200 -260 400 520" aria-hidden><Lotus s={1.2} color="#f1c94a" opacity={0.5} sw={1.4} /></svg>
      <SilkWaves height={150} />
      <Root className="divider-stack">
        <M variants={popIn}><Star size={120} /></M>
        <M variants={fadeUp}><h1 className="divider-title italic">{s.title}</h1></M>
        <M className="gold-rule light" variants={ruleGrow} style={{ originX: 0.5 }} />
        <M className="divider-sub" variants={fadeUp}>{s.subtitle}</M>
      </Root>
    </div>
  );
}

export const layouts = {
  title: Title,
  stats: Stats,
  agenda: Agenda,
  divider: Divider,
  quoteCards: QuoteCards,
  hub: Hub,
  cards: Cards,
  split: Split,
  timeline: Timeline,
  feature: Feature,
  principles: Principles,
  steps: Steps,
  table: Table,
  cq9: Cq9,
  pillars: Pillars,
  sources: Sources,
  thanks: Thanks,
};

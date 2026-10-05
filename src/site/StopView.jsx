// Một điểm dừng của hành trình: tấm thẻ nội dung lớn bay vào từ chiều sâu khi tới, lùi ra khi rời đi.
import { motion } from 'framer-motion';
import Icon from '../art/Icon.jsx';
import { DrumRings } from '../art/Ornaments.jsx';
import { cq9 } from '../content/cq9.js';
import { meta } from '../content/deck.js';
import { contentParts, cq9Part } from '../content/parts.js';
import { chapters, stops } from '../content/stops.js';
import BlockBody, { ease, item } from './BlockBody.jsx';
import Fit from './Fit.jsx';
import { goTo } from './nav.js';

const card = {
  hidden: { opacity: 0, x: -70, z: -260, rotateY: 16, scale: 0.94 },
  show: { opacity: 1, x: 0, z: 0, rotateY: 0, scale: 1, transition: { duration: 0.85, ease, staggerChildren: 0.07, delayChildren: 0.18 } },
};
const cardCenter = {
  // ghi rõ cả x / rotateY = 0 để thẻ luôn nằm thẳng, đúng giữa màn hình
  hidden: { opacity: 0, x: 0, y: 60, z: -300, rotateX: 18, rotateY: 0, scale: 0.92 },
  show: { opacity: 1, x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, scale: 1, transition: { duration: 0.9, ease, staggerChildren: 0.08, delayChildren: 0.2 } },
};

export default function StopView({ s }) {
  const full = s.type === 'block' || s.type === 'arg' || s.type === 'divider' || s.type === 'conclusion';
  const center = full || s.type === 'conclusion' || s.type === 'end';
  return (
    <motion.section
      className={`stop stop-${s.type} ${center ? 'center' : ''}`}
      id={`s-${s.index + 1}`}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.55 }}
    >
      {s.type === 'intro' ? <Intro s={s} /> : (
        full ? (
          <motion.div className={`stop-card card-${s.type} card-red`} variants={cardCenter}>
            <span className="dv-drum" aria-hidden><DrumRings size={900} color="#f1c94a" opacity={0.08} /></span>
            <Fit>{s.type === 'block' ? <Block s={s} /> : s.type === 'arg' ? <Arg s={s} /> : s.type === 'conclusion' ? <Conclusion s={s} /> : <Divider s={s} />}</Fit>
          </motion.div>
        ) : (
        <motion.div className={`stop-card card-${s.type}`} variants={center ? cardCenter : card}>
          {s.type === 'divider' && <span className="dv-drum" aria-hidden><DrumRings size={620} color="#f1c94a" opacity={0.16} /></span>}
          {s.type === 'conclusion' && <span className="dv-drum" aria-hidden><DrumRings size={760} color="#f1c94a" opacity={0.2} /></span>}
          <Fit>
            {s.type === 'divider' && <Divider s={s} />}
            {s.type === 'conclusion' && <Conclusion s={s} />}
            {s.type === 'end' && <End s={s} />}
          </Fit>
        </motion.div>
        )
      )}
    </motion.section>
  );
}

/* ---------- Khung đầu: câu hỏi + toàn bộ mục lục ---------- */
function Intro({ s }) {
  const st = s.intro;
  const rows = [
    ...contentParts.map((p, i) => ({ num: chapters[i + 1].num, title: p.title.replace('Tư tưởng Hồ Chí Minh về ', 'Về '), sub: p.subtitle, start: chapters[i + 1].start })),
    { num: 'CQ9', title: 'Trả lời câu hỏi phản biện', sub: `${cq9.args.length} ý: văn hóa là gì · giữ gìn · nếu đánh mất`, start: chapters[chapters.length - 2].start, cq: true },
  ];
  return (
    <motion.div className="intro" variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }}>
      <motion.p className="eyebrow" variants={item}>{meta.course} · {meta.group} · Câu hỏi phản biện {meta.cqid}</motion.p>
      <motion.h1 variants={item}>Tại sao <q>văn hóa còn thì dân tộc còn</q>?</motion.h1>
      <motion.p className="intro-lede" variants={item}>Chương VI · {meta.title}</motion.p>
      {st && (
        <motion.div className="intro-stats" variants={item}>
          {st.stats.map((x) => <div key={x.value}><b>{x.value}</b><span>{x.label}</span></div>)}
        </motion.div>
      )}
      <motion.ol className="intro-map" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
        {rows.map((r) => (
          <motion.li key={r.num} variants={item}>
            <button onClick={() => goTo(r.start)} className={r.cq ? 'cq' : ''}>
              <span className="im-num">{r.num}</span>
              <span className="im-txt"><b>{r.title}</b><small>{r.sub}</small></span>
            </button>
          </motion.li>
        ))}
      </motion.ol>
      <motion.div className="intro-foot" variants={item}>
        <button className="intro-go" onClick={() => goTo(1)}>Bắt đầu <span>↓</span></button>
        <small>Cuộn chuột hoặc phím → để chuyển phần · F: toàn màn hình</small>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Mở chương ---------- */
function Divider({ s }) {
  const p = s.part;
  const isCQ = p === cq9Part;
  const list = isCQ ? cq9.args.map((a) => a.title) : p.blocks.map((b) => b.title);
  return (
    <>
      <motion.header className="ch dv-head" variants={item}>
        <span className="dv-big">{s.num}</span>
        <span className="ch-label">{p.part}</span>
        <h2>{p.title}</h2>
        <p className="dv-sub2">{p.subtitle}</p>
      </motion.header>
      <motion.div className="ch-paper dv-paper" variants={item}>
        <span className="dv-paper-title">{isCQ ? 'Ba ý trả lời' : 'Trong phần này'}</span>
        <ol className="dv-items">
          {list.map((t, i) => (
            <li key={t}>
              <button onClick={() => goTo(isCQ ? stops.findIndex((x) => x.arg === cq9.args[i]) : s.index + 1 + i)}>
                <b>{String(i + 1).padStart(2, '0')}</b><span>{t}</span>
              </button>
            </li>
          ))}
        </ol>
      </motion.div>
    </>
  );
}

/* ---------- Một mục nội dung ---------- */
/* Đầu thẻ căn giữa: nhãn phần · tiêu đề lớn · chấm tiến độ (giống màn kết luận) */
function CenterHead({ s, label, kicker, title, owner, num }) {
  return (
    <motion.header className="ch" variants={item}>
      <span className="ch-label">{label}</span>
      {kicker && <span className="ch-kicker">{kicker}</span>}
      <h2>{num && <span className="ch-num">{num}</span>}{title}</h2>
      <div className="ch-meta">
        {owner && <span className="ch-owner">Phụ trách: {owner}</span>}
        {s.subs > 1 && (
          <span className="ch-dots">
            {Array.from({ length: s.subs }, (_, i) => <i key={i} className={i === s.sub ? 'on' : i < s.sub ? 'past' : ''} />)}
          </span>
        )}
      </div>
    </motion.header>
  );
}

function Block({ s }) {
  const b = s.block;
  return (
    <>
      <CenterHead s={s} label={`${s.part.part}${s.subs > 1 ? ` · Mục ${s.sub + 1}/${s.subs}` : ''}`} kicker={b.kicker} title={b.title} owner={b.owner} />
      <div className={`ch-paper block layout-${b.layout}`}>
        <BlockBody b={b} />
      </div>
    </>
  );
}

/* ---------- Một lập luận CQ9 ---------- */
function Arg({ s }) {
  const a = s.arg;
  return (
    <>
      <CenterHead s={s} label={`CQ9 · Ý ${s.num}/${s.subs}`} kicker={a.label} title={a.title} num={s.num} />
      <div className="ch-paper arg-body">
        <motion.p className="arg-claim" variants={item}>{a.claim}</motion.p>
        <ol className="arg-points">
          {a.points.map((t, i) => (
            <motion.li key={t} variants={item}><span>{String(i + 1).padStart(2, '0')}</span>{t}</motion.li>
          ))}
        </ol>
        {a.quote && (
          <motion.blockquote className="b-quote big-q" variants={item}>
            <p>“{a.quote.text}”</p>
            <cite>— {a.quote.source}</cite>
          </motion.blockquote>
        )}
        <motion.p className="arg-link" variants={item}><Icon name="link" size={16} /> Liên hệ: {a.link}</motion.p>
      </div>
    </>
  );
}

/* ---------- Ghép lại ---------- */
function Conclusion({ s }) {
  const c = s.conclusion;
  return (
    <>
      <motion.header className="ch" variants={item}>
        <span className="ch-label">Trả lời câu hỏi phản biện CQ9</span>
        <h2>{c.title}</h2>
      </motion.header>
      <motion.div className="ch-paper cc-paper" variants={item}>
        {cq9.args.map((a, i) => (
          <button key={a.id} className="cc-row" onClick={() => goTo(stops.findIndex((x) => x.arg === a))}>
            <b>{i + 1}</b>
            <span><small>{a.label}</small>{c.points?.[i] ?? a.claim}</span>
          </button>
        ))}
      </motion.div>
      <motion.div className="cc-end" variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.1, ease, delay: 0.5 } } }}>
        <span>Vì vậy</span>
        <p>Văn hóa còn thì dân tộc còn.</p>
      </motion.div>
    </>
  );
}

/* ---------- Kết thúc ---------- */
function End({ s }) {
  return (
    <>
      <motion.h2 variants={item}>{s.thanks?.title ?? 'Cảm ơn!'}</motion.h2>
      {s.thanks?.subtitle && <motion.p className="end-sub" variants={item}>{s.thanks.subtitle}</motion.p>}
      {s.sources && (
        <motion.div className="end-src" variants={item}>
          <h3>{s.sources.title}</h3>
          <ol>{s.sources.items.map((x) => <li key={x}>{x}</li>)}</ol>
        </motion.div>
      )}
      <motion.p className="end-ai" variants={item}>
        <b>Ứng dụng AI:</b> Dùng Claude để thiết kế web và bố cục
      </motion.p>
      <motion.div className="end-actions" variants={item}>
        <button className="btn-gold" onClick={() => goTo(0)}>↑ Về khung đầu</button>
        <a className="btn-red" href="#/slide/1">Bản trình chiếu dự phòng</a>
      </motion.div>
    </>
  );
}

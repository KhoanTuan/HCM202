import { useEffect, useState } from 'react';
import { slides } from '../content/deck.js';

// Cửa sổ người trình bày: ghi chú, slide kế tiếp, đồng hồ. Đồng bộ qua BroadcastChannel.
export default function Presenter() {
  const [index, setIndex] = useState(0);
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const [ch] = useState(() => new BroadcastChannel('hcm-deck'));

  useEffect(() => {
    const onMsg = (e) => e.data?.type === 'state' && setIndex(e.data.index);
    ch.addEventListener('message', onMsg);
    ch.postMessage({ type: 'hello' });
    const t = setInterval(() => setNow(Date.now()), 1000);
    const onKey = (e) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) ch.postMessage({ type: 'go', index: index + 1 });
      if (['ArrowLeft', 'PageUp'].includes(e.key)) ch.postMessage({ type: 'go', index: index - 1 });
    };
    window.addEventListener('keydown', onKey);
    return () => { ch.removeEventListener('message', onMsg); clearInterval(t); window.removeEventListener('keydown', onKey); };
  }, [ch, index]);

  const s = slides[index];
  const next = slides[index + 1];
  const sec = Math.floor((now - start) / 1000);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'auto', background: '#1a0b0a', color: '#f6e2b8', padding: 32, fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', color: '#f1c94a' }}>Slide {index + 1} / {slides.length}</h2>
        <span style={{ fontSize: 40, fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</span>
      </div>
      <p style={{ fontSize: 22, marginTop: 8, color: '#fff' }}>{s.kicker ? `${s.kicker} — ` : ''}{s.title}</p>
      <div style={{ marginTop: 24, padding: 24, background: '#2a110f', borderRadius: 12, fontSize: 26, lineHeight: 1.6, minHeight: 200 }}>
        {s.notes || <em style={{ opacity: 0.6 }}>Chưa có ghi chú cho slide này (thêm trường notes trong src/content/deck.js).</em>}
      </div>
      {next && <p style={{ marginTop: 20, opacity: 0.75 }}>Tiếp theo: {next.title}</p>}
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button onClick={() => ch.postMessage({ type: 'go', index: index - 1 })}>← Trước</button>
        <button onClick={() => ch.postMessage({ type: 'go', index: index + 1 })}>Sau →</button>
      </div>
    </div>
  );
}

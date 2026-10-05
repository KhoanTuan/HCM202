// Họa tiết vẽ bằng SVG (tự vẽ, không dùng ảnh ngoài):
// dải lụa đỏ – vàng, núi thủy mặc, hạc bay, hoa sen, trống đồng, tre, mây, ngôi sao.
// Mọi toạ độ theo khung slide 1920 × 1080.
import { motion, useReducedMotion } from 'framer-motion';
import { useId, useMemo } from 'react';

/* ---------- tiện ích: đường núi tất định (không random mỗi lần render) ---------- */
function ridge(seed, base, amp, w = 1920, step = 24) {
  let d = `M0 ${base}`;
  for (let x = 0; x <= w; x += step) {
    const t = x / w;
    const y =
      base -
      amp *
        (0.55 * Math.sin(t * 6.2 + seed) +
          0.3 * Math.sin(t * 13.7 + seed * 2.1) +
          0.15 * Math.sin(t * 29.3 + seed * 3.7)) -
      amp * 0.6 * Math.exp(-Math.pow((t - ((seed * 0.37) % 1)) * 4, 2));
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d + ` L${w} 1080 L0 1080 Z`;
}

/* ---------- Dải lụa đỏ – vàng ở chân slide ---------- */
export function SilkWaves({ height = 190, tone = 'red' }) {
  const id = useId();
  const reduce = useReducedMotion();
  const drift = reduce ? {} : { animate: { x: [0, -60, 0] }, transition: { duration: 14, repeat: Infinity, ease: 'easeInOut' } };
  const drift2 = reduce ? {} : { animate: { x: [-40, 20, -40] }, transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' } };
  const light = tone === 'light';
  return (
    <svg className="silk" viewBox="0 0 1920 220" preserveAspectRatio="none" style={{ height }} aria-hidden>
      <defs>
        <linearGradient id={`${id}r`} x1="0" x2="1">
          <stop offset="0" stopColor={light ? '#f2e3c4' : '#6d0f10'} />
          <stop offset="0.5" stopColor={light ? '#e8cf9a' : '#a3191b'} />
          <stop offset="1" stopColor={light ? '#f2e3c4' : '#7a1414'} />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#b8862b" stopOpacity="0" />
          <stop offset="0.3" stopColor="#f1d27a" />
          <stop offset="0.7" stopColor="#d4a640" />
          <stop offset="1" stopColor="#b8862b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path {...drift2} d="M-80 120 C 300 40, 620 200, 980 110 S 1650 30, 2000 120 L2000 220 L-80 220 Z" fill={`url(#${id}r)`} opacity="0.55" />
      <motion.path {...drift} d="M-80 150 C 260 90, 700 210, 1060 140 S 1700 80, 2000 150 L2000 220 L-80 220 Z" fill={`url(#${id}r)`} />
      <motion.path {...drift} d="M-80 146 C 260 86, 700 206, 1060 136 S 1700 76, 2000 146" fill="none" stroke={`url(#${id}g)`} strokeWidth="3" />
      <motion.path {...drift2} d="M-80 116 C 300 36, 620 196, 980 106 S 1650 26, 2000 116" fill="none" stroke={`url(#${id}g)`} strokeWidth="1.5" opacity="0.8" />
      <path d="M0 200 C 480 175, 1440 175, 1920 200 L1920 220 L0 220 Z" fill={light ? '#e0c48a' : '#5a0b0c'} />
    </svg>
  );
}

/* ---------- Dải lụa ở mép trên ---------- */
export function TopRibbon() {
  return (
    <svg className="top-ribbon" viewBox="0 0 1920 18" preserveAspectRatio="none" aria-hidden>
      <rect width="1920" height="10" fill="#7a1414" />
      <rect y="12" width="1920" height="2" fill="#d4a640" />
    </svg>
  );
}

/* ---------- Núi thủy mặc nhiều lớp ---------- */
export function InkMountains({ opacity = 1, tint = '#6b4a3a', top = 560, pagoda = false }) {
  const id = useId();
  const layers = useMemo(
    () => [
      { d: ridge(1.3, top, 120), o: 0.18 },
      { d: ridge(2.7, top + 90, 150), o: 0.26 },
      { d: ridge(4.1, top + 190, 110), o: 0.38 },
      { d: ridge(5.9, top + 290, 70), o: 0.5 },
    ],
    [top],
  );
  return (
    <svg className="ink" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMax slice" style={{ opacity }} aria-hidden>
      <defs>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity="1" />
          <stop offset="0.55" stopColor={tint} stopOpacity="0.15" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}b`}><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>
      {layers.map((l, i) => (
        <path key={i} d={l.d} fill={`url(#${id}m)`} opacity={l.o} filter={`url(#${id}b)`} />
      ))}
      {pagoda && <Pagoda x={1480} y={top + 170} s={1} color={tint} />}
    </svg>
  );
}

/* ---------- Chùa (bóng) ---------- */
function Pagoda({ x, y, s = 1, color }) {
  const roof = (w, yy) => `M${-w} ${yy} Q0 ${yy - 22} ${w} ${yy} Q${w * 0.55} ${yy - 6} 0 ${yy - 18} Q${-w * 0.55} ${yy - 6} ${-w} ${yy} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} opacity="0.45">
      <rect x="-30" y="-30" width="60" height="40" />
      <path d={roof(70, -30)} />
      <rect x="-22" y="-80" width="44" height="40" />
      <path d={roof(56, -80)} />
      <rect x="-14" y="-122" width="28" height="34" />
      <path d={roof(40, -122)} />
      <rect x="-2" y="-170" width="4" height="40" />
    </g>
  );
}

/* ---------- Hạc bay ---------- */
export function Cranes({ x = 1500, y = 160, count = 4, color = '#8e1b1b', scale = 1 }) {
  const reduce = useReducedMotion();
  const birds = Array.from({ length: count }, (_, i) => ({
    dx: i * 70 - (i % 2) * 30,
    dy: i * 34 + (i % 2) * 18,
    s: 1 - i * 0.12,
    delay: i * 0.35,
  }));
  return (
    <svg className="cranes" viewBox="0 0 1920 1080" aria-hidden>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <motion.g
        animate={reduce ? undefined : { x: [0, -40, 0], y: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        {birds.map((b, i) => (
          <g key={i} transform={`translate(${b.dx} ${b.dy}) scale(${b.s})`}>
            <motion.path
              d="M-30 0 Q-14 -16 0 0 Q14 -16 30 0 Q14 -6 0 4 Q-14 -6 -30 0 Z"
              fill={color}
              animate={reduce ? undefined : { scaleY: [1, -0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
              style={{ originY: '0px' }}
            />
          </g>
        ))}
      </motion.g>
      </g>
    </svg>
  );
}

/* ---------- Hoa sen nét vàng ---------- */
export function Lotus({ x = 0, y = 0, s = 1, color = '#d4a640', opacity = 0.9, sw = 2 }) {
  const petals = [-60, -35, -12, 12, 35, 60];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={sw} opacity={opacity}>
      {petals.map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0 0 C -28 -50, -18 -110, 0 -140 C 18 -110, 28 -50, 0 0 Z" />
      ))}
      <path d="M0 0 C -14 -40, -10 -90, 0 -118 C 10 -90, 14 -40, 0 0 Z" />
      <path d="M-120 20 Q0 -10 120 20" />
      <path d="M-90 40 Q0 20 90 40" />
      <path d="M0 40 Q 6 140 -10 260" />
    </g>
  );
}
export function LotusSvg({ className, ...p }) {
  return (
    <svg className={className} viewBox="-160 -160 320 440" aria-hidden>
      <Lotus {...p} />
    </svg>
  );
}

/* ---------- Trống đồng (hoa văn đồng tâm) ---------- */
export function DrumRings({ size = 900, color = '#b8862b', opacity = 0.16, spin = true }) {
  const reduce = useReducedMotion();
  const rays = 14;
  const star = Array.from({ length: rays * 2 }, (_, i) => {
    const r = i % 2 === 0 ? 120 : 34;
    const a = (i / (rays * 2)) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
  const ringOf = (n, r, el) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 360;
      return <g key={i} transform={`rotate(${a}) translate(0 ${-r})`}>{el}</g>;
    });
  return (
    <motion.svg
      className="drum"
      viewBox="-450 -450 900 900"
      style={{ width: size, height: size, opacity }}
      animate={spin && !reduce ? { rotate: 360 } : undefined}
      transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <g fill="none" stroke={color} strokeWidth="2">
        <polygon points={star} fill={color} fillOpacity="0.35" />
        {[150, 168, 220, 236, 300, 316, 380, 396, 440].map((r) => <circle key={r} r={r} />)}
        {ringOf(48, 194, <path d="M-6 -8 L0 8 L6 -8" />)}
        {ringOf(36, 268, <path d="M-18 0 Q-6 -14 4 -4 L18 -10 L8 4 Q-4 10 -18 0 Z" />)}
        {ringOf(72, 348, <circle r="5" />)}
        {ringOf(60, 418, <path d="M-8 6 Q0 -10 8 6" />)}
      </g>
    </motion.svg>
  );
}

/* ---------- Tre (bóng mực) ---------- */
export function Bamboo({ x = 40, color = '#6b4a3a', opacity = 0.22 }) {
  const leaf = (lx, ly, r) => <path key={`${lx}-${ly}`} transform={`translate(${lx} ${ly}) rotate(${r})`} d="M0 0 Q30 -8 70 0 Q30 8 0 0 Z" />;
  return (
    <svg className="bamboo" viewBox="0 0 1920 1080" aria-hidden>
      <g fill={color} stroke={color} opacity={opacity}>
        {[0, 46].map((o, k) => (
          <g key={k} transform={`translate(${x + o} 0)`}>
            <rect x="0" y={260 + k * 80} width="10" height="900" strokeWidth="0" />
            {[360, 500, 640, 780].map((yy) => <rect key={yy} x="-3" y={yy + k * 60} width="16" height="5" strokeWidth="0" />)}
          </g>
        ))}
        {leaf(x + 10, 330, -30)}{leaf(x + 10, 360, -10)}{leaf(x + 10, 390, 15)}
        {leaf(x + 56, 470, -40)}{leaf(x + 56, 500, -18)}{leaf(x - 50, 520, 200)}
      </g>
    </svg>
  );
}

/* ---------- Mây cát tường ---------- */
export function Cloud({ x, y, s = 1, color = '#d4a640', opacity = 0.5 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth="2.5" opacity={opacity}>
      <path d="M0 0 C 0 -30, 40 -30, 40 0 C 40 -40, 100 -40, 100 0 C 100 -26, 140 -26, 140 0 Z" />
      <path d="M30 -6 C 30 -18, 50 -18, 50 -6" />
      <path d="M80 -10 C 80 -24, 100 -24, 100 -10" />
    </g>
  );
}

/* ---------- Ngôi sao vàng ---------- */
export function Star({ size = 90, color = '#f1c94a', className }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 20;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
  return (
    <svg className={className} viewBox="-52 -52 104 104" width={size} height={size} aria-hidden>
      <polygon points={pts} fill={color} />
    </svg>
  );
}

/* ---------- Khung trang trí cho thẻ (góc vát) ---------- */
export function GoldRule({ width = 120 }) {
  return <span className="gold-rule" style={{ width }} aria-hidden />;
}

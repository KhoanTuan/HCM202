// Tạo texture bằng canvas (không cần file ảnh): mặt trống đồng, bia lập luận, núi thủy mặc, quầng sáng.
import * as THREE from 'three';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function finish(c, { srgb = true, repeat } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}

/* ---------- Mặt trống đồng Đông Sơn (hoa văn đồng tâm, tự vẽ) ---------- */
export function drumFaceTexture() {
  const S = 1024, R = S / 2;
  const [c, g] = canvas(S, S);
  g.translate(R, R);
  const base = g.createRadialGradient(0, 0, 20, 0, 0, R);
  base.addColorStop(0, '#d9a85a');
  base.addColorStop(0.5, '#a8762f');
  base.addColorStop(1, '#5e3c14');
  g.fillStyle = base;
  g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();

  const ink = 'rgba(60, 34, 8, 0.85)';
  const light = 'rgba(255, 226, 150, 0.55)';
  g.lineWidth = 3;

  // ngôi sao 14 cánh
  const rays = 14;
  g.beginPath();
  for (let i = 0; i < rays * 2; i++) {
    const r = i % 2 === 0 ? 120 : 34;
    const a = (i / (rays * 2)) * Math.PI * 2;
    g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  g.closePath();
  g.fillStyle = 'rgba(255, 220, 140, 0.85)';
  g.fill();
  g.strokeStyle = ink; g.stroke();

  const ring = (r, w = 3, col = ink) => { g.lineWidth = w; g.strokeStyle = col; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke(); };
  const around = (n, r, draw) => {
    for (let i = 0; i < n; i++) {
      g.save(); g.rotate((i / n) * Math.PI * 2); g.translate(0, -r); draw(i); g.restore();
    }
  };

  [150, 166, 220, 234, 300, 314, 392, 406, 470, 500].forEach((r, i) => ring(r, i % 2 ? 2 : 4, i % 2 ? light : ink));
  // vạch răng cưa
  around(56, 193, () => { g.beginPath(); g.moveTo(-7, -9); g.lineTo(0, 9); g.lineTo(7, -9); g.strokeStyle = ink; g.lineWidth = 3; g.stroke(); });
  // vòng chim (cách điệu)
  around(18, 267, () => {
    g.fillStyle = ink;
    g.beginPath();
    g.moveTo(-26, 0); g.quadraticCurveTo(-8, -18, 6, -6); g.lineTo(26, -16); g.lineTo(12, 4);
    g.quadraticCurveTo(-4, 14, -26, 0); g.fill();
  });
  // vòng tròn chấm
  around(64, 353, () => { g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.strokeStyle = ink; g.lineWidth = 3; g.stroke(); g.beginPath(); g.arc(0, 0, 2.5, 0, Math.PI * 2); g.fillStyle = ink; g.fill(); });
  // vòng sóng
  around(60, 438, () => { g.beginPath(); g.moveTo(-10, 6); g.quadraticCurveTo(0, -14, 10, 6); g.strokeStyle = ink; g.lineWidth = 3; g.stroke(); });

  // vết patina
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * R;
    g.fillStyle = `rgba(${40 + Math.random() * 30}, ${90 + Math.random() * 40}, ${70 + Math.random() * 30}, ${Math.random() * 0.12})`;
    g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 4 + Math.random() * 22, 0, Math.PI * 2); g.fill();
  }
  return finish(c);
}

/* ---------- Thân trống: dải hoa văn ---------- */
export function drumSideTexture() {
  const [c, g] = canvas(1024, 256);
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#a8762f'); grad.addColorStop(0.5, '#7d5420'); grad.addColorStop(1, '#5a3a12');
  g.fillStyle = grad; g.fillRect(0, 0, 1024, 256);
  g.strokeStyle = 'rgba(50, 28, 6, 0.8)'; g.lineWidth = 3;
  [40, 52, 200, 212].forEach((y) => { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); });
  for (let x = 0; x < 1024; x += 32) {
    g.beginPath(); g.arc(x + 16, 126, 10, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(x, 70); g.lineTo(x + 16, 90); g.lineTo(x + 32, 70); g.stroke();
    g.beginPath(); g.moveTo(x, 182); g.lineTo(x + 16, 162); g.lineTo(x + 32, 182); g.stroke();
  }
  return finish(c, { repeat: [3, 1] });
}

/* ---------- Mặt bia lập luận ---------- */
export function tabletTexture(n, label, variant = 'red') {
  const W = 512, H = 820;
  const gold = variant === 'gold';
  const [c, g] = canvas(W, H);
  const bg = g.createLinearGradient(0, 0, 0, H);
  if (gold) { bg.addColorStop(0, '#f6e0a0'); bg.addColorStop(1, '#c9973a'); }
  else { bg.addColorStop(0, '#a3191b'); bg.addColorStop(1, '#5e0d0e'); }
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const line = gold ? '#7a1414' : '#e8c160';
  // viền đôi
  g.strokeStyle = line; g.lineWidth = 10; g.strokeRect(18, 18, W - 36, H - 36);
  g.lineWidth = 3; g.strokeRect(38, 38, W - 76, H - 76);
  // hoa văn góc
  g.fillStyle = line;
  [[38, 38], [W - 38, 38], [38, H - 38], [W - 38, H - 38]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 10, 0, Math.PI * 2); g.fill(); });
  // mây nhỏ
  g.strokeStyle = gold ? 'rgba(122, 20, 20, 0.45)' : 'rgba(232, 193, 96, 0.55)'; g.lineWidth = 3;
  for (const y of [140, H - 140]) {
    g.beginPath(); g.arc(W / 2 - 40, y, 22, Math.PI, 0); g.arc(W / 2 + 4, y, 26, Math.PI, 0); g.arc(W / 2 + 48, y, 18, Math.PI, 0); g.stroke();
  }
  g.textAlign = 'center';
  g.fillStyle = gold ? '#7a1414' : '#f6d98a';
  g.font = '700 230px "Playfair Display", Lora, Georgia, serif';
  g.fillText(String(n), W / 2, 420);
  g.fillStyle = gold ? '#4a0b0b' : '#fff1d6';
  g.font = '700 50px Lora, Georgia, serif';
  wrap(g, label, W / 2, 540, W - 120, 62);
  return finish(c);
}

function wrap(g, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  lines.push(line);
  lines.forEach((l, i) => g.fillText(l, x, y + i * lh));
}

/* ---------- Dãy núi thủy mặc (nền trong suốt) ---------- */
export function mountainTexture(seed, color = [30, 8, 6]) {
  const W = 2048, H = 640;
  const [c, g] = canvas(W, H);
  const layers = [
    { base: 300, amp: 160, a: 0.35, s: seed },
    { base: 400, amp: 130, a: 0.55, s: seed + 1.7 },
    { base: 500, amp: 90, a: 0.85, s: seed + 3.1 },
  ];
  for (const L of layers) {
    const grad = g.createLinearGradient(0, L.base - L.amp * 1.4, 0, H);
    grad.addColorStop(0, `rgba(${color.join(',')}, ${L.a})`);
    grad.addColorStop(0.7, `rgba(${color.join(',')}, ${L.a * 0.6})`);
    grad.addColorStop(1, `rgba(${color.join(',')}, 0)`);
    g.fillStyle = grad;
    g.beginPath(); g.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const t = x / W;
      const y = L.base - L.amp * (0.55 * Math.sin(t * 7 + L.s) + 0.3 * Math.sin(t * 17 + L.s * 2) + 0.15 * Math.sin(t * 41 + L.s * 3))
        - L.amp * 0.8 * Math.exp(-Math.pow((t - ((L.s * 0.31) % 1)) * 5, 2));
      g.lineTo(x, y);
    }
    g.lineTo(W, H); g.closePath(); g.fill();
  }
  return finish(c);
}

/* ---------- Quầng sáng tròn (cho mặt trời, hào quang) ---------- */
export function glowTexture(inner = 'rgba(255,214,120,1)', outer = 'rgba(255,120,60,0)') {
  const [c, g] = canvas(256, 256);
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.55)'));
  grad.addColorStop(1, outer);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  return finish(c);
}

/* ---------- Bầu trời hoàng hôn (gradient dọc) ---------- */
export function skyTexture() {
  const [c, g] = canvas(16, 512);
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#12030a');
  grad.addColorStop(0.32, '#3d0d0c');
  grad.addColorStop(0.47, '#9a3a22');
  grad.addColorStop(0.5, '#c8673a');
  grad.addColorStop(0.53, '#5a1a10');
  grad.addColorStop(1, '#1d0605');
  g.fillStyle = grad; g.fillRect(0, 0, 16, 512);
  return finish(c);
}

/* ---------- Nhãn chữ (pill) ---------- */
export function labelTexture(text) {
  const [c, g] = canvas(512, 148);
  g.fillStyle = 'rgba(109, 15, 16, 0.85)';
  g.strokeStyle = '#e2b552'; g.lineWidth = 4;
  g.beginPath(); g.roundRect(6, 6, 500, 136, 68); g.fill(); g.stroke();
  g.fillStyle = '#fff1d6'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 64px Lora, Georgia, serif';
  g.fillText(text, 256, 78);
  return finish(c);
}

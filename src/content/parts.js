// Gom các slide trong deck.js thành các PHẦN của trang web (dựa vào slide `divider`).
// Không cần sửa file này — sửa chữ trong deck.js và cq9.js.
import { slides } from './deck.js';
import { cq9 } from './cq9.js';

const SKIP = new Set(['title', 'agenda', 'thanks', 'sources']);

// Các phần nội dung (I–IV) + phần CQ9/kết luận
export const parts = [];
let cur = null;
slides.forEach((s, i) => {
  if (s.layout === 'divider') {
    cur = { id: `phan-${parts.length + 1}`, part: s.part, title: s.title, subtitle: s.subtitle, art: s.art, blocks: [] };
    parts.push(cur);
    return;
  }
  if (!cur || SKIP.has(s.layout)) return;
  cur.blocks.push({ ...s, id: `muc-${i + 1}` });
});

export const intro = slides.find((s) => s.layout === 'stats');
export const sources = slides.find((s) => s.layout === 'sources');
export const thanks = slides.find((s) => s.layout === 'thanks');

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const SHORT = ['Văn hóa', 'Đạo đức', 'Con người', 'Vận dụng'];

// Phần nội dung = các phần có chữ "Phần" (không phải phần CQ9)
export const contentParts = parts.filter((p) => /^Phần/i.test(p.part));
export const cq9Part = parts.find((p) => /CQ9/i.test(p.part));

// Các "bia" trong cảnh 3D: 4 bia vàng (nội dung) + các bia đỏ (ý trả lời CQ9, theo cq9.js)
export const nodes = [
  ...contentParts.map((p, k) => ({
    key: p.id, kind: 'part', num: ROMAN[k], label: SHORT[k] ?? p.title, variant: 'gold', part: p,
  })),
  ...cq9.args.map((a, k) => ({
    key: a.id, kind: 'arg', num: String(k + 1), label: a.label, variant: 'red', arg: a,
  })),
];

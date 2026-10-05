// Chuỗi "điểm dừng" của hành trình 3D: mỗi điểm = một màn hình nội dung + một vị trí camera.
// Tự sinh từ deck.js và cq9.js — muốn sửa chữ thì sửa ở hai file đó.
import { cq9 } from './cq9.js';
import { contentParts, cq9Part, intro, nodes, sources, thanks } from './parts.js';

// Mục tiêu camera đặc biệt (ngoài các bia 0..N-1)
export const VIEW = { OVERVIEW: 'overview', RING: 'ring', DRUM: 'drum', ALL: 'all', END: 'end' };

export const stops = [];
const add = (s) => stops.push({ ...s, index: stops.length });

add({ type: 'intro', chapter: 0, view: VIEW.OVERVIEW, intro });

contentParts.forEach((p, k) => {
  add({ type: 'divider', chapter: k + 1, node: k, part: p, num: nodes[k].num, sub: -1, subs: p.blocks.length });
  p.blocks.forEach((b, j) => add({ type: 'block', chapter: k + 1, node: k, block: b, part: p, sub: j, subs: p.blocks.length }));
});

const CQ = contentParts.length + 1;
const firstArg = nodes.findIndex((n) => n.kind === 'arg');
const cqBlocks = cq9Part?.blocks ?? [];
const layersBlock = cqBlocks.find((b) => b.layout === 'cq9');
const restBlocks = cqBlocks.filter((b) => b !== layersBlock);

add({ type: 'divider', chapter: CQ, view: VIEW.RING, part: cq9Part, num: 'CQ9', sub: -1 });
if (layersBlock) add({ type: 'block', chapter: CQ, view: VIEW.DRUM, block: layersBlock, part: cq9Part, sub: 0 });
cq9.args.forEach((a, j) => add({ type: 'arg', chapter: CQ, node: firstArg + j, arg: a, num: String(j + 1), sub: j, subs: cq9.args.length }));
restBlocks.forEach((b) => add({ type: 'block', chapter: CQ, view: VIEW.ALL, block: b, part: cq9Part, sub: 0 }));
add({ type: 'conclusion', chapter: CQ, view: VIEW.ALL, conclusion: cq9.conclusion });
add({ type: 'end', chapter: CQ + 1, view: VIEW.END, sources, thanks });

// Các chương để hiện trên thanh tiến trình
const SHORT = ['Văn hóa', 'Đạo đức', 'Con người', 'Vận dụng'];
export const chapters = [
  { key: 'mo-dau', num: '✦', label: 'Mở đầu' },
  ...contentParts.map((p, k) => ({ key: p.id, num: nodes[k].num, label: SHORT[k] ?? p.title })),
  { key: 'cq9', num: 'CQ9', label: 'Phản biện' },
  { key: 'ket', num: '◆', label: 'Kết thúc' },
].map((c, i) => ({ ...c, start: stops.findIndex((s) => s.chapter === i) }));

// Điểm dừng đầu tiên gắn với một bia (để bấm vào bia trong cảnh 3D là bay tới)
export const stopOfNode = (i) => stops.findIndex((s) => s.node === i);

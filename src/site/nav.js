// Điều hướng giữa các điểm dừng (mỗi điểm dừng cao một màn hình).
import { stops } from '../content/stops.js';

export const stopH = () => document.querySelector('.stop')?.offsetHeight || window.innerHeight;
export function goTo(i, smooth = true) {
  const n = Math.min(Math.max(i, 0), stops.length - 1);
  window.scrollTo({ top: n * stopH(), behavior: smooth ? 'smooth' : 'instant' });
}

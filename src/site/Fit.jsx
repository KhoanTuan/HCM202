// Tự co giãn nội dung để cả thẻ luôn nằm gọn trong một màn hình (không phải cuộn bên trong thẻ).
// Đo chiều cao thật của nội dung → thu nhỏ (hoặc phóng nhẹ) bằng transform, đồng thời nới bề rộng
// tương ứng để chữ xuống dòng ít hơn. Lặp vài lần cho hội tụ.
import { useLayoutEffect, useRef } from 'react';

const MIN_DESK = 0.6;

export default function Fit({ children }) {
  const outer = useRef(null);
  const inner = useRef(null);

  useLayoutEffect(() => {
    const o = outer.current, el = inner.current;
    const card = o.closest('.stop-card');
    const stop = o.closest('.stop');
    // chế độ "lấp đầy": vùng cha (.fill-area) có kích thước cố định, nội dung co giãn để vừa khít vùng đó
    const area = o.parentElement.classList.contains('fill-area') ? o.parentElement : null;
    let raf = 0, busy = false;

    const fit = () => {
      if (busy) return;
      busy = true;
      const cs = getComputedStyle(stop), cc = getComputedStyle(card);
      const ca = area && getComputedStyle(area);
      let availH = area ? area.clientHeight - parseFloat(ca.paddingTop) - parseFloat(ca.paddingBottom) - 2 : 0;
      if (!area) availH = stop.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        - parseFloat(cc.paddingTop) - parseFloat(cc.paddingBottom) - 4;
      if (!area && cc.maxHeight.endsWith('px')) {
        availH = Math.min(availH, parseFloat(cc.maxHeight) - parseFloat(cc.paddingTop) - parseFloat(cc.paddingBottom) - 4);
      }
      const availW = o.clientWidth;
      const MIN = window.innerWidth < 800 ? 0.82 : MIN_DESK;
      // thẻ nội dung được phóng to để lấp gần kín màn hình; các thẻ khác chỉ phóng nhẹ
      const MAX = window.innerWidth < 800 ? 1 : card.matches('.card-red') ? 1.18 : 1.08; // chỉ phóng nhẹ, chữ vừa đủ nhìn
      // tìm tỉ lệ lớn nhất mà nội dung (đã xuống dòng lại theo bề rộng mới) vẫn vừa chiều cao — tìm nhị phân
      const fits = (k) => { el.style.width = `${availW / k}px`; return el.scrollHeight * k <= availH; };
      let s;
      if (fits(MAX)) s = MAX;
      else if (!fits(MIN)) s = MIN;
      else {
        let lo = MIN, hi = MAX;
        for (let k = 0; k < 12; k++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
        s = lo;
      }
      el.style.width = `${availW / s}px`;
      el.style.transform = `scale(${s})`;
      o.style.height = `${el.scrollHeight * s}px`;
      (area ?? card).classList.toggle('overflowing', el.scrollHeight * s > availH + 2);
      busy = false;
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };

    fit();
    document.fonts?.ready.then(schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(stop);
    ro.observe(o);
    if (area) ro.observe(area);
    ro.observe(el); // nội dung đổi kích thước (phông chữ tải xong, hiệu ứng…) → tính lại
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', schedule); };
  }, []);

  return (
    <div ref={outer} className="fit">
      <div ref={inner} className="fit-in">{children}</div>
    </div>
  );
}

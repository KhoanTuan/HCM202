# Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người — Nhóm 6 (HCM202 · CQ9)

Trang web thuyết trình (React + Vite).

- **Khung đầu tiên = trung tâm 3D** (Three.js): trống đồng ở giữa (dân tộc), 4 bia vàng = Phần I–IV
  (khai thác nội dung), 7 bia đỏ = 7 lập luận phản biện CQ9. Bấm bia hoặc danh sách bên phải để xem;
  "Ghép lại" để ra kết luận CQ9. Phím ← → / Esc khi đang ở khung đầu.
- **Cuộn xuống** = các mục chi tiết của từng phần, hiện ra bằng hiệu ứng 3D.
- Bản trình chiếu dự phòng dạng slide: `#/slide/1` (link ở chân trang).

## Chạy

```bash
npm install
npm run dev        # mở địa chỉ terminal in ra (thường http://localhost:5173)
npm run build      # xuất bản tĩnh vào dist/ (font đã đóng gói, chạy offline được)
```

## Sửa nội dung

- `src/content/deck.js` — nội dung các phần (mỗi slide cũ = một khối trên web; slide `divider` mở đầu một phần).
- `src/content/cq9.js` — 7 lập luận CQ9 và kết luận.

## Cấu trúc

```
src/site/       ← trang web: Site (thanh điều hướng), Hero (khung 3D + bảng), Sections (các mục cuộn)
src/explore/    ← cảnh 3D: trống đồng, bia, núi, hạc, bầu trời
src/art/        ← họa tiết SVG tự vẽ
src/deck/       ← bản trình chiếu dự phòng
```

Các file `src/explore/Explore3D.jsx`, `src/explore/explore.css` (nếu còn) là của bản cũ, có thể xóa.

## Nếu khung 3D bị đen

Tải lại trang. Lần đầu chạy `npm run dev`, Vite cần vài giây để chuẩn bị thư viện 3D.
Cần Chrome/Edge bản mới (WebGL). Không có WebGL thì khung đầu vẫn hiện danh sách để bấm.

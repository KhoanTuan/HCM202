// =====================================================================
//  CÂU HỎI PHẢN BIỆN CQ9 — BÁM ĐÚNG TÀI LIỆU NHÓM (Google Doc, phần cuối).
//  Nhóm trả lời bằng 3 ý → 3 "bia đỏ" quanh trống đồng. Thứ tự = thứ tự trình bày.
//  Chỉ dùng câu chữ có trong tài liệu nhóm; không thêm trích dẫn ngoài.
// =====================================================================

export const cq9 = {
  question: 'Tại sao "văn hóa còn thì dân tộc còn"?',
  intro:
    'Trống đồng ở giữa tượng trưng cho dân tộc. Ba bia đỏ xung quanh là ba ý trả lời của nhóm. Đi qua từng bia để thấy vì sao giữ được văn hóa là giữ được dân tộc.',
  conclusion: {
    title: 'Văn hóa là "gốc rễ" của dân tộc',
    // 3 câu chốt tương ứng 3 ý (hiện thành 3 dòng trên màn trả lời)
    points: [
      'Văn hóa là "gốc rễ" tạo nên bản sắc của một dân tộc, được truyền lại qua các thế hệ.',
      'Giữ gìn văn hóa chính là giữ gìn bản sắc.',
      'Đánh mất tiếng nói, lịch sử, truyền thống thì sức sống tinh thần của dân tộc suy yếu.',
    ],
    text:
      'Văn hóa là "gốc rễ" tạo nên bản sắc của một dân tộc và được truyền lại qua các thế hệ (1). Giữ gìn văn hóa chính là giữ gìn bản sắc (2); đánh mất tiếng nói, lịch sử, truyền thống thì sức sống tinh thần của dân tộc suy yếu (3). Vì vậy: văn hóa còn thì dân tộc còn.',
  },
  args: [
    {
      id: 'van-hoa-la-gi',
      label: 'Văn hóa là gì',
      title: 'Văn hóa là toàn bộ đời sống tinh thần',
      claim:
        'Văn hóa không chỉ là nghệ thuật hay phong tục, mà bao gồm ngôn ngữ, lịch sử, truyền thống, đạo đức, lối sống… được truyền lại qua các thế hệ.',
      points: [
        'Ngôn ngữ, lịch sử, truyền thống.',
        'Đạo đức, lối sống.',
        'Được truyền từ thế hệ này sang thế hệ khác — định hình bản sắc dân tộc.',
      ],
      link: 'Phần I.1 · Quan niệm về văn hóa',
    },
    {
      id: 'giu-ban-sac',
      label: 'Giữ gìn',
      title: 'Giữ văn hóa là giữ bản sắc',
      claim:
        'Khi văn hóa được giữ gìn và phát huy, dân tộc vẫn duy trì được bản sắc, lịch sử và những giá trị riêng, dù xã hội có nhiều thay đổi.',
      points: [
        'Giữ được bản sắc riêng.',
        'Giữ được lịch sử.',
        'Giữ được những giá trị riêng của dân tộc.',
      ],
      link: 'Phần I.2 · Vai trò của văn hóa',
    },
    {
      id: 'neu-danh-mat',
      label: 'Nếu đánh mất',
      title: 'Mất văn hóa thì dân tộc suy yếu',
      claim:
        'Nếu một dân tộc đánh mất tiếng nói, lịch sử, truyền thống thì sức sống tinh thần của dân tộc sẽ bị suy yếu.',
      points: [
        'Đánh mất tiếng nói.',
        'Đánh mất lịch sử.',
        'Đánh mất truyền thống.',
      ],
      link: 'Phần IV · Ý nghĩa và liên hệ vận dụng',
    },
  ],
};

// =====================================================================
//  NỘI DUNG SLIDE — sửa chữ CHỈ trong file này.
//  Mỗi slide có `layout` quyết định cách trình bày (xem src/deck/layouts.jsx).
//  `notes` = lời thuyết trình, hiện ở cửa sổ người trình bày (phím N).
//  `owner` = người phụ trách slide (hiện nhỏ ở góc, để trống nếu không cần).
//  Icon có sẵn: book, pen, home, landmark, coins, heart, globe, sprout,
//               users, scale, star, lotus, scroll, lamp, shield, brain, link
// =====================================================================

export const meta = {
  course: 'HCM202 · Tư tưởng Hồ Chí Minh',
  group: 'Nhóm 6',
  chapter: 'Chương 6',
  title: 'Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người',
  question: 'Tại sao "văn hóa còn thì dân tộc còn"?',
  cqid: 'CQ9',
  source: 'Giáo trình Tư tưởng Hồ Chí Minh, Chương VI',
};

export const slides = [
  // ───────────────────────────── MỞ ĐẦU ─────────────────────────────
  {
    layout: 'title',
    kicker: 'Môn Tư tưởng Hồ Chí Minh (HCM202)',
    title: 'Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người',
    subtitle: 'Nhóm 6 · Chương 6 · Câu hỏi phản biện CQ9',
    notes: 'Chào thầy cô và các bạn. Nhóm 6 trình bày Chương 6 và trả lời câu hỏi phản biện CQ9.',
  },
  {
    layout: 'stats',
    kicker: 'Mở đầu',
    title: 'Một nhà văn hóa được cả thế giới ghi nhận',
    stats: [
      { value: '1987', label: 'UNESCO ghi nhận', text: '"Anh hùng giải phóng dân tộc, Nhà văn hóa kiệt xuất Việt Nam" — Nghị quyết 24C/18.6.5' },
      { value: '4', label: 'cách tiếp cận văn hóa', text: 'Từ nghĩa rộng nhất đến "phương thức sử dụng công cụ sinh hoạt"' },
    ],
    question: 'Tại sao "văn hóa còn thì dân tộc còn"?',
    notes: 'Đặt câu hỏi CQ9 cho cả lớp ngay từ đầu. Hứa sẽ trả lời ở cuối bài, và mời các bạn cùng "khám phá" từng lập luận trong mô hình 3D.',
  },
  {
    layout: 'agenda',
    title: 'Nội dung',
    items: [
      { n: '01', title: 'Tư tưởng HCM về văn hóa', icon: 'scroll' },
      { n: '02', title: 'Tư tưởng HCM về đạo đức', icon: 'lotus' },
      { n: '03', title: 'Tư tưởng HCM về con người', icon: 'users' },
      { n: '04', title: 'Ý nghĩa & vận dụng', icon: 'sprout' },
      { n: 'CQ9', title: 'Văn hóa còn thì dân tộc còn', icon: 'star' },
    ],
  },

  // ───────────────────────────── PHẦN I: VĂN HÓA ─────────────────────────────
  {
    layout: 'divider',
    part: 'Phần I',
    title: 'Tư tưởng Hồ Chí Minh về văn hóa',
    subtitle: 'Quan niệm · Vai trò · Xây dựng nền văn hóa mới',
    art: 'red',
  },
  {
    layout: 'quoteCards',
    kicker: 'I.1 · Quan niệm về văn hóa',
    title: 'Bốn cách tiếp cận văn hóa',
    quote: {
      text: 'Văn hóa là sự tổng hợp của mọi phương thức sinh hoạt cùng với biểu hiện của nó mà loài người đã sản sinh ra nhằm thích ứng những nhu cầu đời sống và đòi hỏi của sự sinh tồn.',
      source: 'Hồ Chí Minh, 8/1943 (trong nhà tù Tưởng Giới Thạch)',
    },
    items: [
      { n: '01', title: 'Nghĩa rộng', text: 'Tổng hợp mọi phương thức sinh hoạt của con người' },
      { n: '02', title: 'Nghĩa hẹp', text: 'Đời sống tinh thần, thuộc kiến trúc thượng tầng' },
      { n: '03', title: 'Nghĩa hẹp hơn', text: 'Trường học, xóa mù chữ, nâng cao dân trí' },
      { n: '04', title: 'Phương thức', text: 'Cách sử dụng công cụ sinh hoạt' },
    ],
    notes: 'Định nghĩa năm 1943 là quan niệm văn hóa duy nhất theo nghĩa rộng của Bác, ra đời khi UNESCO chưa thành lập.',
  },
  {
    layout: 'hub',
    kicker: 'I.1 · Quan hệ giữa văn hóa và các lĩnh vực',
    title: 'Văn hóa không đứng ngoài, mà ở trong',
    center: 'Văn hóa',
    items: [
      { title: 'Chính trị', text: 'Giải phóng chính trị mở đường cho văn hóa; văn hóa phục vụ nhiệm vụ chính trị.', icon: 'landmark' },
      { title: 'Kinh tế', text: 'Kinh tế đi trước một bước — "có thực mới vực được đạo"; văn hóa tác động trở lại.', icon: 'coins' },
      { title: 'Xã hội', text: 'Giải phóng xã hội thì văn hóa mới được giải phóng.', icon: 'users' },
      { title: 'Bản sắc & tiếp biến', text: 'Tiếp thu Đông, Tây, kim, cổ có chọn lọc — lấy văn hóa dân tộc làm gốc.', icon: 'globe' },
    ],
    notes: 'Bốn vấn đề chính trị, kinh tế, văn hóa, xã hội quan trọng ngang nhau và tác động qua lại.',
  },
  {
    layout: 'cards',
    kicker: 'I.2 · Vai trò của văn hóa',
    title: 'Văn hóa vừa là mục tiêu, vừa là động lực',
    lead: 'Mục tiêu: quyền sống, tự do, hạnh phúc — "ai cũng có cơm ăn áo mặc, ai cũng được học hành"; hướng tới chân – thiện – mỹ.',
    cols: 5,
    items: [
      { title: 'Chính trị', text: 'Soi đường cho quốc dân đi', icon: 'lamp' },
      { title: 'Văn nghệ', text: 'Nâng lòng yêu nước, tinh thần lạc quan', icon: 'pen' },
      { title: 'Giáo dục', text: 'Diệt giặc dốt, đào tạo con người mới', icon: 'book' },
      { title: 'Đạo đức', text: 'Nâng phẩm giá, lối sống lành mạnh', icon: 'lotus' },
      { title: 'Pháp luật', text: 'Bảo đảm dân chủ, kỷ cương', icon: 'scale' },
    ],
    notes: 'Năm lĩnh vực văn hóa cụ thể là năm động lực của cách mạng.',
  },
  {
    layout: 'split',
    kicker: 'I.2 · Vai trò của văn hóa',
    title: 'Một mặt trận — và phục vụ nhân dân',
    left: {
      title: 'Văn hóa là một mặt trận',
      icon: 'shield',
      items: [
        'Cuộc đấu tranh cách mạng gay go, quyết liệt trên lĩnh vực tư tưởng',
        'Nghệ sĩ, trí thức là chiến sĩ; ngòi bút là vũ khí "phò chính trừ tà"',
      ],
    },
    right: {
      title: 'Văn hóa phục vụ quần chúng',
      icon: 'users',
      items: [
        'Phản ánh khát vọng, phục vụ lợi ích của nhân dân',
        'Bốn câu hỏi: Viết cho ai? Mục đích? Tài liệu đâu? Viết thế nào?',
        'Quần chúng vừa sáng tạo, thẩm định, vừa hưởng thụ',
      ],
    },
    quote: { text: 'Văn hóa nghệ thuật cũng là một mặt trận. Anh chị em là chiến sĩ trên mặt trận ấy.', source: 'Thư gửi các họa sĩ, 1951' },
  },
  {
    layout: 'timeline',
    kicker: 'I.3 · Xây dựng nền văn hóa mới',
    title: 'Phương châm qua từng giai đoạn',
    phases: [
      { when: '1943', title: '5 nội dung', text: 'Tâm lý · Luân lý · Xã hội · Chính trị · Kinh tế' },
      { when: 'Kháng chiến', title: '3 tính chất', text: 'Dân tộc · Khoa học · Đại chúng' },
      { when: 'Xây dựng CNXH', title: 'Nội dung & hình thức', text: 'Nội dung XHCN · Tính chất dân tộc' },
    ],
    chipsTitle: 'Bốn lĩnh vực trọng tâm',
    chips: ['3.1 Văn hóa giáo dục', '3.2 Văn hóa văn nghệ', '3.3 Văn hóa đời sống mới', '3.4 Văn hóa trong chính trị & kinh tế'],
    owner: 'K',
    notes: 'Phần xây dựng trả lời câu hỏi: văn hóa phải được xây ở đâu? Ở lớp học, tác phẩm, nếp sống và bộ máy, kinh tế.',
  },
  {
    layout: 'feature',
    kicker: '3.1 · Văn hóa giáo dục',
    title: 'Diệt giặc dốt, "trồng người"',
    quote: { text: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.', source: 'Hồ Chí Minh, 1958' },
    items: [
      { title: 'Mục tiêu', text: 'Xóa mù chữ; đào tạo con người mới vừa "hồng" vừa "chuyên"', icon: 'star' },
      { title: 'Nội dung', text: 'Giáo dục toàn diện Đức – Trí – Thể – Mỹ', icon: 'book' },
      { title: 'Phương châm', text: 'Học đi đôi với hành, lý luận gắn thực tiễn, học suốt đời', icon: 'sprout' },
    ],
    footnote: 'Nha Bình dân học vụ thành lập ngày 8/9/1945.',
    owner: 'K',
    notes: 'Ngày 3/9/1945, Bác đặt giặc dốt ngang hàng giặc đói và giặc ngoại xâm: "Một dân tộc dốt là một dân tộc yếu."',
  },
  {
    layout: 'feature',
    kicker: '3.2 · Văn hóa văn nghệ',
    title: 'Trong thơ nên có thép',
    quote: { text: 'Nay ở trong thơ nên có thép / Nhà thơ cũng phải biết xung phong.', source: 'Hồ Chí Minh, Nhật ký trong tù' },
    items: [
      { title: 'Gắn với thực tiễn', text: 'Phản ánh đời sống và khát vọng của nhân dân', icon: 'users' },
      { title: 'Phát huy vốn dân tộc', text: '"Mỗi dân tộc cần chăm lo đặc tính dân tộc mình trong nghệ thuật"', icon: 'lotus' },
      { title: 'Xứng tầm thời đại', text: 'Tác phẩm xứng với dân tộc anh hùng, thời đại vẻ vang', icon: 'pen' },
    ],
    owner: 'K',
  },
  {
    layout: 'principles',
    kicker: '3.3 · Văn hóa đời sống mới',
    title: 'Cũ và mới — bốn nguyên tắc',
    lead: 'Đời sống mới gồm đạo đức mới, lối sống mới và nếp sống mới.',
    grid: [
      { tag: 'Cũ mà xấu', action: 'Bỏ', tone: 'dark' },
      { tag: 'Cũ mà phiền phức', action: 'Sửa cho hợp lý', tone: 'light' },
      { tag: 'Cũ mà tốt', action: 'Phát triển thêm', tone: 'light' },
      { tag: 'Mới mà hay', action: 'Phải làm', tone: 'gold' },
    ],
    footnote: 'Tác phẩm "Đời sống mới" (1947, bút danh Tân Sinh) · Phong trào "Tết trồng cây" (1960)',
    owner: 'K',
  },
  {
    layout: 'split',
    kicker: '3.4 · Văn hóa trong chính trị và kinh tế',
    title: 'Chính trị có văn hóa, kinh tế có văn hóa',
    left: {
      title: 'Chính trị',
      icon: 'landmark',
      items: ['Xây dựng chính quyền của dân, do dân, vì dân', 'Cán bộ có đạo đức; chống tham ô, lãng phí, quan liêu'],
    },
    right: {
      title: 'Kinh tế',
      icon: 'coins',
      items: ['"Tăng gia sản xuất, thực hành tiết kiệm"', 'Kinh doanh trung thực, vì lợi ích chung (Thư gửi giới công thương, 13/10/1945)'],
    },
    owner: 'K',
  },

  // ───────────────────────────── PHẦN II: ĐẠO ĐỨC ─────────────────────────────
  {
    layout: 'divider',
    part: 'Phần II',
    title: 'Tư tưởng Hồ Chí Minh về đạo đức',
    subtitle: 'Vai trò · Chuẩn mực · Nguyên tắc rèn luyện',
    art: 'ink',
  },
  {
    layout: 'feature',
    kicker: 'II.1 · Vai trò của đạo đức',
    title: 'Đạo đức là gốc của người cách mạng',
    quote: {
      text: 'Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức…',
      source: 'Sửa đổi lối làm việc, 1947',
    },
    items: [
      { title: 'Gốc, nền tảng', text: 'Đạo đức là nền tảng tinh thần của xã hội và của người cách mạng', icon: 'sprout' },
      { title: 'Đức đi với tài', text: '"Nếu không có đạo đức cách mạng thì có tài cũng vô dụng"', icon: 'scale' },
      { title: 'Sức hấp dẫn', text: 'Tạo nên sức cảm hóa của chủ nghĩa xã hội qua những tấm gương', icon: 'heart' },
    ],
  },
  {
    layout: 'cards',
    kicker: 'II.2 · Chuẩn mực đạo đức cách mạng',
    title: 'Bốn chuẩn mực',
    cols: 4,
    numbered: true,
    items: [
      { title: 'Trung với nước, hiếu với dân', text: 'Phẩm chất bao trùm, quan trọng nhất', icon: 'star' },
      { title: 'Cần, kiệm, liêm, chính, chí công vô tư', text: 'Chăm chỉ, tiết kiệm, trong sạch, ngay thẳng', icon: 'scale' },
      { title: 'Thương yêu con người', text: 'Sống có tình có nghĩa, giúp đỡ người khó khăn', icon: 'heart' },
      { title: 'Tinh thần quốc tế trong sáng', text: 'Đoàn kết với nhân dân lao động thế giới', icon: 'globe' },
    ],
    quote: { text: 'Đạo đức cũ như người đầu ngược xuống đất chân chổng lên trời. Đạo đức mới như người hai chân đứng vững được dưới đất, đầu ngửng lên trời.', source: 'Hồ Chí Minh' },
  },
  {
    layout: 'steps',
    kicker: 'II.3 · Nguyên tắc rèn luyện',
    title: 'Ba nguyên tắc tu dưỡng đạo đức',
    items: [
      { title: 'Nói đi đôi với làm', text: 'Nêu gương; không nói một đằng làm một nẻo' },
      { title: 'Xây đi đôi với chống', text: 'Xây phẩm chất tốt, chống ích kỷ, tham lam, vô trách nhiệm' },
      { title: 'Tu dưỡng suốt đời', text: 'Rèn luyện mỗi ngày qua học tập, công việc, ứng xử' },
    ],
    footnote: 'Bài học cho sinh viên: trung thực, có trách nhiệm, vừa có tài vừa có đức.',
  },

  // ───────────────────────────── PHẦN III: CON NGƯỜI ─────────────────────────────
  {
    layout: 'divider',
    part: 'Phần III',
    title: 'Tư tưởng Hồ Chí Minh về con người',
    subtitle: 'Quan niệm · Vai trò · Xây dựng con người',
    art: 'red',
  },
  {
    layout: 'hub',
    kicker: 'III.1 · Quan niệm về con người',
    title: 'Con người là một chỉnh thể thống nhất',
    center: 'Con người',
    items: [
      { title: 'Trí lực · Tâm lực · Thể lực', text: 'Ba mặt thống nhất trong một con người', icon: 'brain' },
      { title: 'Trong các quan hệ', text: 'Với gia đình, cộng đồng, xã hội và tự nhiên', icon: 'link' },
      { title: 'Có tốt, có xấu', text: 'Giáo dục để phát huy mặt tốt, khắc phục mặt xấu', icon: 'scale' },
      { title: 'Cụ thể, lịch sử', text: 'Nhìn con người trong hoàn cảnh lịch sử – xã hội cụ thể', icon: 'scroll' },
    ],
  },
  {
    layout: 'split',
    kicker: 'III.2 · Vai trò của con người',
    title: 'Vừa là mục tiêu, vừa là động lực',
    left: {
      title: 'Mục tiêu của cách mạng',
      icon: 'star',
      items: ['Giải phóng dân tộc, xã hội và con người', 'Cuộc sống ấm no, tự do, hạnh phúc cho nhân dân'],
    },
    right: {
      title: 'Động lực của cách mạng',
      icon: 'users',
      items: ['Nhân dân trực tiếp lao động, đấu tranh, xây dựng đất nước', 'Phát huy đoàn kết, chủ động, sáng tạo của nhân dân'],
    },
  },
  {
    layout: 'feature',
    kicker: 'III.3 · Xây dựng con người',
    title: 'Nhiệm vụ cấp thiết, lâu dài, chiến lược',
    quote: { text: 'Muốn xây dựng chủ nghĩa xã hội, trước hết cần có những con người xã hội chủ nghĩa.', source: 'Hồ Chí Minh' },
    items: [
      { title: 'Nội dung', text: 'Phát triển toàn diện: lý tưởng, đạo đức, trách nhiệm, chuyên môn, sức khỏe', icon: 'sprout' },
      { title: 'Phương pháp', text: 'Giáo dục kết hợp tự rèn luyện; nêu gương của cán bộ, đảng viên', icon: 'lamp' },
      { title: 'Lực lượng', text: 'Cá nhân, gia đình, nhà trường và toàn xã hội cùng tham gia', icon: 'home' },
    ],
  },

  // ───────────────────────────── PHẦN IV ─────────────────────────────
  {
    layout: 'divider',
    part: 'Phần IV',
    title: 'Ý nghĩa và liên hệ vận dụng',
    subtitle: 'Văn hóa là nền tảng · Đạo đức là gốc · Con người là mục tiêu và động lực',
    art: 'ink',
  },
  {
    layout: 'table',
    kicker: 'IV · Liên hệ vận dụng',
    title: 'Sinh viên vận dụng trên năm lĩnh vực',
    rows: [
      { icon: 'book', field: 'Học tập', text: 'Chủ động học hỏi, trung thực trong thi cử, rèn tư duy sáng tạo' },
      { icon: 'lotus', field: 'Đạo đức', text: 'Sống có trách nhiệm, tôn trọng mọi người, giữ lời hứa' },
      { icon: 'scroll', field: 'Văn hóa', text: 'Giữ gìn tiếng Việt, truyền thống; tiếp thu có chọn lọc văn hóa thế giới' },
      { icon: 'globe', field: 'Đời sống', text: 'Lối sống lành mạnh; dùng mạng xã hội có trách nhiệm, không lan truyền tin sai' },
      { icon: 'users', field: 'Cộng đồng', text: 'Tham gia tình nguyện, hỗ trợ cộng đồng, bảo vệ môi trường' },
    ],
  },

  // ───────────────────────────── CQ9 ─────────────────────────────
  {
    layout: 'divider',
    part: 'Câu hỏi phản biện · CQ9',
    title: 'Tại sao "văn hóa còn thì dân tộc còn"?',
    subtitle: 'Ba ý trả lời của nhóm — khám phá trong mô hình 3D',
    art: 'red',
  },
  {
    layout: 'pillars',
    kicker: 'Kết luận',
    title: 'Một hệ thống nhất quán',
    items: [
      { title: 'Văn hóa', text: 'là nền tảng tinh thần', icon: 'scroll' },
      { title: 'Đạo đức', text: 'là gốc của con người', icon: 'lotus' },
      { title: 'Con người', text: 'là mục tiêu và động lực', icon: 'users' },
    ],
  },
  {
    layout: 'sources',
    title: 'Tài liệu tham khảo',
    items: [
      'Giáo trình Tư tưởng Hồ Chí Minh, Chương VI: Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người.',
      'Hồ Chí Minh: Toàn tập, 15 tập, Nxb Chính trị quốc gia, Hà Nội, 2011.',
      'Nghị quyết 24C/18.6.5, Khóa họp 24 Đại hội đồng UNESCO, 1987.',
      'Hồ Chí Minh: Đời sống mới (1947); Sửa đổi lối làm việc (1947); Nhật ký trong tù (1942–1943).',
    ],
  },
  {
    layout: 'thanks',
    title: 'Cảm ơn thầy cô và các bạn!',
    subtitle: 'Nhóm 6 sẵn sàng nhận câu hỏi và phản biện',
  },
];

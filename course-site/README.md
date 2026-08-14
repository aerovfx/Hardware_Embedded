# OpenCircuit Learning

Website khóa học tĩnh được sinh tự động từ các thư mục có `INDEX.md` và `lessons/week*.md`.

## Chạy local

```bash
cd course-site
npm run build
npm run serve
```

Mở `http://localhost:4173`. Mỗi lần sửa hoặc thêm Markdown, chạy lại `npm run build`.

## Tính năng

- Tự quét khóa học và bài học Markdown.
- Tìm kiếm, đọc bài, lưu tiến độ trên trình duyệt.
- Khảo sát học viên, rubric đánh giá đồng đẳng và chấm điểm giáo viên.
- Xuất toàn bộ kết quả dưới dạng JSON.
- GitHub Actions build và deploy GitHub Pages.

> Bản tĩnh không có hệ thống tài khoản hay cơ sở dữ liệu. Dữ liệu đánh giá nằm trong `localStorage` của từng trình duyệt; dùng nút **Xuất JSON** để thu bài hoặc tích hợp backend sau này.

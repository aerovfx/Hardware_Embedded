<div align="center">

# Hardware Embedded Academy

**Học phần cứng bằng cách thiết kế, lập trình và chế tạo hệ thống hoạt động thật.**

[![Course website](https://img.shields.io/badge/OPEN_COURSE_WEBSITE-587BD7?style=for-the-badge&logo=github)](https://aerovfx.github.io/Hardware_Embedded/)
[![GitHub Pages](https://github.com/aerovfx/Hardware_Embedded/actions/workflows/pages.yml/badge.svg)](https://github.com/aerovfx/Hardware_Embedded/actions/workflows/pages.yml)

[Khám phá khóa học](https://aerovfx.github.io/Hardware_Embedded/) · [Báo lỗi](https://github.com/aerovfx/Hardware_Embedded/issues) · [Đóng góp](#đóng-góp)

</div>

---

## Giới thiệu

Kho học liệu mở về thiết kế chip, IoT, robotics và hệ thống nhúng. Nội dung được tổ chức thành các lộ trình 10 tuần, kết hợp lý thuyết, code mẫu, bài tập thực hành và dự án cuối khóa.

Website học tập được sinh tự động từ các file Markdown trong repository và triển khai bằng GitHub Pages.

## Các khóa học

| Lĩnh vực | Khóa học | Nội dung chính |
| --- | --- | --- |
| Chip Design | [Chip Design — 10 tuần](1_Chip_Design/chip-design-10weeks/) | Digital logic, Verilog và quy trình thiết kế chip |
| IoT & Robotics | [Arduino Autonomous Car](2_IoT_Smart_Devices/arduino-autonomous-car-10weeks/) | Arduino, cảm biến và xe tự hành |
| IoT & Robotics | [DIY Drone](2_IoT_Smart_Devices/drone-diy-10weeks/) | Cấu tạo, điều khiển và an toàn bay |
| IoT & Robotics | [IoT Robotics](2_IoT_Smart_Devices/iot-robotics-10weeks/) | ESP32, kết nối IoT và robot |
| STEM | [Micro:bit STEM](2_IoT_Smart_Devices/microbit-10weeks/) | Lập trình vật lý dành cho người mới |
| STEM | [Pico STEM](2_IoT_Smart_Devices/pico-stem-10weeks/) | RP2040, MicroPython và thiết bị thông minh |
| Robotics | [Raspberry Pi Autonomous Car](2_IoT_Smart_Devices/raspi4-autonomous-car-10weeks/) | Computer vision, AI và ROS 2 |

## Nền tảng học tập

Truy cập **[aerovfx.github.io/Hardware_Embedded](https://aerovfx.github.io/Hardware_Embedded/)** để:

- Tìm kiếm và đọc 70 bài học trực tiếp trên web.
- Theo dõi tiến độ hoàn thành từng tuần.
- Gửi khảo sát sau khóa học.
- Thực hiện đánh giá đồng đẳng theo rubric.
- Chấm điểm giáo viên và xuất kết quả dạng JSON.

> Tiến độ và kết quả đánh giá hiện được lưu trong `localStorage` của trình duyệt. Hãy dùng chức năng **Xuất JSON** khi cần sao lưu hoặc nộp kết quả.

## Cấu trúc khóa học

```text
<course>-10weeks/
├── INDEX.md              # Giới thiệu khóa học
├── schedule.md           # Lịch học 10 tuần
├── lessons/week01.md     # Nội dung từng tuần
├── code/                 # Code mẫu
├── exercises/            # Bài tập và starter code
├── projects/             # Dự án cuối khóa
└── references/           # Linh kiện, phần mềm và an toàn
```

## Chạy website trên máy

Yêu cầu: Node.js 18 trở lên và Python 3.

```bash
git clone https://github.com/aerovfx/Hardware_Embedded.git
cd Hardware_Embedded/course-site
npm run build
npm run serve
```

Mở [http://localhost:4173](http://localhost:4173). Chạy lại `npm run build` sau khi thêm hoặc sửa học liệu Markdown.

## Đóng góp

1. Fork repository và tạo một branch riêng.
2. Chỉnh sửa học liệu hoặc website.
3. Chạy `npm run build` trong `course-site`.
4. Mở pull request, mô tả khóa học hoặc thay đổi đã thực hiện.

Khi làm việc với phần cứng thật, luôn tuân thủ hướng dẫn an toàn của từng khóa học—đặc biệt với nguồn điện, động cơ và cánh quạt drone.

## Giấy phép

Repository chưa khai báo giấy phép sử dụng. Vui lòng liên hệ chủ repository trước khi tái phân phối nội dung ngoài phạm vi học tập cá nhân.

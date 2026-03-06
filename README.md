# 🚀 CoreOS Pro – Web File & Note Manager (Frontend)

CoreOS Pro là một ứng dụng quản lý tệp và ghi chú chạy hoàn toàn trên Frontend, được xây dựng nhằm mục đích học tập và thử nghiệm các kỹ thuật JavaScript, HTML5 và CSS3 hiện đại. Hệ thống mô phỏng một môi trường quản lý dữ liệu giống hệ điều hành thu nhỏ ngay trên trình duyệt.

---

## ✨ Tính năng chính

### 📊 Dashboard Tổng Quan
* **Banner chào mừng:** Giao diện cá nhân hóa và khu vực thao tác nhanh.
* **Quản lý dung lượng:** Hiển thị biểu đồ **Circular Storage Progress** trực quan.
* **Quick Tools:** Truy cập nhanh các công cụ quan trọng.

### 📂 File Explorer (Trình quản lý tệp)
* **Thao tác thư mục:** Tạo mới tệp tin hoặc thư mục không giới hạn cấp độ.
* **Hệ thống Drag & Drop:** Kéo thả tệp giữa các thư mục hoặc kéo vào thùng rác để xóa.
* **Upload:** Hỗ trợ tải tệp từ máy tính vào hệ thống ảo.
* **Điều hướng:** Cấu trúc dạng cây (Tree view) giúp quản lý thư mục dễ dàng.

### 📝 Note Manager (Ghi chú)
* **Trình chỉnh sửa:** Giao diện soạn thảo mượt mà với chế độ Bật/Tắt chỉnh sửa.
* **Lưu trữ tức thời:** Tự động cập nhật thay đổi vào hệ thống.

### 💾 Hệ thống lưu trữ & Upload
* **LocalStorage:** Lưu trữ dữ liệu bền vững trên trình duyệt mà không cần Backend.
* **Giới hạn:** Quản lý hạn mức lưu trữ (Limit 100MB).
* **Đọc tệp nâng cao:** Hỗ trợ hiển thị nội dung tệp `.txt` và `.docx` (sử dụng Mammoth.js).

---

## 🛠 Công nghệ sử dụng

* **Ngôn ngữ chính:** JavaScript (Vanilla JS), HTML5, CSS3.
* **Thư viện Icon:** [Lucide Icons](https://lucide.dev/).
* **Xử lý văn bản:** [Mammoth.js](https://github.com/mwilliamson/mammoth.js) (Convert .docx sang HTML).
* **Lưu trữ:** Web Storage API (LocalStorage).

---

## 🏗 Cấu trúc dự án

```
coreos-pro/
│
├── index.html    # Giao diện cấu trúc chính
├── style.css     # Thiết kế giao diện & hiệu ứng (Responsive)
├── script.js    # Logic xử lý DOM, File System & LocalStorage
│
└──README.md
```
🚀 Cách chạy dự án
Clone repository:
```
Bash
git clone [https://github.com/tranvonghoclaptrinh/coreos-pro.git](https://github.com/tranvonghoclaptrinh/coreos-pro.git)
```
Mở tệp:
Mở trực tiếp tệp index.html bằng trình duyệt.

Hoặc sử dụng Extension Live Server trong VSCode để có trải nghiệm tốt nhất.

>[!NOTE]
>Dự án không yêu cầu cài đặt Backend hoặc Database. Mọi dữ liệu được lưu cục bộ trên trình duyệt của bạn.

🎯 Mục đích & Định hướng tương lai
Dự án giúp luyện tập kỹ năng quản lý trạng thái (State management) bằng JavaScript thuần và thiết kế UI/UX Dashboard hiện đại.

Dự kiến phát triển:

-[ ] Tích hợp Backend API & Cloud Storage (Firebase/Supabase).

-[ ] Hệ thống đăng nhập (Authentication).

-[ ] Đồng bộ hóa dữ liệu đa thiết bị.

-[ ] Nâng cấp Rich Text Editor cho phần Ghi chú.

👤 Tác giả
Trần Hữu Vọng

Cảm ơn bạn đã ghé thăm dự án! Nếu thấy thú vị, hãy tặng mình một ⭐ nhé!
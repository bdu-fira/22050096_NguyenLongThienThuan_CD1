
# 📦 Dự Án: Website Quản Lý Chính Sách Bán Hàng và Quyền Lợi Khách Hàng

## 🧑‍🏫 Giới thiệu
Đây là hệ thống website hỗ trợ quy trình quản lý đơn hàng – báo giá – hợp đồng cho cả **khách hàng** và **nhân viên kinh doanh**. Khách hàng có thể đặt hàng trực tiếp trên hệ thống, nhân viên tiếp nhận và xử lý báo giá dựa trên các mức chiết khấu, khuyến mãi và cấp độ khách hàng. Sau khi xác nhận, hệ thống hỗ trợ tạo và quản lý hợp đồng điện tử.

---

## 🔧 Công nghệ sử dụng

| Thành phần | Công nghệ          |
|------------|------------------  |
| Frontend   | React js           |
| Backend    | Node.js            |
| Database   | MySQL              |
| Auth       | JWT, Bcrypt        |
| Email/OTP  | SMTP               |
| Triển khai | Docker,Cloud (AWS) |

---

## ⚙️ Các chức năng chính

### 👤 Quản lý người dùng
- Đăng ký, đăng nhập, quên mật khẩu
- Phân quyền (Admin, Sale, Khách hàng)
- Gán vai trò, cập nhật, khóa tài khoản

### 📦 Quản lý sản phẩm & danh mục
- Thêm/sửa/xóa sản phẩm & danh mục
- Quản lý giá, tồn kho, mô tả
- Tìm kiếm sản phẩm nâng cao

### 🛒 Đặt hàng & giỏ hàng
- Khách chọn sản phẩm → thêm vào giỏ → đặt hàng
- Hệ thống xử lý giảm giá theo cấp độ & khuyến mãi

### 💸 Báo giá tự động
- Tính toán báo giá theo khuyến mãi & loại khách
- Nhân viên gửi báo giá → khách xác nhận

### 📃 Hợp đồng điện tử
- Tạo hợp đồng từ báo giá
- Khách duyệt, chỉnh sửa, ký hợp đồng trực tuyến
- Lưu trữ & tra cứu hợp đồng



---

## 🗃️ Cấu trúc cơ sở dữ liệu

- `Accounts`, `Roles`, `AccountRoles`
- `Customers`, `CustomerTypes`, `Employees`
- `Categories`, `Products`
- `Promotions`, `PromotionTypes`, `ProductPromotions`
- `Orders`, `OrderDetails`
- `Quotes`, `QuoteDetails`
- `Contracts`

---

## ☁️ Mô hình triển khai Cloud

- **Frontend** chạy trên EC2 public subnet
- **Backend (Auth, Order, Contract)** chạy riêng biệt
- **Database (MySQL)** trên Amazon RDS (private subnet)
- Tất cả chạy trong **VPC riêng biệt** qua Internet Gateway/API Gateway
- Bảo mật: sử dụng **Security Group, NACL, JWT, mã hóa mật khẩu**



---

## 🚀 Hướng phát triển tương lai

- Tích hợp CloudFront, S3, AWS WAF, KMS
- Triển khai công cụ giám sát nâng cao (AWS X-Ray)
- Áp dụng Reserved Instance để tối ưu chi phí
- Mở rộng kết nối hệ thống qua API Gateway
- Tích hợp AI/ML với Amazon SageMaker để phân tích nhu cầu và tối ưu bán hàng

---

## 👥 Nhóm thực hiện

- Nguyễn Long Thiên Thuận – 22050096  
- Nguyễn Hoàng Nhật Tân – 22050101  
- Nguyễn Trọng Hiếu – 22050095  
- Giảng viên hướng dẫn: ThS. Nguyễn Thanh Sơn
                        ThS. Hồ Ngọc Giàu
                        ThS. Dương Anh Tuấn
                        ThS. Nguyễn Hữu Quyền
---

## 📅 Năm thực hiện: 2025

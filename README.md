ĐỒ ÁN MÔN HỌC - HỆ THỐNG QUẢN LÝ VẬT TƯ CƠ KHÍ & THƯƠNG MẠI ĐIỆN TỬ
Thông tin sinh viên
Họ và tên: Lê Thanh Hồ
MSSV: 2123110125
Lớp: CCQ2311D
Giới thiệu
Hệ thống được xây dựng nhằm hỗ trợ quản lý và kinh doanh vật tư cơ khí trực tuyến. Dự án bao gồm hai phân hệ:

1. Phân hệ Quản trị (Admin CMS)
Được xây dựng bằng ASP.NET Core MVC, hỗ trợ:

Quản lý danh mục sản phẩm
Quản lý sản phẩm
Quản lý khách hàng
Quản lý đơn hàng
Quản lý nhân viên
Theo dõi doanh thu
Theo dõi tồn kho
2. Phân hệ Khách hàng (Frontend ReactJS)
Cho phép khách hàng:

Đăng ký tài khoản
Đăng nhập hệ thống
Xem danh sách sản phẩm
Tìm kiếm sản phẩm
Xem chi tiết sản phẩm
Thêm sản phẩm vào giỏ hàng
Đặt hàng trực tuyến
Xem lịch sử đơn hàng
Đổi mật khẩu
Công nghệ sử dụng
Backend
ASP.NET Core Web API
ASP.NET Core MVC
Entity Framework Core
SQL Server
Frontend
ReactJS
React Router DOM
Axios
Bootstrap
Hướng dẫn cài đặt
Backend
Yêu cầu:

.NET SDK 8.0
SQL Server
Cấu hình chuỗi kết nối trong file:

appsettings.json
Thực hiện Migration:

dotnet ef database update
Chạy ứng dụng:

dotnet run
Địa chỉ mặc định:

https://localhost:7116
Frontend
Di chuyển vào thư mục Frontend:

cd cms.frontend
Cài đặt thư viện:

npm install
Khởi chạy ứng dụng:

npm start
Địa chỉ mặc định:

http://localhost:3000
Chức năng chính
Quản trị viên
Đăng nhập hệ thống
Quản lý danh mục sản phẩm
Quản lý sản phẩm
Quản lý khách hàng
Quản lý đơn hàng
Quản lý nhân viên
Thống kê doanh thu theo thời gian
Theo dõi số lượng tồn kho
Khách hàng
Đăng ký tài khoản
Đăng nhập
Xem danh sách sản phẩm
Tìm kiếm sản phẩm
Xem chi tiết sản phẩm
Thêm vào giỏ hàng
Đặt hàng
Theo dõi đơn hàng
Đổi mật khẩu
Cấu trúc dự án
CMS.Backend
│
├── Controllers
├── Models
├── Data
├── Services
└── Migrations

CMS.Frontend
│
├── Pages
├── Components
├── Services
├── Routes
└── Assets
Tác giả
Lê Thanh Hồ

MSSV: 2123110125

Lớp: CCQ2311D

/*
 Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthApiController(ApplicationDbContext context) => _context = context;

        /// <summary>API Đăng nhập ngoài trang mua sắm ReactJS</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 🔒 SỬA TẠI ĐÂY: Truy vấn CHÍNH XÁC từ bảng Customers (Khách hàng)
            // Sử dụng mật khẩu thô (model.Password) theo đúng Entity Customer của bạn
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower() && c.Password == model.Password);

            // Nếu không tìm thấy thợ nào khớp tài khoản/mật khẩu trong bảng Customers
            if (customer == null)
            {
                return Unauthorized(new { message = "Tài khoản thợ hoặc mật khẩu không chính xác!" });
            }

            // Trả về dữ liệu sạch, ép cứng vai trò chữ "Khách hàng" về cho ReactJS nhận diện
            return Ok(new
            {
                message = "Đăng nhập tài khoản thợ thành công!",
                customerId = customer.Id,
                fullName = customer.FullName,
                role = "Khách hàng" // Gửi kèm thuộc tính này để vượt qua bẫy chặn của ReactJS
            });
        }
        /// <summary>API Xử lý Quên mật khẩu cho Khách hàng/Thợ</summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập địa chỉ Email để khôi phục!" });
            }

            // 1. Kiểm tra Email có tồn tại trong bảng Customers thực tế không
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null)
            {
                return NotFound(new { message = "Địa chỉ Email này không tồn tại trên hệ thống tài khoản thợ!" });
            }

            // 2. Thuật toán tạo mật khẩu ngẫu nhiên mới (Gồm 6 ký tự số đơn giản cho thợ dễ nhớ)
            var random = new Random();
            string newPlainPassword = random.Next(100000, 999999).ToString();

            // 3. Cập nhật mật khẩu mới vào bảng Customers (Lưu dạng Plain Text tối giản theo Entity của bạn)
            customer.Password = newPlainPassword;
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            // 4. Trả mật khẩu mới về cho Frontend (Trong thực tế sẽ gửi Email, nhưng làm đồ án thì trả trực tiếp về JSON để demo cho Hội đồng xem luôn)
            return Ok(new
            {
                message = "Hệ thống đã xác thực tài khoản thành công!",
                newPassword = newPlainPassword
            });
        }
     // Khép góc Class AuthApiController
    /// <summary>API Đổi mật khẩu dành cho thợ đang đăng nhập</summary>
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Kiểm tra tài khoản thợ có tồn tại theo ID không
            var customer = await _context.Customers.FindAsync(model.CustomerId);
            if (customer == null)
            {
                return NotFound(new { message = "Tài khoản thợ không tồn tại hoặc phiên làm việc hết hạn!" });
            }

            // 2. Xác thực mật khẩu cũ (So sánh trực tiếp dạng Plain Text theo Entity của bạn)
            if (customer.Password != model.OldPassword)
            {
                return BadRequest(new { message = "Mật khẩu kỹ thuật hiện tại không chính xác!" });
            }

            // 3. Cập nhật mật khẩu cơ khí mới
            customer.Password = model.NewPassword;
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã cập nhật mật khẩu mới thành công!" });
        }
    } // Khép góc Class AuthApiController
}

    public class CustomerLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
public class ForgotPasswordDto
{
    public string Email { get; set; }
}
public class ChangePasswordDto
{
    public int CustomerId { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}
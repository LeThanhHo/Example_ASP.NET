/*
 Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthApiController(ApplicationDbContext context) => _context = context;

        // 💡 HÀM BĂM MẬT KHẨU SHA-256 ĐỒNG BỘ TOÀN HỆ THỐNG
        private string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password)) return string.Empty;
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        /// <summary>API Đăng nhập ngoài trang mua sắm ReactJS</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 💡 ĐÃ MÃ HÓA: Băm mật khẩu người dùng nhập vào trước khi so sánh với DB
            string hashedPassword = HashPassword(model.Password);

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower() && c.Password == hashedPassword);

            if (customer == null)
            {
                return Unauthorized(new { message = "Tài khoản thợ hoặc mật khẩu không chính xác!" });
            }

            return Ok(new
            {
                message = "Đăng nhập tài khoản thợ thành công!",
                customerId = customer.Id,
                fullName = customer.FullName,
                role = "Khách hàng"
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

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null)
            {
                return NotFound(new { message = "Địa chỉ Email này không tồn tại trên hệ thống tài khoản thợ!" });
            }

            // Tạo chuỗi số ngẫu nhiên 6 chữ số
            var random = new Random();
            string newPlainPassword = random.Next(100000, 999999).ToString();

            // 💡 ĐÃ MÃ HÓA: Băm mật khẩu ngẫu nhiên này trước khi cập nhật vào SQL Server
            customer.Password = HashPassword(newPlainPassword);
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            // Trả chuỗi thô (newPlainPassword) về cho Frontend hiển thị cho người dùng nhìn thấy
            return Ok(new
            {
                message = "Hệ thống đã xác thực tài khoản thành công!",
                newPassword = newPlainPassword
            });
        }

        /// <summary>API Đổi mật khẩu dành cho thợ đang đăng nhập</summary>
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _context.Customers.FindAsync(model.CustomerId);
            if (customer == null)
            {
                return NotFound(new { message = "Tài khoản thợ không tồn tại hoặc phiên làm việc hết hạn!" });
            }

            // 💡 ĐÃ MÃ HÓA: Băm mật khẩu cũ (model.OldPassword) nhập vào để đối chiếu với Database
            string hashedOldPassword = HashPassword(model.OldPassword);
            if (customer.Password != hashedOldPassword)
            {
                // Bẫy lỗi bảo mật nếu thợ nhập sai mật khẩu hiện tại
                return BadRequest(new { message = "Mật khẩu kỹ thuật hiện tại không chính xác!" });
            }

            // 💡 ĐÃ MÃ HÓA: Băm mật khẩu mới trước khi cập nhật xuống DB
            customer.Password = HashPassword(model.NewPassword);
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã cập nhật mật khẩu mới thành công!" });
        }
        /// <summary>API Đăng ký tài khoản thợ mới ngoài ReactJS</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Kiểm tra xem Email đăng ký này đã tồn tại trong bảng Customers chưa
            bool isEmailExists = await _context.Customers
                .AnyAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (isEmailExists)
            {
                // Bẫy lỗi chặn trùng tài khoản hệ thống
                return BadRequest(new { message = "Địa chỉ Email này đã được đăng ký trên hệ thống!" });
            }

            try
            {
                // 2. Tạo đối tượng thực thể Customer mới
                var newCustomer = new Customer
                {
                    FullName = model.FullName,
                    Email = model.Email,
                    Phone = model.Phone,
                    Address = model.Address,
                    // 💡 ĐÃ MÃ HÓA: Băm mật khẩu thợ nhập bằng SHA-256 đồng bộ với hệ thống đăng nhập
                    Password = HashPassword(model.Password)
                };

                // 3. Lưu xuống cơ sở dữ liệu SQL Server thực tế
                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đăng ký thành viên thợ đối tác thành công! Bạn có thể tiến hành đăng nhập." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi ngoại lệ trên hệ thống Server khi xử lý đăng ký." });
            }
        }
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
    public class CustomerRegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
    }
}
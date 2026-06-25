/*
 Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        /// <summary>API Đăng ký dành cho Khách hàng ngoài Frontend</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Kiểm tra trùng lặp tên đăng nhập (Email) trong bảng Users chung
            var isExist = await _context.Users.AnyAsync(u => u.Username.ToLower() == model.Email.ToLower());
            if (isExist) return BadRequest(new { message = "Địa chỉ Email này đã được đăng ký tài khoản!" });

            // Ép cứng Role luôn luôn là "Khách hàng" để bảo mật, tránh việc client tự gửi Role "Admin"
            var newUser = new User
            {
                Username = model.Email, // Lấy email làm Username đăng nhập
                FullName = model.FullName,
                Role = "Khách hàng",
                PasswordHash = HashPassword(model.Password)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành viên thành công!", customerId = newUser.Id });
        }

        /// <summary>API Đăng nhập ngoài trang mua sắm</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var hashedPwd = HashPassword(model.Password);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == model.Email.ToLower() && u.PasswordHash == hashedPwd);

            if (user == null)
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });

            // 🔒 CHẶN CHÉO CHỨC NĂNG: Khách hàng chỉ được đăng nhập ở trang mua sắm
            // (Nếu Admin muốn mua hàng bằng nick admin thì cho phép, còn nick Khách hàng thì giữ nguyên)
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                customerId = user.Id,
                fullName = user.FullName,
                role = user.Role
            });
        }
    }

    public class RegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class LoginDto { public string Email { get; set; } public string Password { get; set; } }
}
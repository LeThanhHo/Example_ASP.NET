/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>Quản lý người dùng</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UsersController(ApplicationDbContext context) => _context = context;

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        /// <summary>Lấy tất cả người dùng (không trả về mật khẩu)</summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users
                .OrderBy(u => u.FullName)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToList();
            return Ok(users);
        }

        /// <summary>Lấy người dùng theo ID</summary>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _context.Users
                .Where(u => u.Id == id)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefault();

            if (user == null)
                return NotFound(new { message = $"Không tìm thấy người dùng ID={id}" });

            return Ok(user);
        }

        /// <summary>Thêm người dùng mới</summary>
        [HttpPost]
        public IActionResult Create([FromBody] CreateUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Role))
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin" });

            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == request.Username.ToLower());
            if (isDuplicate)
                return Conflict(new { message = "Tên đăng nhập đã tồn tại" });

            var user = new User
            {
                Username = request.Username,
                FullName = request.FullName,
                Role = request.Role,
                PasswordHash = HashPassword(request.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Role
            });
        }

        /// <summary>Cập nhật người dùng (để trống Password nếu không đổi)</summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateUserRequest request)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound(new { message = $"Không tìm thấy người dùng ID={id}" });

            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == request.Username.ToLower() && u.Id != id);
            if (isDuplicate)
                return Conflict(new { message = "Tên đăng nhập đã tồn tại" });

            user.Username = request.Username;
            user.FullName = request.FullName;
            user.Role = request.Role;

            if (!string.IsNullOrWhiteSpace(request.NewPassword))
                user.PasswordHash = HashPassword(request.NewPassword);

            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công", user.Id, user.Username, user.FullName });
        }

        /// <summary>Xóa người dùng</summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound(new { message = $"Không tìm thấy người dùng ID={id}" });

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok(new { message = $"Đã xóa người dùng \"{user.FullName}\"" });
        }
    }

    // DTO riêng để tránh expose PasswordHash ra ngoài
    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string? NewPassword { get; set; }
    }
}

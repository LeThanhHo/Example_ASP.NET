/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm băm mật khẩu SHA256 đồng bộ hệ thống
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // GET: /Account/Login
        [HttpGet]
        public IActionResult Login()
        {
            // 💡 ĐÃ SỬA: Thay thế "Login.Identity" bằng "User.Identity" chuẩn xác để hết lỗi
            if (User.Identity?.IsAuthenticated == true)
            {
                // Nếu đã đăng nhập hệ thống rồi thì đẩy thẳng về trang chủ Dashboard quản trị
                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        // POST: /Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.";
                return View();
            }

            string hashedPassword = HashPassword(password);

            // Truy vấn kiểm tra thông tin tài khoản tại bảng Users chung
            var user = _context.Users
                .FirstOrDefault(u => u.Username.ToLower() == username.ToLower() && u.PasswordHash == hashedPassword);

            if (user != null)
            {
                // 🔒 💡 CHẶN KHÁCH HÀNG: Nếu tài khoản mang Role "Khách hàng", chặn ngay không cho vào Admin
                if (user.Role == "Khách hàng")
                {
                    ViewBag.Error = "Quyền truy cập bị từ chối! Tài khoản khách hàng chỉ được phép sử dụng ở trang mua sắm Frontend.";
                    return View();
                }

                // THIẾT LẬP CẤP QUYỀN ĐĂNG NHẬP COOKIE CHO ADMIN/NHÂN VIÊN
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("FullName", user.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                // Đồng bộ lưu thêm Session b bọc lót nếu các View cũ của bạn cần dùng
                HttpContext.Session.SetInt32("AdminId", user.Id);
                HttpContext.Session.SetString("AdminName", user.FullName);

                return RedirectToAction("Index", "Home");
            }

            ViewBag.Error = "Tài khoản hoặc mật khẩu quản trị không chính xác!";
            return View();
        }

        // GET: /Account/Logout
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear(); // Dọn dẹp sạch Session
            return RedirectToAction("Login");
        }

        // GET: /Account/AccessDenied
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
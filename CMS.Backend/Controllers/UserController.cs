/*
 Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        public UserController(ApplicationDbContext context) => _context = context;

        // Hàm hash mật khẩu SHA256 đồng bộ hệ thống
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // GET: /User/Index
        public IActionResult Index()
        {
            var users = _context.Users.ToList(); // Quản lý nội bộ bảng Users nhân viên
            return View(users);
        }

        // GET: /User/Create
        public IActionResult Create()
        {
            ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
            return View();
        }

        // POST: /User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model, string Password)
        {
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid)
            {
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
                return View(model);
            }

            if (_context.Users.Any(u => u.Username.ToLower() == model.Username.ToLower()))
            {
                ModelState.AddModelError("Username", "Tên đăng nhập nội bộ này đã tồn tại!");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
                return View(model);
            }

            if (string.IsNullOrWhiteSpace(Password))
            {
                ModelState.AddModelError("Password", "Mật khẩu hệ thống không được để trống");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
                return View(model);
            }

            model.PasswordHash = HashPassword(Password);
            _context.Users.Add(model);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã thêm nhân viên \"{model.FullName}\" thành công!";
            return RedirectToAction("Index");
        }

        // ── 💡 ĐÃ BỔ SUNG: HÀM EDIT (GET) — LẤY THÔNG TIN ĐỂ CHỈNH SỬA ──
        // GET: /User/Edit/5
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy tài khoản nhân viên nội bộ cần sửa.";
                return RedirectToAction("Index");
            }

            // Đổ lại danh sách Role nội bộ vào Dropdown, chọn sẵn Role hiện tại của User
            ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, user.Role);
            return View(user);
        }

        // ── 💡 ĐÃ BỔ SUNG: HÀM EDIT (POST) — LƯU DỮ LIỆU CHỈNH SỬA XUỐNG DB ──
        // POST: /User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string NewPassword)
        {
            if (id != model.Id) return BadRequest();

            ModelState.Remove("PasswordHash");
            ModelState.Remove("NewPassword");

            if (!ModelState.IsValid)
            {
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, model.Role);
                return View(model);
            }

            // Kiểm tra trùng tên đăng nhập hệ thống (trừ chính nó)
            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == model.Username.ToLower() && u.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập hệ thống này đã tồn tại");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, model.Role);
                return View(model);
            }

            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy tài khoản nhân viên nội bộ cần sửa.";
                    return RedirectToAction("Index");
                }

                // Cập nhật các trường thông tin nội bộ
                user.Username = model.Username;
                user.FullName = model.FullName;
                user.Role = model.Role;

                // Chỉ băm và cập nhật mật khẩu mới SHA256 nếu Admin nhập vào ô trống
                if (!string.IsNullOrWhiteSpace(NewPassword))
                {
                    user.PasswordHash = HashPassword(NewPassword);
                }

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật thông tin nhân viên \"{user.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi trong quá trình lưu dữ liệu hệ thống.");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, model.Role);
                return View(model);
            }
        }

        // ── 💡 ĐÃ BỔ SUNG: HÀM DELETE (POST) — XÓA TÀI KHOẢN KHỎI DB ──
        // POST: /User/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy nhân viên hệ thống cần xóa.";
                    return RedirectToAction("Index");
                }

                // (Bọc lót an toàn): Không cho phép Admin tự xóa chính tài khoản mình đang đăng nhập
                var currentAdminName = User.Identity?.Name;
                if (user.Username.Equals(currentAdminName, StringComparison.OrdinalIgnoreCase))
                {
                    TempData["ErrorMessage"] = "Lỗi bảo mật: Bạn không được phép tự xóa tài khoản quản trị của chính mình khi đang phiên làm việc!";
                    return RedirectToAction("Index");
                }

                _context.Users.Remove(user);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa tài khoản nhân viên \"{user.FullName}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi ngoại lệ khi thực hiện xóa dữ liệu.";
            }

            return RedirectToAction("Index");
        }
    }
}
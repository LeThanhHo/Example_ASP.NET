/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này



namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Hàm hash mật khẩu SHA256
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /User/Index
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // GET: /User/Create
        public IActionResult Create()
        {
            ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" });
            return View();
        }

        // POST: /User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model, string Password)
        {
            ModelState.Remove("PasswordHash"); // Hash sẽ tự tạo

            if (!ModelState.IsValid)
            {
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" });
                return View(model);
            }

            // Kiểm tra username đã tồn tại chưa
            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == model.Username.ToLower());

            if (isDuplicate)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã tồn tại");
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" });
                return View(model);
            }

            if (string.IsNullOrWhiteSpace(Password))
            {
                ModelState.AddModelError("Password", "Mật khẩu không được để trống");
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" });
                return View(model);
            }

            try
            {
                model.PasswordHash = HashPassword(Password);
                _context.Users.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã thêm người dùng \"{model.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" });
                return View(model);
            }
        }

        // GET: /User/Edit/5
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy người dùng cần sửa.";
                return RedirectToAction("Index");
            }

            ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" }, user.Role);
            return View(user);
        }

        // POST: /User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string NewPassword)
        {
            if (id != model.Id)
                return BadRequest();

            ModelState.Remove("PasswordHash");
            ModelState.Remove("NewPassword");

            if (!ModelState.IsValid)
            {
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" }, model.Role);
                return View(model);
            }

            // Kiểm tra trùng username (trừ chính nó)
            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == model.Username.ToLower() && u.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã tồn tại");
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" }, model.Role);
                return View(model);
            }

            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy người dùng cần sửa.";
                    return RedirectToAction("Index");
                }

                user.Username = model.Username;
                user.FullName = model.FullName;
                user.Role = model.Role;

                // Chỉ đổi mật khẩu nếu nhập mới
                if (!string.IsNullOrWhiteSpace(NewPassword))
                    user.PasswordHash = HashPassword(NewPassword);

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật người dùng \"{user.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                ViewBag.Roles = new SelectList(new[] { "Quản trị viên", "Biên tập viên" }, model.Role);
                return View(model);
            }
        }

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
                    TempData["ErrorMessage"] = "Không tìm thấy người dùng cần xóa.";
                    return RedirectToAction("Index");
                }

                _context.Users.Remove(user);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa người dùng \"{user.FullName}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi khi xóa. Vui lòng thử lại.";
            }

            return RedirectToAction("Index");
        }
    }
}
/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Controllers
{
    // [Authorize(Roles = "Admin")] 
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 💡 HÀM BĂM MẬT KHẨU SHA-256 ĐỒNG BỘ HỆ THỐNG
        private string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password)) return string.Empty;
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // GET: /Customer/Index
        public IActionResult Index()
        {
            var customers = _context.Customers.OrderBy(c => c.FullName).ToList();
            return View(customers);
        }

        // GET: /Customer/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Customer/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer model)
        {
            if (!ModelState.IsValid)
                return View(model);

            bool isDuplicate = _context.Customers
                .Any(c => c.Email.ToLower() == model.Email.ToLower());

            if (isDuplicate)
            {
                ModelState.AddModelError("Email", "Email khách hàng này đã tồn tại trên hệ thống!");
                return View(model);
            }

            if (string.IsNullOrWhiteSpace(model.Password))
            {
                ModelState.AddModelError("Password", "Mật khẩu không được để trống!");
                return View(model);
            }

            try
            {
                // 💡 ĐÃ MÃ HÓA: Băm mật khẩu trước khi lưu vào Database thực tế
                model.Password = HashPassword(model.Password);

                _context.Customers.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã thêm tài khoản khách hàng \"{model.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi hệ thống khi lưu dữ liệu khách hàng.");
                return View(model);
            }
        }

        // GET: /Customer/Edit/5
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy thông tin khách hàng cần chỉnh sửa.";
                return RedirectToAction("Index");
            }
            // Mẹo: Gán mật khẩu về rỗng ở giao diện để đảm bảo an toàn, tránh lộ chuỗi hash
            customer.Password = string.Empty;
            return View(customer);
        }

        // POST: /Customer/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Customer model, string NewPassword)
        {
            if (id != model.Id) return BadRequest();

            // Tạm thời bỏ qua kiểm tra dữ liệu trường Password mặc định vì xử lý qua ô NewPassword
            ModelState.Remove("Password");

            if (!ModelState.IsValid) return View(model);

            bool isDuplicate = _context.Customers
                .Any(c => c.Email.ToLower() == model.Email.ToLower() && c.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng bởi một khách hàng khác!");
                return View(model);
            }

            try
            {
                var customer = _context.Customers.Find(id);
                if (customer == null) return NotFound();

                customer.FullName = model.FullName;
                customer.Email = model.Email;
                customer.Phone = model.Phone;
                customer.Address = model.Address;

                // 💡 XỬ LÝ ĐỔI MẬT KHẨU THÔNG MINH: Chỉ băm mật khẩu mới nếu Admin nhập vào ô trống ngoài View
                if (!string.IsNullOrWhiteSpace(NewPassword))
                {
                    customer.Password = HashPassword(NewPassword);
                }

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Cập nhật thông tin khách hàng \"{customer.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Không thể lưu thay đổi. Vui lòng kiểm tra lại kết nối Database.");
                return View(model);
            }
        }

        // POST: /Customer/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var customer = _context.Customers.Find(id);
                if (customer == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy khách hàng cần xóa.";
                    return RedirectToAction("Index");
                }

                bool hasOrders = _context.Orders.Any(o => o.CustomerId == id);
                if (hasOrders)
                {
                    TempData["ErrorMessage"] = $"Không thể xóa khách hàng \"{customer.FullName}\" vì tài khoản này đã có lịch sử đặt mua đơn hàng cơ khí!";
                    return RedirectToAction("Index");
                }

                _context.Customers.Remove(customer);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa tài khoản khách hàng \"{customer.FullName}\" khỏi hệ thống.";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi trong tiến trình xóa dữ liệu.";
            }

            return RedirectToAction("Index");
        }
    }
}
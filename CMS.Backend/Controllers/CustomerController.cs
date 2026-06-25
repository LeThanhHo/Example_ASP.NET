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

namespace CMS.Backend.Controllers
{
    // Tạm thời comment Authorize để bạn dễ chạy thử nghiệm nghiệm thu đồ án
    // [Authorize(Roles = "Admin")] 
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Customer/Index (Trang hiển thị danh sách toàn bộ khách hàng)
        public IActionResult Index()
        {
            // Bốc dữ liệu từ bảng Customers thực tế
            var customers = _context.Customers.OrderBy(c => c.FullName).ToList();
            return View(customers);
        }

        // GET: /Customer/Create (Trang giao diện thêm thủ công khách hàng)
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

            // Kiểm tra trùng lặp Email khách hàng
            bool isDuplicate = _context.Customers
                .Any(c => c.Email.ToLower() == model.Email.ToLower());

            if (isDuplicate)
            {
                ModelState.AddModelError("Email", "Email khách hàng này đã tồn tại trên hệ thống!");
                return View(model);
            }

            try
            {
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

        // GET: /Customer/Edit/5 (Trang chỉnh sửa thông tin thợ/khách hàng)
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy thông tin khách hàng cần chỉnh sửa.";
                return RedirectToAction("Index");
            }
            return View(customer);
        }

        // POST: /Customer/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Customer model)
        {
            if (id != model.Id) return BadRequest();

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

                // Cập nhật các trường dữ liệu theo đúng thực thể Customer của bạn
                customer.FullName = model.FullName;
                customer.Email = model.Email;
                customer.Phone = model.Phone;
                customer.Address = model.Address;
                customer.Password = model.Password; // Giữ nguyên mật khẩu thô tối giản theo yêu cầu

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

        // POST: /Customer/Delete/5 (Xóa khách hàng)
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

                // Kiểm tra ràng buộc: Nếu khách hàng đã từng phát sinh đơn hàng, không cho xóa để tránh mồ côi dữ liệu
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
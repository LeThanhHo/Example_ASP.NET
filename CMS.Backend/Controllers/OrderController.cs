/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Order/Index (Xem danh sách toàn bộ hóa đơn đặt máy)
        public async Task<IActionResult> Index(int? status)
        {
            // Truy vấn đơn hàng bốc kèm thông tin User (Khách hàng) từ bảng chung để hiển thị tên
            var query = _context.Orders
                .Include(o => o.Customer) // Khóa ngoại liên kết thực thể User (Khách hàng)
                .AsQueryable();

            // Lọc theo bộ trạng thái nếu Admin chọn lọc nhanh trên thanh tab
            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var orders = await query.OrderByDescending(o => o.Id).ToListAsync();
            ViewBag.CurrentStatus = status;

            return View(orders);
        }

        // GET: /Order/Details/5 (Xem chi tiết thông số linh kiện và tổng tiền trong đơn hàng)
        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product) // Nạp kèm thông tin Product để lấy tên thiết bị cơ khí
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy hóa đơn mã số #" + id;
                return RedirectToAction(nameof(Index));
            }

            return View(order);
        }

        // POST: /Order/UpdateStatus (Cập nhật trạng thái đơn: Duyệt / Đang giao / Hoàn tất)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            // Chốt chặn trạng thái hợp lệ
            if (status < 0 || status > 3) return BadRequest();

            order.Status = status;
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Đã cập nhật trạng thái đơn hàng #{id} thành công!";
            return RedirectToAction(nameof(Details), new { id = order.Id });
        }
    }
}
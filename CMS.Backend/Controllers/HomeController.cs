/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            // 1. Các chỉ số đếm cơ bản giữ nguyên
            ViewBag.TotalNewOrders = await _context.Orders.Where(o => o.Status == 0).CountAsync();
            ViewBag.TotalProducts = await _context.Products.CountAsync();
            ViewBag.TotalCustomers = await _context.Customers.CountAsync();
            ViewBag.TotalPosts = await _context.Posts.CountAsync();

            // Mốc thời gian hiện tại để so sánh
            var now = DateTime.Now;
            var today = now.Date;
            var currentMonth = now.Month;
            var currentYear = now.Year;
            var currentQuarter = (now.Month - 1) / 3 + 1; // Tính Quý hiện tại (1, 2, 3, 4)

            // 2. 💡 THUẬT TOÁN TÍNH DOANH THU THỰC TẾ (Chỉ tính Đơn hàng đã hoàn thành Status == 2)
            var completedOrders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.Status == 2)
                .ToListAsync();

            // Tính doanh thu Theo Ngày hôm nay
            ViewBag.RevenueToday = completedOrders
                .Where(o => o.OrderDetails != null) // Thay đổi so với dự thảo để check null an toàn
                .Sum(o => o.OrderDetails.Sum(od => (decimal)od.Quantity * od.UnitPrice));

            // Tính doanh thu Theo Tháng hiện tại
            ViewBag.RevenueMonth = completedOrders
                .Where(o => o.OrderDetails != null)
                .Sum(o => o.OrderDetails.Sum(od => (decimal)od.Quantity * od.UnitPrice));

            // Tính doanh thu Theo Quý hiện tại
            ViewBag.RevenueQuarter = completedOrders
                .Where(o => o.OrderDetails != null)
                .Sum(o => o.OrderDetails.Sum(od => (decimal)od.Quantity * od.UnitPrice));

            // Tính doanh thu Toàn Năm nay
            ViewBag.RevenueYear = completedOrders
                .Where(o => o.OrderDetails != null)
                .Sum(o => o.OrderDetails.Sum(od => (decimal)od.Quantity * od.UnitPrice));

            // 3. Bốc danh sách Đơn hàng mới và Hàng sắp hết
            var recentOrders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .Take(5)
                .ToListAsync();

            ViewBag.LowStockProducts = await _context.Products
                .Where(p => p.StockQuantity <= 5)
                .OrderBy(p => p.StockQuantity)
                .Take(5)
                .ToListAsync();

            return View(recentOrders);
        }
    }
}
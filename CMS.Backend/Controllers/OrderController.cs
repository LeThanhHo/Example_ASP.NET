/*
 Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D
*/
using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
   
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        public OrderController(ApplicationDbContext context) => _context = context;

        public async Task<IActionResult> Index(int? status)
        {
            // Include chính xác thực thể Customer (Bảng Customers bên ngoài)
            var query = _context.Orders.Include(o => o.Customer).AsQueryable();

            if (status.HasValue) query = query.Where(o => o.Status == status.Value);

            var orders = await query.OrderByDescending(o => o.Id).ToListAsync();
            return View(orders);
        }

        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer) // Bốc đầy đủ trường Họ tên, Email, Phone, Address từ bảng Customer
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return RedirectToAction(nameof(Index));
            return View(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Details), new { id = order.Id });
        }
    }
}
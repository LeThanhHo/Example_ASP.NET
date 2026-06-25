/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerOrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CustomerOrdersApiController(ApplicationDbContext context) => _context = context;

        /// <summary>API dành riêng cho Khách hàng xem lịch sử mua hàng ngoài ReactJS</summary>
        /// <param name="customerId">Truyền vào mã ID của khách hàng đang đăng nhập (Lấy từ localStorage)</param>
        [HttpGet("history/{customerId}")]
        public async Task<IActionResult> GetOrderHistory(int customerId)
        {
            // RÀNG BUỘC BẢO MẬT: Chỉ bốc các đơn hàng có CustomerId TRÙNG khớp với ID người đang xem
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product) // Nạp kèm thông tin máy móc để lấy tên thiết bị
                .OrderByDescending(o => o.Id)  // Đơn mới đặt xếp lên đầu
                .Select(o => new {
                    o.Id,
                    o.Status, // 0: Chờ duyệt, 1: Đang giao, 2: Hoàn tất
                    o.Notes,
                    TotalAmount = o.OrderDetails.Sum(od => od.Quantity * od.UnitPrice), // Tự tính tổng tiền của đơn đó
                    Items = o.OrderDetails.Select(od => new {
                        od.ProductId,
                        ProductName = od.Product.Name,
                        od.Quantity,
                        od.UnitPrice
                    })
                })
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return Ok(new { message = "Bạn chưa có lịch sử đặt mua đơn hàng nào!", data = orders });
            }

            return Ok(orders);
        }
    }
}
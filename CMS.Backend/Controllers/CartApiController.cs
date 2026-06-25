/*
 Ten: Le Thanh Ho 
 MSSV: 2123110125 
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CartApiController(ApplicationDbContext context) => _context = context;

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CartCheckoutDto payload)
        {
            if (payload.CustomerId <= 0)
            {
                return Unauthorized(new { message = "Ràng buộc hệ thống: Bạn phải đăng nhập mới có thể mua hàng!" });
            }

            // 🔒 XÁC THỰC: Phải tồn tại trong bảng Customers biệt lập
            var customer = await _context.Customers.FindAsync(payload.CustomerId);
            if (customer == null) return NotFound(new { message = "Tài khoản khách hàng không hợp lệ!" });

            if (payload.Items == null || payload.Items.Count == 0) return BadRequest(new { message = "Giỏ hàng trống." });

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var order = new Order
                    {
                        CustomerId = customer.Id, // Khóa ngoại trỏ sang bảng Customers chuẩn chỉ
                        Status = 0,
                        Notes = payload.Notes
                    };
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();

                    foreach (var item in payload.Items)
                    {
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product == null) return BadRequest(new { message = "Sản phẩm không tồn tại." });

                        if (product.StockQuantity < item.Quantity)
                        {
                            return BadRequest(new { message = $"Vật tư [{product.Name}] trong kho không đủ cung ứng." });
                        }

                        product.StockQuantity -= item.Quantity;

                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price
                        };
                        _context.OrderDetails.Add(orderDetail);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new { message = "Đặt hàng dụng cụ thành công!", orderId = order.Id });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Lỗi chốt đơn: " + ex.Message });
                }
            }
        }
    }

    // ── 💡 ĐÃ THÊM ĐẦY ĐỦ CÁC CLASS DTO Ở ĐÂY ────────────────────────────
    public class CartCheckoutDto
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<CartItemDto> Items { get; set; }
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
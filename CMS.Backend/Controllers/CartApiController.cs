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

        /// <summary>API Tiếp nhận giỏ hàng và chốt đơn</summary>
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CartCheckoutDto payload)
        {
            // 🔒 1. SỬA ĐỔI RÀNG BUỘC: Kiểm tra tài khoản có tồn tại thực tế trong bảng Users không
            if (payload.CustomerId <= 0)
            {
                return Unauthorized(new { message = "Ràng buộc hệ thống: Bạn phải đăng nhập tài khoản thành viên mới có thể thực hiện mua hàng!" });
            }

            var user = await _context.Users.FindAsync(payload.CustomerId);
            if (user == null)
            {
                return NotFound(new { message = "Lỗi bảo mật: Tài khoản thành viên không tồn tại trên hệ thống dữ liệu!" });
            }

            // (Tùy chọn) Nếu bạn muốn chỉ cho phép tài khoản Role "Khách hàng" đặt đơn hàng:
            if (user.Role != "Khách hàng" && user.Role != "Admin")
            {
                return Forbid();
            }

            if (payload.Items == null || payload.Items.Count == 0)
            {
                return BadRequest(new { message = "Giỏ hàng vật tư trống. Không thể khởi tạo đơn hàng!" });
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // 2. Tạo đơn hàng tổng (Order) -> Lưu user.Id chung vào cột CustomerId theo cấu trúc bảng cũ
                    var order = new Order
                    {
                        CustomerId = user.Id,
                        Status = 0, // Chờ duyệt
                        Notes = payload.Notes
                    };
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync(); // Lưu trước để sinh ra Order.Id tự động

                    // 3. Phân rã mảng sản phẩm trong giỏ hàng vào OrderDetail
                    foreach (var item in payload.Items)
                    {
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product == null) return BadRequest(new { message = $"Sản phẩm ID {item.ProductId} không còn tồn tại." });

                        // Kiểm tra kho hàng thực tế của tiệm cơ khí
                        if (product.StockQuantity < item.Quantity)
                        {
                            return BadRequest(new { message = $"Thiết bị [{product.Name}] trong kho không đủ số lượng cung ứng (Còn lại: {product.StockQuantity} máy)." });
                        }

                        // Trừ trực tiếp số lượng tồn kho
                        product.StockQuantity -= item.Quantity;

                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price // Rút giá thực tế từ Database để tránh client sửa đổi giá ở Frontend
                        };
                        _context.OrderDetails.Add(orderDetail);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync(); // Xác nhận giao dịch hoàn tất

                    return Ok(new { message = "Đơn hàng của bạn đã được tiếp nhận thành công!", orderId = order.Id });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Đã xảy ra lỗi hệ thống trong quá trình chốt đơn: " + ex.Message });
                }
            }
        }
    }

    // Khai báo cấu trúc DTO nhận Payload từ ReactJS gửi sang
    public class CartCheckoutDto
    {
        public int CustomerId { get; set; } // Đại diện cho UserId được gửi lên từ localStorage
        public string? Notes { get; set; }
        public List<CartItemDto> Items { get; set; }
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
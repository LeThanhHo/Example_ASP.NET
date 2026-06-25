/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Backend.Controllers.Api;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CartController(ApplicationDbContext context) => _context = context;

        // GET: /Cart/CheckoutPage
        public IActionResult CheckoutPage()
        {
            // 🔒 RÀNG BUỘC KIỂM TRA ĐĂNG NHẬP TRÊN VIEW C#
            int? customerId = HttpContext.Session.GetInt32("CurrentCustomerId");
            if (customerId == null)
            {
                TempData["ErrorMessage"] = "Bạn vui lòng đăng nhập tài khoản để xem giỏ hàng và tiến hành đặt mua dụng cụ!";
                return RedirectToAction("Login", "Auth");
            }

            return View();
        }

        // POST: /Cart/ProcessCheckout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ProcessCheckout(string notes, List<CartItemDto> cartItems)
        {
            int? customerId = HttpContext.Session.GetInt32("CurrentCustomerId");
            if (customerId == null) return RedirectToAction("Login", "Auth");

            if (cartItems == null || cartItems.Count == 0)
            {
                TempData["ErrorMessage"] = "Giỏ hàng rỗng!";
                return RedirectToAction("Index", "Home");
            }

            try
            {
                var order = new Order
                {
                    CustomerId = customerId.Value,
                    Status = 0,
                    Notes = notes
                };
                _context.Orders.Add(order);
                _context.SaveChanges();

                foreach (var item in cartItems)
                {
                    var prd = _context.Products.Find(item.ProductId);
                    if (prd != null && prd.StockQuantity >= item.Quantity)
                    {
                        prd.StockQuantity -= item.Quantity; // Cập nhật kho

                        var detail = new OrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = prd.Price
                        };
                        _context.OrderDetails.Add(detail);
                    }
                }
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đặt hàng dụng cụ cơ khí thành công!";
                return RedirectToAction("Index", "Home");
            }
            catch (Exception)
            {
                ViewBag.Error = "Đã xảy ra sự cố khi xử lý đơn hàng.";
                return View("CheckoutPage");
            }
        }
    }
}
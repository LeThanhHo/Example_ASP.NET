/*
  Ten: Le Thanh Ho
  MSSV: 2123110125
  Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Hosting; // Bắt buộc thêm để dùng IWebHostEnvironment
using Microsoft.AspNetCore.Http;    // Bắt buộc thêm để dùng IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment; // Khai báo dịch vụ quản lý thư mục

        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment; // Tiêm dịch vụ vào hệ thống
        }

        // GET: /Product/Index
        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderBy(p => p.Name)
                .ToList();
            return View(products);
        }

        // GET: /Product/Create
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(
                _context.CategoriesProducts.ToList(), "Id", "Name");
            return View();
        }

        // POST: /Product/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model, IFormFile imageFile) // Thêm imageFile nhận từ View
        {
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl"); // Xóa validation của URL cũ

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(
                    _context.CategoriesProducts.ToList(), "Id", "Name");
                return View(model);
            }

            try
            {
                // XỬ LÝ UPLOAD FILE ẢNH
                if (imageFile != null && imageFile.Length > 0)
                {
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "images", "products");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    string filePath = Path.Combine(uploadDir, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(fileStream);
                    }

                    model.ImageUrl = "/images/products/" + uniqueFileName;
                }
                else
                {
                    model.ImageUrl = "/images/products/default-tool.jpg"; // Ảnh mặc định nếu không chọn
                }

                _context.Products.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã thêm sản phẩm \"{model.Name}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                ViewBag.Categories = new SelectList(
                    _context.CategoriesProducts.ToList(), "Id", "Name");
                return View(model);
            }
        }

        // GET: /Product/Edit/5
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy sản phẩm cần sửa.";
                return RedirectToAction("Index");
            }

            ViewBag.Categories = new SelectList(
                _context.CategoriesProducts.ToList(), "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // POST: /Product/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Product model, IFormFile imageFile) // Thêm imageFile nhận từ View
        {
            if (id != model.Id)
                return BadRequest();

            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageUrl");

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(
                    _context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            try
            {
                var product = _context.Products.Find(id);
                if (product == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy sản phẩm cần sửa.";
                    return RedirectToAction("Index");
                }

                // XỬ LÝ CẬP NHẬT FILE ẢNH MỚI (NẾU CÓ)
                if (imageFile != null && imageFile.Length > 0)
                {
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "images", "products");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // Xóa ảnh cũ trên disk để dọn rác bộ nhớ (trừ ảnh mặc định)
                    if (!string.IsNullOrEmpty(product.ImageUrl) && !product.ImageUrl.Contains("default-tool.jpg"))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, product.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    string filePath = Path.Combine(uploadDir, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(fileStream);
                    }

                    product.ImageUrl = "/images/products/" + uniqueFileName;
                }
                // Nếu không chọn ảnh mới, giữ nguyên đường dẫn product.ImageUrl cũ

                product.Name = model.Name;
                product.Description = model.Description;
                product.Price = model.Price;
                product.StockQuantity = model.StockQuantity;
                product.CategoryProductId = model.CategoryProductId;

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật sản phẩm \"{model.Name}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                ViewBag.Categories = new SelectList(
                    _context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
                return View(model);
            }
        }

        // POST: /Product/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var product = _context.Products.Find(id);
                if (product == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy sản phẩm cần xóa.";
                    return RedirectToAction("Index");
                }

                // Xóa file ảnh vật lý khi xóa sản phẩm khỏi SQL Server
                if (!string.IsNullOrEmpty(product.ImageUrl) && !product.ImageUrl.Contains("default-tool.jpg"))
                {
                    string filePath = Path.Combine(_webHostEnvironment.WebRootPath, product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Products.Remove(product);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa sản phẩm \"{product.Name}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Không thể xóa sản phẩm này. Vui lòng thử lại.";
            }

            return RedirectToAction("Index");
        }
    }
}
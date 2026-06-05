/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
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
        public IActionResult Create(Product model)
        {
            ModelState.Remove("CategoryProduct");

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(
                    _context.CategoriesProducts.ToList(), "Id", "Name");
                return View(model);
            }

            try
            {
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
        public IActionResult Edit(int id, Product model)
        {
            if (id != model.Id)
                return BadRequest();

            ModelState.Remove("CategoryProduct");

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

                product.Name = model.Name;
                product.Description = model.Description;
                product.Price = model.Price;
                product.StockQuantity = model.StockQuantity;
                product.ImageUrl = model.ImageUrl;
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

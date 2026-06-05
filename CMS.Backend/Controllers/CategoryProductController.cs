/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /CategoryProduct/Index
        public IActionResult Index()
        {
            var categories = _context.CategoriesProducts
                .Include(c => c.Products)
                .OrderBy(c => c.Name)
                .ToList();
            return View(categories);
        }

        // GET: /CategoryProduct/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /CategoryProduct/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model)
        {
            ModelState.Remove("Products");

            if (!ModelState.IsValid)
                return View(model);

            bool isDuplicate = _context.CategoriesProducts
                .Any(c => c.Name.ToLower() == model.Name.ToLower());

            if (isDuplicate)
            {
                ModelState.AddModelError("Name", "Tên danh mục này đã tồn tại");
                return View(model);
            }

            try
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã thêm danh mục \"{model.Name}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                return View(model);
            }
        }

        // GET: /CategoryProduct/Edit/5
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy danh mục cần sửa.";
                return RedirectToAction("Index");
            }
            return View(category);
        }

        // POST: /CategoryProduct/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, CategoryProduct model)
        {
            if (id != model.Id)
                return BadRequest();

            ModelState.Remove("Products");

            if (!ModelState.IsValid)
                return View(model);

            bool isDuplicate = _context.CategoriesProducts
                .Any(c => c.Name.ToLower() == model.Name.ToLower() && c.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Name", "Tên danh mục này đã tồn tại");
                return View(model);
            }

            try
            {
                var category = _context.CategoriesProducts.Find(id);
                if (category == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy danh mục cần sửa.";
                    return RedirectToAction("Index");
                }

                category.Name = model.Name;
                category.Description = model.Description;

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật danh mục \"{model.Name}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                return View(model);
            }
        }

        // POST: /CategoryProduct/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var category = _context.CategoriesProducts
                    .Include(c => c.Products)
                    .FirstOrDefault(c => c.Id == id);

                if (category == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy danh mục cần xóa.";
                    return RedirectToAction("Index");
                }

                if (category.Products != null && category.Products.Any())
                {
                    TempData["ErrorMessage"] = $"Không thể xóa danh mục \"{category.Name}\" vì đang có {category.Products.Count} sản phẩm liên kết.";
                    return RedirectToAction("Index");
                }

                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa danh mục \"{category.Name}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi khi xóa. Vui lòng thử lại.";
            }

            return RedirectToAction("Index");
        }
    }
}

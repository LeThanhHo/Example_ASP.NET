/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop:CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này



namespace CMS.Backend.Controllers

{[Authorize]
    public class CategoryController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        // GET: /Category/Index

        public IActionResult Index()
        {
            var categories = _context.Categories.ToList();
            return View(categories);
        }

        // GET: /Category/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Category/Create
        [HttpPost]
        [ValidateAntiForgeryToken] // Bảo vệ chống tấn công CSRF
        public IActionResult Create([FromForm] Category model)
        {
            Console.WriteLine("=== DEBUG FORM DATA ===");
            foreach (var key in Request.Form.Keys)
            {
                Console.WriteLine($"{key} = {Request.Form[key]}");
            }
            Console.WriteLine("=== DEBUG MODELSTATE ===");
            foreach (var key in ModelState.Keys)
            {
                foreach (var error in ModelState[key].Errors)
                {
                    Console.WriteLine($"Field: {key} | Error: {error.ErrorMessage}");
                }
            }
            if (!ModelState.IsValid)
                return View(model);
            bool isDuplicate = _context.Categories
                .Any(c => c.Name.ToLower() == model.Name.ToLower());

            if (isDuplicate)
            {
                ModelState.AddModelError("Name", "Tên danh mục này đã tồn tại trong hệ thống");
                return View(model);
            }
            try
            {
                _context.Categories.Add(model);
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
        // GET: /Category/Edit/5
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy danh mục cần sửa.";
                return RedirectToAction("Index");
            }
            return View(category);
        }

        // POST: /Category/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Category model)
        {
            if (id != model.Id)
                return BadRequest();

            if (!ModelState.IsValid)
                return View(model);

            // Kiểm tra trùng tên (trừ chính nó)
            bool isDuplicate = _context.Categories
                .Any(c => c.Name.ToLower() == model.Name.ToLower() && c.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Name", "Tên danh mục này đã tồn tại trong hệ thống");
                return View(model);
            }

            try
            {
                var category = _context.Categories.Find(id);
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

        // POST: /Category/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var category = _context.Categories.Find(id);
                if (category == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy danh mục cần xóa.";
                    return RedirectToAction("Index");
                }

                _context.Categories.Remove(category);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa danh mục \"{category.Name}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Không thể xóa danh mục này vì đang có bài viết liên kết.";
            }

            return RedirectToAction("Index");
        }
    }
}

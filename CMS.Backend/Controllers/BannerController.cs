/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string? SaveImage(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            string ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(ext)) return null;

            string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

            string fileName = Guid.NewGuid().ToString() + ext;
            string filePath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return "/uploads/" + fileName;
        }

        private void DeleteOldImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;
            string oldPath = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot",
                imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            if (System.IO.File.Exists(oldPath))
                System.IO.File.Delete(oldPath);
        }

        // GET: /Banner/Index
        public IActionResult Index()
        {
            var banners = _context.Banners
                .OrderBy(b => b.DisplayOrder)
                .ToList();
            return View(banners);
        }

        // GET: /Banner/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Banner/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Banner model, IFormFile? uploadImage)
        {
            ModelState.Remove("ImageUrl"); // Sẽ được set từ upload

            if (uploadImage == null || uploadImage.Length == 0)
            {
                ModelState.AddModelError("uploadImage", "Vui lòng chọn ảnh banner");
            }

            if (!ModelState.IsValid)
                return View(model);

            string? savedPath = SaveImage(uploadImage);
            if (savedPath == null)
            {
                ModelState.AddModelError("uploadImage", "Chỉ chấp nhận ảnh .jpg .jpeg .png .gif .webp");
                return View(model);
            }

            try
            {
                model.ImageUrl = savedPath;
                model.CreatedDate = DateTime.Now;
                _context.Banners.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã thêm banner \"{model.Title}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                return View(model);
            }
        }

        // GET: /Banner/Edit/5
        public IActionResult Edit(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy banner cần sửa.";
                return RedirectToAction("Index");
            }
            return View(banner);
        }

        // POST: /Banner/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Banner model, IFormFile? uploadImage)
        {
            if (id != model.Id) return BadRequest();

            ModelState.Remove("ImageUrl");

            if (!ModelState.IsValid)
                return View(model);

            try
            {
                var banner = _context.Banners.Find(id);
                if (banner == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy banner cần sửa.";
                    return RedirectToAction("Index");
                }

                banner.Title = model.Title;
                banner.LinkUrl = model.LinkUrl;
                banner.DisplayOrder = model.DisplayOrder;
                banner.IsActive = model.IsActive;

                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string? savedPath = SaveImage(uploadImage);
                    if (savedPath == null)
                    {
                        ModelState.AddModelError("uploadImage", "Chỉ chấp nhận ảnh .jpg .jpeg .png .gif .webp");
                        return View(model);
                    }
                    DeleteOldImage(banner.ImageUrl);
                    banner.ImageUrl = savedPath;
                }

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật banner \"{model.Title}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                return View(model);
            }
        }

        // POST: /Banner/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var banner = _context.Banners.Find(id);
                if (banner == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy banner cần xóa.";
                    return RedirectToAction("Index");
                }

                DeleteOldImage(banner.ImageUrl);
                _context.Banners.Remove(banner);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa banner \"{banner.Title}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi khi xóa banner.";
            }
            return RedirectToAction("Index");
        }

        // POST: /Banner/ToggleActive/5 — Bật/tắt nhanh trạng thái hiển thị
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ToggleActive(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner != null)
            {
                banner.IsActive = !banner.IsActive;
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}

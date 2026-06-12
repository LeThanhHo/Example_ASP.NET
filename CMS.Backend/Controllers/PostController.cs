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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting; // Thêm namespace để quản lý thư mục vật lý
using Microsoft.AspNetCore.Http;    // Thêm namespace để dùng IFormFile nhận file ảnh
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment; // Khai báo dịch vụ quản lý thư mục wwwroot

        // Tiêm cả DbContext và WebHostEnvironment vào Controller
        public PostController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: /Post/Index
        public IActionResult Index(int? id)
        {
            var query = _context.Posts
                        .Include(p => p.Category)
                        .OrderByDescending(p => p.CreatedDate)
                        .AsQueryable();

            if (id != null)
                query = query.Where(p => p.CategoryId == id);

            var posts = query.ToList();
            return View(posts);
        }

        // GET: /Post/Details/5
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy bài viết.";
                return RedirectToAction("Index");
            }

            return View(post);
        }

        // GET: /Post/Create
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name");
            return View();
        }

        // POST: /Post/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model, IFormFile imageFile) // Bổ sung tham số imageFile để hứng tệp tin
        {
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl"); // Loại bỏ kiểm tra chuỗi URL trống trong validation

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name");
                return View(model);
            }

            try
            {
                // XỬ LÝ UPLOAD HÌNH ẢNH MỚI CHO BÀI VIẾT
                if (imageFile != null && imageFile.Length > 0)
                {
                    // Tạo thư mục lưu trữ: wwwroot/images/posts
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "images", "posts");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // Tránh trùng tên file ảnh bằng chuỗi ngẫu nhiên Guid
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    string filePath = Path.Combine(uploadDir, uniqueFileName);

                    // Lưu file xuống ổ đĩa
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(fileStream);
                    }

                    // Gán đường dẫn tương đối để lưu vào cơ sở dữ liệu SQL Server
                    model.ImageUrl = "/images/posts/" + uniqueFileName;
                }
                else
                {
                    // Ảnh mặc định cho cẩm nang/tin tức cơ khí nếu người dùng bỏ trống
                    model.ImageUrl = "/images/posts/default-blog.jpg";
                }

                model.CreatedDate = DateTime.Now;
                _context.Posts.Add(model);
                _context.SaveChanges();

                TempData["SuccessMessage"] = $"Đã thêm bài viết \"{model.Title}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name");
                return View(model);
            }
        }

        // GET: /Post/Edit/5
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy bài viết cần sửa.";
                return RedirectToAction("Index");
            }

            ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: /Post/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Post model, IFormFile imageFile) // Bổ sung tham số imageFile
        {
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (id != model.Id)
                return BadRequest();

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name", model.CategoryId);
                return View(model);
            }

            try
            {
                var post = _context.Posts.Find(id);
                if (post == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy bài viết cần sửa.";
                    return RedirectToAction("Index");
                }

                // XỬ LÝ CẬP NHẬT FILE HÌNH ẢNH MỚI (NẾU CÓ THAY ĐỔI)
                if (imageFile != null && imageFile.Length > 0)
                {
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "images", "posts");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // TỰ ĐỘNG XÓA FILE ẢNH CŨ TRÊN Ổ ĐĨA ĐỂ TRÁNH RÁC HỆ THỐNG
                    if (!string.IsNullOrEmpty(post.ImageUrl) && !post.ImageUrl.Contains("default-blog.jpg"))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, post.ImageUrl.TrimStart('/'));
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

                    post.ImageUrl = "/images/posts/" + uniqueFileName;
                }
                // Nếu không chọn file mới, giữ nguyên post.ImageUrl cũ từ Database

                post.Title = model.Title;
                post.Content = model.Content;
                post.CategoryId = model.CategoryId;

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật bài viết \"{model.Title}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
                ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name", model.CategoryId);
                return View(model);
            }
        }

        // POST: /Post/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var post = _context.Posts.Find(id);
                if (post == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy bài viết cần xóa.";
                    return RedirectToAction("Index");
                }

                // XÓA FILE ẢNH VẬT LÝ KHI BÀI VIẾT BỊ XÓA HẲN KHỎI SQL SERVER
                if (!string.IsNullOrEmpty(post.ImageUrl) && !post.ImageUrl.Contains("default-blog.jpg"))
                {
                    string filePath = Path.Combine(_webHostEnvironment.WebRootPath, post.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Posts.Remove(post);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa bài viết \"{post.Title}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi khi xóa bài viết. Vui lòng thử lại.";
            }

            return RedirectToAction("Index");
        }
    }
}
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
using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này



namespace CMS.Backend.Controllers
{[Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
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
            // Truyền danh sách Category cho dropdown
            ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name");
            return View();
        }

        // POST: /Post/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model)
        {
            ModelState.Remove("Category");

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(_context.Categories.ToList(), "Id", "Name");
                return View(model);
            }

            try
            {
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
        public IActionResult Edit(int id, Post model)
        {
            ModelState.Remove("Category");

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

                post.Title = model.Title;
                post.Content = model.Content;
                post.ImageUrl = model.ImageUrl;
                post.CategoryId = model.CategoryId;
                // Giữ nguyên CreatedDate, không cập nhật lại

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

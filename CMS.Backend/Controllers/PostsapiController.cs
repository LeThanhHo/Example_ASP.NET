/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>Quản lý bài viết</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PostsController(ApplicationDbContext context) => _context = context;

        /// <summary>Lấy tất cả bài viết</summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name,
                    p.CategoryId
                })
                .ToList();
            return Ok(posts);
        }

        /// <summary>Lấy bài viết theo ID</summary>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var post = _context.Posts
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefault();

            if (post == null)
                return NotFound(new { message = $"Không tìm thấy bài viết ID={id}" });

            return Ok(post);
        }

        /// <summary>Lấy bài viết theo danh mục</summary>
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }

        /// <summary>Thêm bài viết mới</summary>
        [HttpPost]
        public IActionResult Create([FromBody] Post model)
        {
            ModelState.Remove("Category");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool categoryExists = _context.Categories.Any(c => c.Id == model.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = "Danh mục không tồn tại" });

            model.CreatedDate = DateTime.Now;
            _context.Posts.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, new
            {
                model.Id,
                model.Title,
                model.CreatedDate
            });
        }

        /// <summary>Cập nhật bài viết</summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Post model)
        {
            ModelState.Remove("Category");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var post = _context.Posts.Find(id);
            if (post == null)
                return NotFound(new { message = $"Không tìm thấy bài viết ID={id}" });

            post.Title = model.Title;
            post.Content = model.Content;
            post.ImageUrl = model.ImageUrl;
            post.CategoryId = model.CategoryId;
            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công", post.Id, post.Title });
        }

        /// <summary>Xóa bài viết</summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
                return NotFound(new { message = $"Không tìm thấy bài viết ID={id}" });

            _context.Posts.Remove(post);
            _context.SaveChanges();
            return Ok(new { message = $"Đã xóa bài viết \"{post.Title}\"" });
        }
    }
}

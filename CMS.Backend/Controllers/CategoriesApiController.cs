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
    /// <summary>Quản lý danh mục bài viết</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CategoriesController(ApplicationDbContext context) => _context = context;

        /// <summary>Lấy tất cả danh mục bài viết</summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.Categories
                .OrderBy(c => c.Name)
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    PostCount = c.Posts.Count()
                })
                .ToList();
            return Ok(categories);
        }

        /// <summary>Lấy danh mục theo ID</summary>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    PostCount = c.Posts.Count()
                })
                .FirstOrDefault();

            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục ID={id}" });

            return Ok(category);
        }

        /// <summary>Thêm danh mục mới</summary>
        [HttpPost]
        public IActionResult Create([FromBody] Category model)
        {
            ModelState.Remove("Posts");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool isDuplicate = _context.Categories
                .Any(c => c.Name.ToLower() == model.Name.ToLower());
            if (isDuplicate)
                return Conflict(new { message = "Tên danh mục đã tồn tại" });

            _context.Categories.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, new
            {
                model.Id,
                model.Name,
                model.Description
            });
        }

        /// <summary>Cập nhật danh mục</summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Category model)
        {
            ModelState.Remove("Posts");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = _context.Categories.Find(id);
            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục ID={id}" });

            bool isDuplicate = _context.Categories
                .Any(c => c.Name.ToLower() == model.Name.ToLower() && c.Id != id);
            if (isDuplicate)
                return Conflict(new { message = "Tên danh mục đã tồn tại" });

            category.Name = model.Name;
            category.Description = model.Description;
            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công", category.Id, category.Name });
        }

        /// <summary>Xóa danh mục</summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories
                .Include(c => c.Posts)
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục ID={id}" });

            if (category.Posts != null && category.Posts.Any())
                return BadRequest(new { message = $"Không thể xóa, đang có {category.Posts.Count} bài viết liên kết" });

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return Ok(new { message = $"Đã xóa danh mục \"{category.Name}\"" });
        }
    }
}

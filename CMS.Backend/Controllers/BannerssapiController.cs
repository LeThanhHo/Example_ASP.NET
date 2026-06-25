/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>Quản lý banner trang chủ (frontend lấy dữ liệu qua đây)</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BannersController(ApplicationDbContext context) => _context = context;

        /// <summary>
        /// Lấy danh sách banner đang hiển thị (IsActive = true), sắp xếp theo thứ tự.
        /// Dùng API này cho slider/carousel ở trang chủ frontend.
        /// </summary>
        [HttpGet("active")]
        public IActionResult GetActiveBanners()
        {
            var banners = _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.ImageUrl,
                    b.LinkUrl,
                    b.DisplayOrder
                })
                .ToList();

            return Ok(banners);
        }

        /// <summary>Lấy tất cả banner (kể cả đang ẩn) — dùng cho trang quản trị</summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var banners = _context.Banners
                .OrderBy(b => b.DisplayOrder)
                .ToList();
            return Ok(banners);
        }

        /// <summary>Lấy banner theo ID</summary>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound(new { message = $"Không tìm thấy banner ID={id}" });
            return Ok(banner);
        }

        /// <summary>Thêm banner mới (gửi ImageUrl đã upload từ trước, không kèm file)</summary>
        [HttpPost]
        public IActionResult Create([FromBody] Banner model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.CreatedDate = DateTime.Now;
            _context.Banners.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        /// <summary>Cập nhật banner</summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Banner model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound(new { message = $"Không tìm thấy banner ID={id}" });

            banner.Title = model.Title;
            banner.LinkUrl = model.LinkUrl;
            banner.ImageUrl = model.ImageUrl;
            banner.DisplayOrder = model.DisplayOrder;
            banner.IsActive = model.IsActive;

            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công", banner.Id, banner.Title });
        }

        /// <summary>Bật/tắt hiển thị banner</summary>
        [HttpPatch("{id}/toggle-active")]
        public IActionResult ToggleActive(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound(new { message = $"Không tìm thấy banner ID={id}" });

            banner.IsActive = !banner.IsActive;
            _context.SaveChanges();
            return Ok(new { message = "Đã cập nhật trạng thái", banner.Id, banner.IsActive });
        }

        /// <summary>Xóa banner</summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound(new { message = $"Không tìm thấy banner ID={id}" });

            _context.Banners.Remove(banner);
            _context.SaveChanges();
            return Ok(new { message = $"Đã xóa banner \"{banner.Title}\"" });
        }
    }
}

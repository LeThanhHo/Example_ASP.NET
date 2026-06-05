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
    /// <summary>Quản lý sản phẩm</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProductsController(ApplicationDbContext context) => _context = context;

        /// <summary>Lấy tất cả sản phẩm</summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderBy(p => p.Name)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToList();
            return Ok(products);
        }

        /// <summary>Lấy sản phẩm theo ID</summary>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .FirstOrDefault();

            if (product == null)
                return NotFound(new { message = $"Không tìm thấy sản phẩm ID={id}" });

            return Ok(product);
        }

        /// <summary>Lấy sản phẩm theo danh mục</summary>
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .OrderBy(p => p.Name)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToList();
            return Ok(products);
        }

        /// <summary>Thêm sản phẩm mới</summary>
        [HttpPost]
        public IActionResult Create([FromBody] Product model)
        {
            ModelState.Remove("CategoryProduct");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool categoryExists = _context.CategoriesProducts
                .Any(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
                return BadRequest(new { message = "Danh mục sản phẩm không tồn tại" });

            _context.Products.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, new
            {
                model.Id,
                model.Name,
                model.Price
            });
        }

        /// <summary>Cập nhật sản phẩm</summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product model)
        {
            ModelState.Remove("CategoryProduct");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound(new { message = $"Không tìm thấy sản phẩm ID={id}" });

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.ImageUrl = model.ImageUrl;
            product.CategoryProductId = model.CategoryProductId;
            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công", product.Id, product.Name });
        }

        /// <summary>Xóa sản phẩm</summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound(new { message = $"Không tìm thấy sản phẩm ID={id}" });

            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok(new { message = $"Đã xóa sản phẩm \"{product.Name}\"" });
        }
    }
}

using CMS.Data;
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

        // Liệt kê danh sách
        public async Task<IActionResult> Index()
        {
            var CategoryProduct = await _context.CategoriesProducts.ToListAsync();

            return View(CategoryProduct);
        }
    }
}
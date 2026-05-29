using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int? id)
        {
            // Query gốc
            var query = _context.Posts
                        .Include(p => p.Category)
                        .OrderByDescending(p => p.CreatedDate)
                        .AsQueryable();

            // Nếu có id thì mới lọc
            if (id != null)
            {
                query = query.Where(p => p.CategoryId == id);
            }

            var posts = query.ToList();

            return View(posts);
        }
        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // Lấy bài viết + Category
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // Không tìm thấy
            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }
    }
}
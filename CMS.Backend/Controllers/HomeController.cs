using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
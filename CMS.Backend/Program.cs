/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000") // Cổng của ReactJS
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddHttpClient();
var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{
    // --- THÊM 2 DÒNG NÀY ĐỂ HIỂN THỊ GIAO DIỆN SWAGGER ---
    app.UseSwagger();
    app.UseSwaggerUI();
    // ----------------------------------------------------
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthentication(); // ← Phải có và phải đứng TRƯỚC UseAuthorization
app.UseAuthorization();

// 💡 ĐÃ BỔ SUNG: Kích hoạt bản đồ ánh xạ cho các API Controller (ChatApiController)
app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}"); // Mặc định vào trang Login

app.Run();
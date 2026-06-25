/*
 Ten: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [StringLength(150)]
        public string Title { get; set; }

        // Link điều hướng khi click vào banner (vd: /san-pham/abc)
        public string? LinkUrl { get; set; }

        // Đường dẫn ảnh banner (lưu sau khi upload vào wwwroot/uploads)
        [Required(ErrorMessage = "Vui lòng chọn ảnh banner")]
        public string ImageUrl { get; set; }

        // Thứ tự hiển thị - số nhỏ hiển thị trước
        public int DisplayOrder { get; set; } = 0;

        // Bật/tắt hiển thị banner trên frontend
        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

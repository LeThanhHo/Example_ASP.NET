import React, { useState, useEffect } from 'react';
import blogService from '../../services/postService';
// IMPORT component CON VÀO ĐỂ SỬ DỤNG
import PostCard from '../../components/PostCard';

function LatestBlog() { // chỉ lấy 3 bài viết mới nhất
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();

                // Mẹo xử lý đồ án: Kiểm tra và ép mảng an toàn đề phòng cấu hình bọc mảng ($values) từ ASP.NET Core
                const dataArray = Array.isArray(data) ? data : (data?.$values || data?.data || []);

                // Sắp xếp bài viết mới nhất lên đầu dựa theo ID và chỉ lấy đúng 3 bài để hiển thị ở Trang Chủ
                const topThreePosts = dataArray.sort((a, b) => b.id - a.id).slice(0, 3);
                setPosts(topThreePosts);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải cẩm nang kỹ thuật cơ khí:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);

    // Giao diện chờ load dữ liệu mạng chuẩn ngành máy móc dụng cụ
    if (loading) {
        return (
            <div className="container my-4 text-center">
                <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp cẩm nang hướng dẫn kỹ thuật...</span>
            </div>
        );
    }

    return (
        <section className="latest-blog-section py-5" style={{ backgroundColor: '#f8fafc' }}>
            <div className="container">

                {/* TIÊU ĐỀ PHÂN KHU BÀI VIẾT / KINH NGHIỆM ĐIỆN CƠ CHUYÊN NGHIỆP */}
                <div className="section-heading mb-4 text-center">
                    <h3 className="font-weight-bold text-uppercase" style={{ color: '#0D2C54' }}>
                        <i className="fas fa-book-reader mr-2 text-warning"></i> Cẩm Nang Kỹ Thuật & Sửa Chữa
                    </h3>
                    <p className="text-muted lead" style={{ fontSize: '15px' }}>
                        Chia sẻ mẹo vận hành máy an toàn, cách chọn mũi khoan, lưỡi cắt và bảo dưỡng thiết bị cùng LeThanhHo.Tools
                    </p>
                    <div className="mx-auto" style={{ width: '60px', height: '3px', backgroundColor: '#FF6B35' }}></div>
                </div>

                {/* KHUNG LƯỚI ĐỒNG BỘ COMPONENT CON (POSTCARD) */}
                <div className="row mt-5">
                    {posts.length === 0 ? (
                        <div className="col-12 text-center text-muted py-4">
                            <i className="far fa-newspaper d-block mb-2" style={{ fontSize: '28px' }}></i>
                            Chưa có bài viết hướng dẫn kỹ thuật nào trong cơ sở dữ liệu.
                        </div>
                    ) : (
                        posts.map((item) => (
                            <div className="col-lg-4 col-md-6 col-12 mb-4" key={item.id || item.postId}>
                                {/* CHÈN COMPONENT CON VÀ TRUYỀN DỮ LIỆU QUA PROP post */}
                                <PostCard post={item} />
                            </div>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
}

export default LatestBlog;
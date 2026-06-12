import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';

function PostDetail() {
    // 1. Lấy ID động từ thanh URL (Ví dụ: /blog/4 -> id = 4)
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7116";

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostById(id);

                // Mẹo ép dữ liệu an toàn đề phòng ASP.NET Core trả về Object bọc mảng ($values)
                const cleanData = data?.$values ? data.$values[0] : data;
                setPost(cleanData);
            } catch (error) {
                console.error("Không thể truy xuất nội dung bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPostDetail();
    }, [id]);

    // Hàm bổ trợ định dạng ngày tháng hiển thị trực quan (dd/MM/yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container my-5 text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp nội dung cẩm nang kỹ thuật...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5 text-center py-5">
                <div className="alert alert-danger">Bài viết không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống quản trị.</div>
                <Link to="/" className="btn btn-dark mt-2">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="container my-5" style={{ maxWidth: '800px' }}>

            {/* Thanh điều hướng Breadcrumb nhỏ */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb bg-transparent p-0 small">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none text-muted">Cẩm nang kỹ thuật</Link></li>
                    <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">Chi tiết bài viết</li>
                </ol>
            </nav>

            {/* KHỐI NỘI DUNG CHÍNH CỦA BÀI VIẾT */}
            <article className="blog-post-detail">

                {/* 1. Tên chuyên mục nhỏ phân loại */}
                <span className="badge text-uppercase font-weight-bold px-2 py-1 mb-2 text-white"
                    style={{ backgroundColor: '#FF6B35', fontSize: '11px' }}>
                    <i className="fas fa-tags mr-1"></i> {post.category?.name || post.categoryName || "Kinh nghiệm cơ khí"}
                </span>

                {/* 2. Tiêu đề lớn của bài viết */}
                <h1 className="font-weight-bold mb-3" style={{ color: '#0D2C54', fontSize: '2.2rem', lineHeight: '1.3' }}>
                    {post.title}
                </h1>

                {/* 3. Thanh thông tin tác giả, ngày đăng bài */}
                <div className="post-meta d-flex text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '13px' }}>
                    <span className="mr-3">
                        <i className="far fa-calendar-alt text-warning mr-1"></i> Đăng ngày: {formatDate(post.createdDate)}
                    </span>
                    <span>
                        <i className="far fa-user text-warning mr-1"></i> Biên tập: Ban kỹ thuật LeThanhHo
                    </span>
                </div>

                {/* 4. Hình ảnh đại diện bài viết lấy từ wwwroot */}
                <div className="post-thumbnail-wrapper mb-4 rounded overflow-hidden shadow-sm" style={{ maxHeight: '400px' }}>
                    <img
                        src={post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${IMAGE_BASE_URL}${post.imageUrl}`) : "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"}
                        alt={post.title}
                        className="img-fluid w-100"
                        style={{ objectFit: 'cover', height: '100%', maxHeight: '400px' }}
                    />
                </div>

                {/* 5. Nội dung chi tiết của bài viết */}
                {/* Sử dụng style whiteSpace: 'pre-line' để tự động xuống dòng đẹp mắt theo đúng dữ liệu nhập từ C# */}
                <div className="post-content text-dark text-justify"
                    style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-line', color: '#212529' }}>
                    {post.content}
                </div>

            </article>

            {/* Khối phản hồi / Quay lại cuối bài */}
            <div className="mt-5 pt-4 border-top text-center">
                <Link to="/" className="btn btn-outline-secondary px-4 font-weight-bold" style={{ borderRadius: '4px' }}>
                    <i className="fas fa-arrow-left mr-2"></i> QUAY LẠI TRANG CHỦ
                </Link>
            </div>

        </div>
    );
}

export default PostDetail;
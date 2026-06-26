// src/components/PostCard.jsx
// Name: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7116";

function PostCard({ post }) {
    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'; // Ảnh dự phòng thiết bị cơ khí cao cấp
        if (url.startsWith('http')) return url;
        return `${IMAGE_BASE_URL}${url}`;
    };

    // 💡 HÀM HELPER THÔNG MINH: Giải quyết dứt điểm lỗi không lấy được trường content thực tế
    const renderDescription = () => {
        // 1. Kiểm tra xem có trường summary thực tế từ database không
        if (post.summary && post.summary.trim() !== "") {
            return post.summary.length > 100 ? `${post.summary.substring(0, 100)}...` : post.summary;
        }

        // 2. Nếu không có summary, lội vào bốc trực tiếp trường content thực tế từ API
        if (post.content && post.content.trim() !== "") {
            // Khử sạch các thẻ HTML (<p>, <strong>,...) đề phòng Admin nhập bằng CKEditor để tránh lỗi layout
            const cleanText = post.content.replace(/<\/?[^>]+(>|$)/g, "");
            return cleanText.length > 100 ? `${cleanText.substring(0, 100)}...` : cleanText;
        }

        // 3. Dự phòng cuối cùng nếu cả hai trường dữ liệu trên DB đều trống hoàn toàn
        return 'Bài viết cẩm nang kỹ thuật cơ khí này hiện đang được cập nhật nội dung chi tiết.';
    };

    return (
        <>
            <div className="card h-100 border-0 custom-blog-card">
                {/* 1. Hình ảnh đại diện (Thumbnail) với hiệu ứng Zoom CSS */}
                <div className="blog-image-overlay position-relative">
                    <img
                        src={getImageUrl(post.imageUrl)}
                        className="w-100 h-100 img-fluid"
                        alt={post.title}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="card-badge-category">Kỹ thuật</div>
                </div>

                {/* 2. Phần nội dung văn bản */}
                <div className="card-body p-4 d-flex flex-column">
                    {/* Ngày phát hành bài đăng */}
                    <div className="d-flex align-items-center mb-2.5 text-muted small-text">
                        <i className="far fa-calendar-alt mr-1.5 text-primary"></i>
                        <span>{post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}</span>
                    </div>

                    {/* Tiêu đề bài viết */}
                    <h5 className="card-title-link mb-2">
                        <Link to={`/blog/${post.id}`} className="text-decoration-none">
                            {post.title}
                        </Link>
                    </h5>

                    {/* 💡 ĐÃ CẬP NHẬT: Gọi hàm Helper để kéo dữ liệu thật */}
                    <p className="card-description mb-4 text-secondary text-justify">
                        {renderDescription()}
                    </p>

                    {/* Nút hành động neo sát đáy Card */}
                    <div className="mt-auto pt-3 border-top border-light-subtle">
                        <Link to={`/blog/${post.id}`} className="action-read-more d-inline-flex align-items-center text-decoration-none">
                            <span>Chi tiết bài viết</span>
                            <i className="fas fa-arrow-right ml-2 arrow-move"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Khối Style scoped bọc an toàn thẩm mỹ */}
            <style>{`
                .custom-blog-card {
                    border-radius: 12px;
                    overflow: hidden;
                    background-color: #ffffff;
                    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
                    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease;
                }
                .custom-blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
                }
                .blog-image-overlay {
                    height: 210px;
                    overflow: hidden;
                }
                .blog-image-overlay img {
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .custom-blog-card:hover .blog-image-overlay img {
                    transform: scale(1.06);
                }
                .card-badge-category {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background-color: #0D2C54;
                    color: #ffffff;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-uppercase: true;
                }
                .small-text {
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }
                .mr-1\\.5 { margin-right: 6px !important; }
                .card-title-link {
                    font-size: 17px;
                    font-weight: 700;
                    line-height: 1.4;
                    min-height: 48px;
                }
                .card-title-link a {
                    color: #0F172A;
                    transition: color 0.2s ease;
                }
                .custom-blog-card:hover .card-title-link a {
                    color: #FF6B35;
                }
                .card-description {
                    font-size: 13.5px;
                    line-height: 1.6;
                    color: #64748B !important;
                }
                .action-read-more {
                    color: #FF6B35;
                    font-size: 13.5px;
                    font-weight: 700;
                }
                .arrow-move {
                    transition: transform 0.2s ease;
                }
                .action-read-more:hover .arrow-move {
                    transform: translateX(4px);
                }
            `}</style>
        </>
    );
}

export default PostCard;
// src/pages/home/LatestBlog.jsx
// Name: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState, useEffect } from 'react';
import blogService from '../../services/postService';
import PostCard from '../../components/PostCard';

function LatestBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();

                // Quét lọc mảng an toàn từ hệ thống bọc tuần tự hóa C# EF Core
                const dataArray = Array.isArray(data) ? data : (data?.$values || data?.data || []);

                // Sắp xếp ID giảm dần (Bài mới nhất lên trước) và bốc đúng 3 hàng dữ liệu sạch
                const topThreePosts = [...dataArray].sort((a, b) => b.id - a.id).slice(0, 3);
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

    // Giao diện nạp luồng dữ liệu thông minh (Tránh giật khung khi render)
    if (loading) {
        return (
            <div className="container my-5 py-4 text-center">
                <div className="spinner-loading-pulse mb-2 mx-auto"></div>
                <small className="text-muted font-weight-medium">Đang kiểm tra dữ liệu cẩm nang kỹ thuật...</small>
            </div>
        );
    }

    return (
        <section className="latest-blog-section py-5" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="container py-3">

                {/* HEADER PHÂN KHU BÀI VIẾT HIỆN ĐẠI TỐI GIẢN */}
                <div className="row align-items-end mb-5">
                    <div className="col-lg-8 col-12 text-left">
                        <span className="text-uppercase font-weight-bold text-primary small-text-heading" style={{ color: '#FF6B35', letterSpacing: '1px' }}>
                            <i className="fas fa-wrench mr-2"></i>Kinh nghiệm điện cơ
                        </span>
                        <h3 className="font-weight-black text-dark mt-1 mb-2 mb-lg-0" style={{ color: '#0D2C54', fontWeight: 800, letterSpacing: '-0.5px' }}>
                            CẨM NĂNG KỸ THUẬT NỔI BẬT
                        </h3>
                    </div>
                    <div className="col-lg-4 col-12 text-lg-right text-left mt-2 mt-lg-0">
                        <p className="text-muted small m-0" style={{ fontSize: '13.5px' }}>
                      
                        </p>
                    </div>
                </div>

                {/* KHUNG LƯỚI ĐỒNG BỘ HIỂN THỊ 3 BÀI VIẾT */}
                <div className="row">
                    {posts.length === 0 ? (
                        <div className="col-12 text-center py-5 bg-white rounded border border-dashed text-muted">
                            <i className="far fa-newspaper d-block mb-2.5" style={{ fontSize: '32px', color: '#CBD5E1' }}></i>
                            <span className="small">Hệ thống chưa ghi nhận bài viết kỹ thuật nào trên Database.</span>
                        </div>
                    ) : (
                        posts.map((item) => (
                            <div className="col-lg-4 col-md-6 col-12 mb-4" key={item.id || item.postId}>
                                <PostCard post={item} />
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* Thêm style bổ trợ cho hiệu ứng loading mượt của trang chủ */}
            <style>{`
                .font-weight-black { font-weight: 800 !important; }
                .small-text-heading { font-size: 11.5px; font-weight: 700; }
                .spinner-loading-pulse {
                    width: 28px;
                    height: 28px;
                    background-color: #FF6B35;
                    border-radius: 50%;
                    animation: pulseEffect 1.2s infinite ease-in-out;
                }
                @keyframes pulseEffect {
                    0% { transform: scale(0.6); opacity: 0.8; }
                    50% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(0.6); opacity: 0.8; }
                }
                .border-dashed { border-style: dashed !important; border-width: 1.5px !important; }
            `}</style>
        </section>
    );
}

export default LatestBlog;
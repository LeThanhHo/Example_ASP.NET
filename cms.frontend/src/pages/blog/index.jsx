// src/pages/BlogPage.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    getAllPosts,
    getAllPostCategories,
    API_BASE_URL
} from '../../services/postService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ACCENT = '#FF6B35';
const NAVY = '#0D2C54';

function resolveImage(url) {
    if (!url) return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=60';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsData, categoriesData] = await Promise.all([
                    getAllPosts(),
                    getAllPostCategories()
                ]);
                setPosts(postsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPosts = useMemo(() => {
        if (activeCategory === 'all') return posts;
        return posts.filter(p => p.categoryId === Number(activeCategory));
    }, [posts, activeCategory]);

    const [featured, ...rest] = filteredPosts;

    return (
        <div className="blog-page" style={{ backgroundColor: '#F7F8FA', minHeight: '70vh' }}>

            <Header />
            <div className="py-5 mb-4" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1A4B83 100%)`, color: '#fff' }}>
                <div className="container">
                    <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-2"
                        style={{ backgroundColor: ACCENT, fontSize: '11px', letterSpacing: '1px' }}>
                        <i className="fas fa-newspaper mr-1"></i> Kiến thức & Tin tức
                    </span>
                    <h1 className="font-weight-bold mb-1" style={{ fontSize: '2rem' }}>Tin Tức / Blog</h1>
                    <p className="mb-0" style={{ color: '#e0e6ed', opacity: 0.9 }}>
                        Hướng dẫn sử dụng, mẹo bảo trì dụng cụ và tin khuyến mãi mới nhất.
                    </p>
                </div>
            </div>

            <div className="container pb-5">

                {/* Bộ lọc danh mục dạng tab */}
                <div className="d-flex flex-wrap mb-4" style={{ gap: '8px' }}>
                    <button
                        className="btn btn-sm font-weight-bold px-3"
                        onClick={() => setActiveCategory('all')}
                        style={{
                            backgroundColor: activeCategory === 'all' ? ACCENT : '#fff',
                            color: activeCategory === 'all' ? '#fff' : NAVY,
                            border: `1px solid ${activeCategory === 'all' ? ACCENT : '#dee2e6'}`,
                            borderRadius: '20px'
                        }}>
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className="btn btn-sm font-weight-bold px-3"
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                backgroundColor: activeCategory === cat.id ? ACCENT : '#fff',
                                color: activeCategory === cat.id ? '#fff' : NAVY,
                                border: `1px solid ${activeCategory === cat.id ? ACCENT : '#dee2e6'}`,
                                borderRadius: '20px'
                            }}>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: ACCENT }} role="status" />
                        <p className="text-muted mt-2">Đang tải bài viết...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Không thể tải dữ liệu bài viết. Vui lòng kiểm tra kết nối API.
                    </div>
                )}

                {!loading && !error && filteredPosts.length === 0 && (
                    <div className="text-center py-5">
                        <i className="fas fa-file-alt text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3">Chưa có bài viết nào trong danh mục này.</p>
                    </div>
                )}

                {!loading && !error && filteredPosts.length > 0 && (
                    <div className="row">

                        {/* Bài viết nổi bật (mới nhất) */}
                        {featured && (
                            <div className="col-lg-7 mb-4">
                                <Link to={`/blog/${featured.id}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ height: '320px', overflow: 'hidden' }}>
                                            <img src={resolveImage(featured.imageUrl)} alt={featured.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="card-body">
                                            <span className="badge mb-2" style={{ backgroundColor: ACCENT, color: '#fff' }}>
                                                {featured.categoryName}
                                            </span>
                                            <h3 className="font-weight-bold" style={{ color: NAVY }}>
                                                {featured.title}
                                            </h3>
                                            <span className="text-muted small">
                                                <i className="far fa-calendar mr-1"></i> {formatDate(featured.createdDate)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Danh sách bài viết còn lại */}
                        <div className="col-lg-5">
                            <div className="d-flex flex-column" style={{ gap: '16px' }}>
                                {rest.slice(0, 4).map(post => (
                                    <Link to={`/blog/${post.id}`} key={post.id} className="text-decoration-none">
                                        <div className="card border-0 shadow-sm flex-row" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                            <div style={{ width: '120px', minWidth: '120px', height: '90px', overflow: 'hidden' }}>
                                                <img src={resolveImage(post.imageUrl)} alt={post.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div className="card-body py-2 px-3">
                                                <span className="text-uppercase small" style={{ color: ACCENT, fontSize: '10px', fontWeight: 700 }}>
                                                    {post.categoryName}
                                                </span>
                                                <h6 className="font-weight-bold mb-1" style={{ color: NAVY, fontSize: '14px' }}>
                                                    {post.title.length > 60 ? post.title.slice(0, 60) + '...' : post.title}
                                                </h6>
                                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                                    {formatDate(post.createdDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Phần còn lại dạng lưới */}
                        {rest.length > 4 && (
                            <div className="col-12 mt-4">
                                <h5 className="font-weight-bold mb-3" style={{ color: NAVY }}>Bài viết khác</h5>
                                <div className="row">
                                    {rest.slice(4).map(post => (
                                        <div className="col-md-4 mb-4" key={post.id}>
                                            <Link to={`/blog/${post.id}`} className="text-decoration-none">
                                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                                    <div style={{ height: '160px', overflow: 'hidden' }}>
                                                        <img src={resolveImage(post.imageUrl)} alt={post.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div className="card-body">
                                                        <span className="badge mb-2" style={{ backgroundColor: '#f1f3f5', color: NAVY }}>
                                                            {post.categoryName}
                                                        </span>
                                                        <h6 className="font-weight-bold" style={{ color: NAVY }}>
                                                            {post.title}
                                                        </h6>
                                                        <span className="text-muted small">{formatDate(post.createdDate)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default BlogPage;

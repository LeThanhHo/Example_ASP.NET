// src/pages/ShopPage.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    getAllProducts,
    getAllProductCategories,
    getProductsByPrice,
    API_BASE_URL
} from '../../services/productService';
// 💡 BỔ SUNG: Import cartService để dùng hàm addToCart xử lý lưu LocalStorage
import cartService from '../../services/cartService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ACCENT = '#FF6B35';
const NAVY = '#0D2C54';

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}

function resolveImage(url) {
    if (!url) return 'https://images.unsplash.com/photo-1581147036324-c1cc3f9bcae0?w=400&auto=format&fit=crop&q=60';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
}

function ShopPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Các bộ lọc trạng thái cố định
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('default'); // default | asc | desc
    const [searchTerm, setSearchTerm] = useState('');

    // Khoảng giá tiền (Min - Max)
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [appliedPriceRange, setAppliedPriceRange] = useState({ min: null, max: null });

    // Tải dữ liệu ban đầu từ API Backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                const [productsData, categoriesData] = await Promise.all([
                    getAllProducts(),
                    getAllProductCategories()
                ]);

                setProducts(Array.isArray(productsData) ? productsData : (productsData?.$values || []));
                setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.$values || []));
            } catch (err) {
                console.error("Lỗi kết nối Front-End với API C#:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 🔄 THUẬT TOÁN KẾT HỢP: Gom tất cả các phương thức tìm kiếm hoạt động song song
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // 1. Lọc cố định theo Danh mục
        if (activeCategory !== 'all') {
            result = result.filter(p => p.categoryProductId === Number(activeCategory));
        }

        // 2. Lọc cố định theo Từ khóa
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(term));
        }

        // 3. Lọc cố định theo Khoảng giá
        if (appliedPriceRange.min !== null) {
            result = result.filter(p => p.price >= appliedPriceRange.min);
        }
        if (appliedPriceRange.max !== null) {
            result = result.filter(p => p.price <= appliedPriceRange.max);
        }

        // 4. Sắp xếp thứ tự
        if (sortOrder === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, activeCategory, sortOrder, searchTerm, appliedPriceRange]);

    const handleFilterPriceSubmit = (e) => {
        e.preventDefault();
        setAppliedPriceRange({
            min: minPrice.trim() !== '' ? Number(minPrice) : null,
            max: maxPrice.trim() !== '' ? Number(maxPrice) : null
        });
    };

    const handleResetPrice = () => {
        setMinPrice('');
        setMaxPrice('');
        setAppliedPriceRange({ min: null, max: null });
    };

    return (
        <div className="shop-page" style={{ backgroundColor: '#F7F8FA', minHeight: '100vh' }}>
            <Header />

            {/* Banner Khối đầu trang */}
            <div className="py-5 mb-4" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1A4B83 100%)`, color: '#fff' }}>
                <div className="container">
                    <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-2"
                        style={{ backgroundColor: ACCENT, fontSize: '11px', letterSpacing: '1px' }}>
                        <i className="fas fa-tools mr-1"></i> Dụng cụ chính hãng
                    </span>
                    <h1 className="font-weight-bold mb-1" style={{ fontSize: '2rem' }}>Cửa Hàng Thiết Bị</h1>
                    <p className="mb-0" style={{ color: '#e0e6ed', opacity: 0.9 }}>
                        Máy khoan, máy cắt, mài và phụ kiện cầm tay — bảo hành chính hãng từ 6 đến 12 tháng tại Thủ Đức.
                    </p>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row">

                    {/* SIDEBAR BỘ LỌC CỐ ĐỊNH KHI CUỘN CHUỘT */}
                    <div className="col-lg-3 mb-4">
                        <div className="sticky-top" style={{ top: '90px', zIndex: 10 }}>

                            {/* 1. Ô Tìm kiếm tên */}
                            <div className="bg-white rounded shadow-sm p-3 mb-3 border">
                                <h6 className="font-weight-bold mb-3" style={{ color: NAVY }}>
                                    <i className="fas fa-search mr-1"></i> Tìm kiếm sản phẩm
                                </h6>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Nhập từ khóa tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* 2. Bộ lọc khoảng giá tiền */}
                            <div className="bg-white rounded shadow-sm p-3 mb-3 border">
                                <h6 className="font-weight-bold mb-3" style={{ color: NAVY }}>
                                    <i className="fas fa-money-bill-wave mr-1"></i> Khoảng giá bán (₫)
                                </h6>
                                <form onSubmit={handleFilterPriceSubmit}>
                                    <div className="mb-2">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Giá tối thiểu (Từ)"
                                            min="0"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Giá tối đa (Đến)"
                                            min="0"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-sm text-white font-weight-bold flex-grow-1"
                                            style={{ backgroundColor: ACCENT, border: 'none' }}>
                                            Lọc giá máy
                                        </button>
                                        {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleResetPrice}>
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* 3. Khối Danh mục vật tư */}
                            <div className="bg-white rounded shadow-sm p-3 mb-3 border">
                                <h6 className="font-weight-bold mb-3" style={{ color: NAVY }}>
                                    <i className="fas fa-list mr-1"></i> Danh mục thiết bị
                                </h6>
                                <div className="d-flex flex-column" style={{ gap: '4px' }}>
                                    <button
                                        className="btn btn-sm text-left font-weight-bold"
                                        onClick={() => setActiveCategory('all')}
                                        style={{
                                            backgroundColor: activeCategory === 'all' ? ACCENT : 'transparent',
                                            color: activeCategory === 'all' ? '#fff' : '#333',
                                            border: 'none', borderRadius: '4px', padding: '8px 12px'
                                        }}>
                                        Tất cả sản phẩm
                                    </button>
                                    {categories.map(cat => {
                                        const catId = cat.id || cat.categoryProductId;
                                        return (
                                            <button
                                                key={catId}
                                                className="btn btn-sm text-left d-flex justify-content-between align-items-center"
                                                onClick={() => setActiveCategory(catId)}
                                                style={{
                                                    backgroundColor: activeCategory === catId ? ACCENT : 'transparent',
                                                    color: activeCategory === catId ? '#fff' : '#333',
                                                    border: 'none', borderRadius: '4px', padding: '8px 12px'
                                                }}>
                                                <span>{cat.name}</span>
                                                <span className={`badge ${activeCategory === catId ? 'badge-light text-dark' : 'badge-secondary'}`}>
                                                    {cat.productCount ?? 0}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. Khối Sắp xếp */}
                            <div className="bg-white rounded shadow-sm p-3 border">
                                <h6 className="font-weight-bold mb-3" style={{ color: NAVY }}>
                                    <i className="fas fa-sort mr-1"></i> Sắp xếp theo giá
                                </h6>
                                <select className="form-control form-control-sm"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="default">Mặc định hệ thống</option>
                                    <option value="asc">Giá tăng dần (Thấp → Cao)</option>
                                    <option value="desc">Giá giảm dần (Cao → Thấp)</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* LƯỚI GRID HIỂN THỊ DANH SÁCH SẢN PHẨM */}
                    <div className="col-lg-9">
                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-warning" role="status" />
                                <p className="text-muted mt-2">Đang truy xuất dữ liệu kho hàng cơ khí...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="alert alert-warning">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                Không thể kết nối với máy chủ API. Vui lòng kiểm tra lại dự án IIS Express Backend C#.
                            </div>
                        )}

                        {!loading && !error && filteredProducts.length === 0 && (
                            <div className="text-center py-5 bg-white rounded shadow-sm border">
                                <i className="fas fa-box-open text-muted" style={{ fontSize: '3rem', opacity: 0.4 }}></i>
                                <p className="text-muted mt-3 fw-semibold">Không tìm thấy thiết bị vật tư nào khớp với tiêu chuẩn tìm kiếm.</p>
                            </div>
                        )}

                        {!loading && !error && filteredProducts.length > 0 && (
                            <>
                                <div className="mb-3 pl-1">
                                    <span className="text-muted small">
                                        Tìm thấy <strong>{filteredProducts.length}</strong> thiết bị cơ khí đạt chuẩn lọc
                                    </span>
                                </div>
                                <div className="row">
                                    {filteredProducts.map(product => (
                                        <div className="col-md-4 col-sm-6 col-12 mb-4" key={product.id}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

// THÀNH PHẦN CARD SẢN PHẨM CON
function ProductCard({ product }) {
    const outOfStock = product.stockQuantity <= 0;

    // 💡 HÀM ĐIỀU KHIỂN: Thực thi lưu thông tin máy vào mảng LocalStorage
    const handleAddToCartClick = () => {
        // 1. Gọi hàm lõi lưu trữ từ cartService
        cartService.addToCart(product);

        // 2. Bắn một sự kiện cục bộ (Custom Event) thông báo cho Header.jsx biết để cập nhật số Badge ngay lập tức
        const event = new Event('storage');
        window.dispatchEvent(event);
    };

    return (
        <div className="card h-100 border-0 shadow-sm position-relative card-product-item"
            style={{ borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s', backgroundColor: '#fff' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>

            {outOfStock && (
                <span className="position-absolute badge bg-secondary text-white px-2 py-1"
                    style={{ top: '10px', left: '10px', zIndex: 2, fontSize: '11px' }}>
                    Tạm hết hàng
                </span>
            )}

            <Link to={`/product/${product.id}`} className="text-decoration-none">
                <div style={{ height: '190px', overflow: 'hidden', backgroundColor: '#fff', padding: '15px' }} className="d-flex align-items-center justify-content-center border-bottom">
                    <img src={resolveImage(product.imageUrl)} alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
            </Link>

            <div className="card-body d-flex flex-column p-3">
                <span className="text-uppercase small mb-1 fw-bold" style={{ color: ACCENT, fontSize: '11px', letterSpacing: '0.5px' }}>
                    {product.categoryName || "Thiết bị"}
                </span>

                <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <h6 className="font-weight-bold mb-2 text-dark card-title-hover" style={{ minHeight: '42px', fontSize: '14px', lineHeight: '1.5' }}>
                        {product.name}
                    </h6>
                </Link>

                <div className="mt-auto">
                    <div className="font-weight-bold mb-2" style={{ color: ACCENT, fontSize: '16px' }}>
                        {formatPrice(product.price)}
                    </div>
                    {/* 💡 ĐÃ CẬP NHẬT: Thay thế hàm alert thô bằng hàm handleAddToCartClick */}
                    <button className="btn btn-sm btn-block font-weight-bold text-white text-uppercase py-2"
                        disabled={outOfStock}
                        onClick={handleAddToCartClick}
                        style={{
                            backgroundColor: outOfStock ? '#dee2e6' : NAVY,
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            letterSpacing: '0.5px'
                        }}>
                        <i className="fas fa-shopping-cart mr-1"></i>
                        {outOfStock ? 'Hết hàng online' : 'Thêm vào giỏ'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShopPage;
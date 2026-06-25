/*
 Name: Le Thanh Ho
 MSSV: 2123110125
 Lop: CCQ2311D
*/
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';

function Header() {
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);

    // 🔄 Tự động cập nhật số lượng thiết bị trong giỏ hàng thực tế
    useEffect(() => {
        const updateCartBadge = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Tính tổng số lượng (quantity) của tất cả các mặt hàng trong giỏ
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(totalItems);
        };

        updateCartBadge();

        // Lắng nghe sự kiện thay đổi giỏ hàng từ trang ShopPage để cập nhật Badge thời gian thực
        window.addEventListener('storage', updateCartBadge);
        const interval = setInterval(updateCartBadge, 1000); // Bọc lót quét nhanh mỗi giây

        return () => {
            window.removeEventListener('storage', updateCartBadge);
            clearInterval(interval);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert("Chức năng tìm kiếm máy móc và phụ kiện cơ khí đang được tích hợp sâu vào API Backend!");
    };

    // Kiểm tra và gán class active làm nổi bật menu đang đứng
    const isActive = (path) => {
        return location.pathname === path
            ? 'font-weight-bold text-warning active-nav-link'
            : 'text-secondary-hover';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top" style={{ zIndex: 1050 }}>

            {/* TẦNG 1: TOP BAR (Hotline hỗ trợ & Phân hệ tài khoản thợ) */}
            <div className="top-bar text-white py-2" style={{ fontSize: '12.5px', backgroundColor: '#0D2C54', letterSpacing: '0.3px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="top-bar-left d-none d-sm-block">
                        <span className="mr-4">
                            <i className="fas fa-phone-alt mr-1 text-warning"></i> Hotline kỹ thuật: <strong>0398820547</strong>
                        </span>
                        <span>
                            <i className="fas fa-truck mr-1 text-warning"></i> Ship COD toàn quốc — Kiểm tra thử máy trước khi thanh toán
                        </span>
                    </div>
                    <div className="top-bar-right ml-auto font-weight-semibold">
                        {authService.isAuthenticated() ? (
                            <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                <span className="text-white">
                                    <i className="fas fa-user-circle mr-1 text-warning" style={{ fontSize: '14px' }}></i>
                                    Chào, <strong style={{ color: '#FFF' }}>{localStorage.getItem('customerName')}</strong>
                                </span>
                                <span className="text-muted">|</span>
                                <button
                                    className="btn btn-link text-white p-0 text-decoration-none small font-weight-bold btn-logout-hover"
                                    onClick={authService.logout}
                                    style={{ fontSize: '12.5px' }}
                                >
                                    <i className="fas fa-sign-out-alt mr-1"></i>Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                <Link to="/login" className="text-white text-decoration-none auth-link-hover">
                                    <i className="fas fa-sign-in-alt mr-1 small"></i> Đăng nhập
                                </Link>
                                <span className="text-muted" style={{ opacity: 0.5 }}>|</span>
                                <Link to="/register" className="text-white text-decoration-none auth-link-hover">
                                    <i className="fas fa-user-plus mr-1 small"></i> Đăng ký thành viên
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TẦNG 2: KHU VỰC TRUNG TÂM (Brand Logo, Thanh tìm kiếm, Giỏ hàng nổi bật) */}
            <div className="main-header py-3 border-bottom" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="container">
                    <div className="row align-items-center">

                        {/* 1. Logo Cửa hàng Cơ Khí */}
                        <div className="col-lg-3 col-md-4 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0 d-flex align-items-center" style={{ color: '#0D2C54', letterSpacing: '-0.5px' }}>
                                    <i className="fas fa-tools text-warning mr-2" style={{ transform: 'rotate(-15deg)' }}></i>
                                    <span>LeThanhHo</span>
                                    <span style={{ color: '#FF6B35' }}>.Tools</span>
                                </h3>
                            </Link>
                        </div>

                        {/* 2. Thanh tìm kiếm thông minh */}
                        <div className="col-lg-6 col-md-5 d-none d-md-block">
                            <form className="input-group shadow-sm" onSubmit={handleSearchSubmit} style={{ borderRadius: '6px', overflow: 'hidden' }}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm máy khoan pin, máy cắt sắt, đá mài, linh kiện..."
                                    style={{
                                        height: '42px',
                                        fontSize: '14px',
                                        borderColor: '#CBD5E1',
                                        paddingLeft: '15px'
                                    }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn text-white px-4 font-weight-bold d-flex align-items-center"
                                        type="submit"
                                        style={{
                                            backgroundColor: '#FF6B35',
                                            borderColor: '#FF6B35',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E05621'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                                    >
                                        <i className="fas fa-search mr-2"></i>Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 3. Khối Giỏ hàng Icon nổi bật */}
                        <div className="col-lg-3 col-md-3 col-6 text-right">
                            <Link
                                to="/cart"
                                className="btn position-relative d-inline-flex align-items-center justify-content-center border rounded-circle bg-white shadow-sm"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    color: '#0D2C54',
                                    borderColor: '#E2E8F0',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#FF6B35';
                                    e.currentTarget.style.color = '#FF6B35';
                                }}
                                /* 💡 ĐÃ SỬA: Xóa dấu chấm dư thừa ở đầu dòng dưới đây */
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                    e.currentTarget.style.color = '#0D2C54';
                                }}
                            >
                                <i className="fas fa-shopping-basket" style={{ fontSize: '18px' }}></i>
                                <span
                                    className="badge badge-pill position-absolute font-weight-bold"
                                    style={{
                                        top: '-5px',
                                        right: '-5px',
                                        backgroundColor: '#FF6B35',
                                        color: '#fff',
                                        fontSize: '11px',
                                        minWidth: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(255,107,53,0.3)'
                                    }}
                                >
                                    {cartCount}
                                </span>
                            </Link>
                        </div>

                </div>
            </div>
        </div>

            {/* TẦNG 3: THANH ĐIỀU HƯỚNG DANH MỤC TRANG WEB */ }
    <div className="main-navigation bg-white py-0 border-bottom">
        <div className="container">
            <nav className="navbar navbar-expand p-0">
                <ul className="navbar-nav d-flex flex-row flex-wrap m-0 p-0" style={{ listStyle: 'none' }}>

                    {/* Menu 1: Trang Chủ */}
                    <li className="nav-item" style={{ marginRight: '35px' }}>
                        <Link to="/" className={`nav-link py-3 px-0 position-relative text-decoration-none custom-nav-item ${isActive('/')}`} style={{ fontSize: '14.5px', color: '#1E293B', transition: 'color 0.2s' }}>
                            <i className="fas fa-home text-muted mr-1.5" style={{ fontSize: '14px' }}></i> Trang Chủ
                        </Link>
                    </li>

                    {/* Menu 2: Dụng Cụ & Máy Móc */}
                    <li className="nav-item" style={{ marginRight: '35px' }}>
                        <Link to="/shop" className={`nav-link py-3 px-0 position-relative text-decoration-none custom-nav-item ${isActive('/shop')}`} style={{ fontSize: '14.5px', color: '#1E293B', transition: 'color 0.2s' }}>
                            <i className="fas fa-hammer text-muted mr-1.5" style={{ fontSize: '14px' }}></i> Dụng Cụ &amp; Máy Móc
                        </Link>
                    </li>

                    {/* Menu 3: Cẩm nang hướng dẫn kỹ thuật */}
                    <li className="nav-item" style={{ marginRight: '35px' }}>
                        <Link to="/blog" className={`nav-link py-3 px-0 position-relative text-decoration-none custom-nav-item ${isActive('/blog')}`} style={{ fontSize: '14.5px', color: '#1E293B', transition: 'color 0.2s' }}>
                            <i className="fas fa-book-open text-muted mr-1.5" style={{ fontSize: '14px' }}></i> Cẩm Nang Kỹ Thuật
                        </Link>
                    </li>

                    {/* Menu 4: Về chúng tôi (ĐÃ SỬA LỖI LOGIC ACTIVE TRÙNG BLOG) */}
                    <li className="nav-item">
                        <Link to="/about" className={`nav-link py-3 px-0 position-relative text-decoration-none custom-nav-item ${isActive('/about')}`} style={{ fontSize: '14.5px', color: '#1E293B', transition: 'color 0.2s' }}>
                            <i className="fas fa-info-circle text-muted mr-1.5" style={{ fontSize: '14px' }}></i> Về Chúng Tôi
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    </div>

    {/* 💡 THÊM STYLE BỔ TRỢ ĐỂ NÂNG CẤP HOVER ĐỘNG CHO ĐỒ ÁN */ }
    <style>{`
                .text-secondary-hover { color: #475569 !important; }
                .text-secondary-hover:hover { color: #FF6B35 !important; text-decoration: none; }
                .auth-link-hover { opacity: 0.9; transition: opacity 0.2s; }
                .auth-link-hover:hover { opacity: 1; color: #FF6B35 !important; text-decoration: none; }
                .btn-logout-hover:hover { color: #FF6B35 !important; opacity: 0.9; }
                
                /* Hiệu ứng gạch chân chạy dưới chân các mục menu khi hover giống các website lớn */
                .custom-nav-item::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 3px;
                    background-color: #FF6B35;
                    transition: width 0.2s ease-in-out;
                }
                .custom-nav-item:hover::after, .active-nav-link::after {
                    width: 100%;
                }
                .active-nav-link {
                    color: #FF6B35 !important;
                }
                .mr-1\\.5 { margin-right: 6px !important; }
            `}</style>

        </header >
    );
}

export default Header;
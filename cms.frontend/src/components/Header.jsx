import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert("Chức năng tìm kiếm máy móc và phụ kiện cơ khí sẽ kết nối API ở các buổi sau!");
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active font-weight-bold text-warning' : 'text-dark';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">

            {/* TẦNG 1: TOP BAR (Hotline hỗ trợ & Tài khoản) */}
            <div className="top-bar text-white py-2" style={{ fontSize: '13px', backgroundColor: '#0D2C54' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="top-bar-left">
                        <span className="mr-3">
                            <i className="fas fa-phone-alt mr-1 text-warning"></i> Tư vấn mua hàng: 0398820547
                        </span>
                        <span>
                            <i className="fas fa-truck mr-1 text-warning"></i> Giao hàng toàn quốc - Kiểm tra thử máy trước khi trả tiền
                        </span>
                    </div>
                    <div className="top-bar-right">
                        <Link to="/login" className="text-white mr-3 text-decoration-none">
                            <i className="fas fa-sign-in-alt mr-1"></i> Đăng nhập
                        </Link>
                        <Link to="/register" className="text-white text-decoration-none">
                            <i className="fas fa-user-plus mr-1"></i> Đăng ký thành viên
                        </Link>
                    </div>
                </div>
            </div>

            {/* TẦNG 2: KHU VỰC TRUNG TÂM (Tên Shop, Thanh tìm kiếm máy, Giỏ hàng) */}
            <div className="main-header py-3 border-bottom bg-light">
                <div className="container">
                    <div className="row align-items-center">

                        {/* 1. Logo Cửa hàng Máy Cơ Khí */}
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0" style={{ color: '#0D2C54' }}>
                                    <i className="fas fa-tools text-warning mr-2"></i>
                                    LeThanhHo<span style={{ color: '#FF6B35' }}>.Tools</span>
                                </h3>
                            </Link>
                        </div>

                        {/* 2. Ô tìm kiếm bám sát thực tế (Máy khoan, máy cắt, mũi khoan, đá cắt...) */}
                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm máy khoan pin, máy cắt sắt, mũi khoan đa năng, đá cắt mài..."
                                    style={{ borderRadius: '6px 0 0 6px', fontSize: '14px', borderColor: '#0D2C54' }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn text-white border-left-0 px-4 font-weight-bold"
                                        type="submit"
                                        style={{
                                            borderRadius: '0 6px 6px 0',
                                            backgroundColor: '#FF6B35',
                                            borderColor: '#FF6B35'
                                        }}
                                    >
                                        <i className="fas fa-search"></i> Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 3. Giỏ hàng mua máy */}
                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2" style={{ color: '#0D2C54', fontSize: '22px' }}>
                                <i className="fas fa-shopping-cart"></i>
                                <span
                                    className="badge badge-pill position-absolute"
                                    style={{
                                        top: '0',
                                        right: '-5px',
                                        backgroundColor: '#FF6B35',
                                        color: '#fff',
                                        fontSize: '11px',
                                        padding: '4px 6px'
                                    }}
                                >
                                    0
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
            {/* TẦNG 3: THANH DANH MỤC TRANG WEB (ÉP STYLE DỨT ĐIỂM LỖI DÍNH CHÙM) */}
            <div className="main-navigation bg-white py-2 shadow-sm border-bottom">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        {/* Sử dụng style={...} trực tiếp để ép các mục dàn ngang và xóa mọi thuộc tính ẩn dính dòng */}
                        <ul className="navbar-nav d-flex flex-row flex-wrap m-0 p-0" style={{ display: 'flex !important', flexDirection: 'row !important', listStyle: 'none' }}>

                            {/* Menu 1: Trang Chủ */}
                            <li className="nav-item py-1" style={{ marginRight: '30px', paddingRight: '10px' }}>
                                <Link to="/" className={`nav-link p-0 text-decoration-none ${isActive('/')}`} style={{ fontSize: '15px', display: 'inline-block' }}>
                                    <i className="fas fa-home text-muted mr-1"></i> Trang Chủ
                                </Link>
                            </li>

                            {/* Menu 2: Dụng Cụ & Máy Móc */}
                            <li className="nav-item py-1" style={{ marginRight: '30px', paddingRight: '10px' }}>
                                <Link to="/shop" className={`nav-link p-0 text-decoration-none ${isActive('/shop')}`} style={{ fontSize: '15px', display: 'inline-block' }}>
                                    <i className="fas fa-hammer text-muted mr-1"></i> Dụng Cụ & Máy Móc
                                </Link>
                            </li>

                            {/* Menu 3: Mẹo Hướng Dẫn Kỹ Thuật */}
                            <li className="nav-item py-1" style={{ marginRight: '0px' }}>
                                <Link to="/blog" className={`nav-link p-0 text-decoration-none ${isActive('/blog')}`} style={{ fontSize: '15px', display: 'inline-block' }}>
                                    <i className="fas fa-book text-muted mr-1"></i> Mẹo Hướng Dẫn Kỹ Thuật
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>

        </header>
    );
}

export default Header;
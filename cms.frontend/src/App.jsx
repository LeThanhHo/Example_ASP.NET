import React from 'react';
// Import các thành phần lõi của thư viện điều hướng đường dẫn
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT CÁC COMPONENT TOÀN CỤC (LAYOUT CHUNG)
import Header from './components/Header';
import Footer from './components/Footer';

// 2. IMPORT CÁC TRANG CHỨC NĂNG (GIAO DIỆN CHÍNH)
import Home from './pages/home/index';
import Shop from './pages/shop/index';                  // Tự động nạp file pages/shop/index.jsx
import ProductDetail from './pages/product-detail'; // Tự động nạp file pages/product-detail/index.jsx
import Blog from './pages/blog/index';                  // Tự động nạp file pages/blog/index.jsx
import BlogDetail from './pages/blog-detail/index';  // Nạp trang chi tiết bài viết cụ thể
import Cart from './pages/cart/index';                  // Tự động nạp file pages/cart/index.jsx
import Checkout from './pages/checkout/index';          // Tự động nạp file pages/checkout/index.jsx
import About from './pages/about/index';                // Về Chúng Tôi - pages/about/index.jsx
import LoginPage from './pages/login/index';
import RegisterPage from './pages/register/index';
import CartPage from './pages/cart/index';
import CustomerProfilePage from './pages/profile';
import ForgotPasswordPage from './pages/login/ForgotPassword';
import ChatBoxAI from './components/ChatBoxAI';
function App() {
    return (
        // Khởi tạo bộ định tuyến bao bọc toàn bộ ứng dụng Web
        <Router>
            <div className="d-flex flex-column min-vh-100 bg-light">

               

                {/* KHU VỰC NỘI DUNG ĐỘNG (Thay đổi ruột tùy theo URL trên thanh địa chỉ) */}
                <main className="flex-grow-1">
                    <Routes>
                        {/* Cấu hình Trang chủ - Khớp hoàn toàn với địa chỉ "/" */}
                        <Route path="/" element={<Home />} />

                        {/* Cấu hình Trang Cửa hàng - Địa chỉ "/shop" */}
                        <Route path="/shop" element={<Shop />} />

                        {/* Cấu hình Trang Chi tiết sản phẩm - Sử dụng tham số động ":id" */}
                        {/* Ví dụ khi vào link: /product/5 -> useParams() sẽ lấy được id = 5 */}
                        <Route path="/product/:id" element={<ProductDetail />} />

                        {/* Cấu hình Trang Danh sách tin tức - Địa chỉ "/blog" */}
                        <Route path="/blog" element={<Blog />} />

                        {/* Cấu hình Trang Chi tiết bài viết - Địa chỉ "/blog/:id" */}
                        <Route path="/blog/:id" element={<BlogDetail />} />

                        {/* Cấu hình Trang Về chúng tôi - Địa chỉ "/about" */}
                        <Route path="/about" element={<About />} />

                        {/* Cấu hình Trang Giỏ hàng cá nhân - Địa chỉ "/cart" */}
                        <Route path="/cart" element={<Cart />} />

                        {/* Cấu hình Trang Điền thông tin thanh toán - Địa chỉ "/checkout" */}
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/profile" element={<CustomerProfilePage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        {/* XỬ LÝ KỊCH BẢN TRANG LỖI 404 (Khi sinh viên gõ sai URL) */}
                        <Route path="*" element={
                            <div className="container text-center py-5 my-5">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/580/580185.png"
                                    alt="404"
                                    className="mb-4"
                                    style={{ width: '100px', opacity: 0.6 }}
                                />
                                <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
                                <p className="text-muted">Đường dẫn bạn truy cập không tồn tại trên hệ thống.</p>
                                <a href="/" className="btn btn-dark btn-sm mt-2">Quay lại Trang Chủ</a>
                            </div>
                        } />
                    </Routes>
                </main>
                <ChatBoxAI />
               

            </div>
        </Router>
    );
}

export default App;

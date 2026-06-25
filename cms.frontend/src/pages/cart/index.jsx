// src/pages/cart/index.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [notes, setNotes] = useState('');
    const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

    // 🔒 Kiểm tra trạng thái tài khoản ràng buộc
    const customerId = localStorage.getItem('customerId');
    const customerName = localStorage.getItem('customerName');

    useEffect(() => {
        // Nạp dữ liệu giỏ hàng thực tế đang lưu ở trình duyệt
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    // 🔄 Hàm cập nhật nhanh số lượng thiết bị
    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
        const updated = cartItems.map(item => item.productId === productId ? { ...item, quantity: newQty } : item);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    // 🗑️ HÀM 1: XÓA TỪNG SẢN PHẨM KHỎI GIỎ HÀNG
    const removeItem = (productId, productName) => {
        if (window.confirm(`Bạn có chắc chắn muốn bỏ thiết bị [${productName}] khỏi giỏ hàng không?`)) {
            const updated = cartItems.filter(item => item.productId !== productId);
            setCartItems(updated);
            localStorage.setItem('cart', JSON.stringify(updated));
        }
    };

    // 🧹 HÀM 2: XÓA SẠCH TOÀN BỘ GIỎ HÀNG (CLEAR ALL)
    const clearAllCart = () => {
        if (window.confirm("Cảnh báo: Bạn có chắc chắn muốn xóa toàn bộ sản phẩm và làm trống giỏ hàng này không?")) {
            setCartItems([]);
            localStorage.removeItem('cart');
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // HÀM XỬ LÝ CHỐT ĐƠN ĐẨY VỀ BACKEND C#
    const handleCheckout = async () => {
        if (!customerId) {
            setSubmitStatus({ type: 'danger', text: 'Ràng buộc an toàn: Bạn buộc phải đăng nhập tài khoản thợ mới có quyền chốt đơn mua vật tư!' });
            return;
        }

        const payload = {
            customerId: Number(customerId),
            notes: notes,
            items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
        };

        try {
            const res = await axios.post('https://localhost:7116/api/CartApi/checkout', payload);
            setSubmitStatus({ type: 'success', text: res.data.message || 'Chốt đơn thành công! Kho hàng đang chuẩn bị vật tư.' });
            localStorage.removeItem('cart'); // Xóa sạch giỏ hàng sau khi mua xong
            setCartItems([]);
        } catch (err) {
            setSubmitStatus({ type: 'danger', text: err.response?.data?.message || 'Có lỗi xảy ra khi gửi đơn hàng.' });
        }
    };

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 className="font-weight-bold m-0" style={{ color: '#0D2C54' }}>
                    <i className="fas fa-shopping-cart text-warning mr-2"></i>GIỎ HÀNG VÀ THANH TOÁN
                </h4>
                {cartItems.length > 0 && (
                    /* 💡 NÚT XÓA TẤT CẢ GIỎ HÀNG NẰM Ở GÓC PHẢI TIÊU ĐỀ */
                    <button className="btn btn-outline-danger btn-sm font-weight-bold" onClick={clearAllCart}>
                        <i className="fas fa-trash-sweep mr-1"></i> Xóa tất cả giỏ hàng
                    </button>
                )}
            </div>

            {submitStatus.text && <div className={`alert alert-${submitStatus.type} mb-4`}>{submitStatus.text}</div>}

            {cartItems.length === 0 ? (
                <div className="text-center py-5 bg-white rounded border shadow-sm">
                    <i className="fas fa-cart-plus text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted font-weight-medium">Giỏ hàng vật tư của bạn đang trống.</p>
                    <Link to="/shop" className="btn text-white font-weight-bold px-4" style={{ backgroundColor: '#0D2C54' }}>Vào Cửa Hàng</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {/* KHỐI 1: DANH SÁCH LINH KIỆN ĐANG CHỌN (Bên Trái) */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 p-3 bg-white">
                            <h6 className="font-weight-bold border-bottom pb-2 mb-3 text-muted">Vật tư đã chọn</h6>
                            {cartItems.map(item => (
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3" key={item.productId}>
                                    <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                        <img src={`https://localhost:7116${item.imageUrl || '/images/products/default-tool.jpg'}`} alt="" className="img-thumbnail" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                        <div>
                                            <h6 className="mb-1 font-weight-bold" style={{ fontSize: '14px' }}>{item.name}</h6>
                                            <span className="text-danger small font-weight-bold">{new Intl.NumberFormat('vi-VN').format(item.price)} ₫</span>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                        <div className="input-group input-group-sm" style={{ width: '90px' }}>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                                            <input type="text" className="form-control text-center bg-white p-0" value={item.quantity} readOnly />
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                                        </div>

                                        {/* 💡 NÚT XÓA TỪNG SẢN PHẨM RIÊNG BIỆT */}
                                        <button
                                            className="btn btn-light text-danger btn-sm border rounded-circle d-flex align-items-center justify-content-center"
                                            onClick={() => removeItem(item.productId, item.name)}
                                            style={{ width: '32px', height: '32px' }}
                                            title="Xóa thiết bị này khỏi đơn"
                                        >
                                            <i className="fas fa-trash-alt" style={{ fontSize: '13px' }}></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="text-right font-weight-bold h5 text-dark mt-2">
                                Tổng cộng tiền: <span className="text-danger">{new Intl.NumberFormat('vi-VN').format(totalAmount)} ₫</span>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 2: FORM XÁC NHẬN RÀNG BUỘC ĐĂNG NHẬP (Bên Phải) */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 p-4 bg-white">
                            <h6 className="font-weight-bold border-bottom pb-2 mb-3 text-muted">Thông tin chốt hóa đơn</h6>

                            {customerId ? (
                                <div>
                                    <div className="alert alert-success py-2 small mb-3">
                                        <i className="fas fa-user-check mr-2"></i>Thợ mua hàng: <strong>{customerName}</strong> (Mã đối tác: #{customerId})
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label font-weight-bold small text-secondary">Ghi chú giao vật tư (Địa chỉ nhận, thời gian...)</label>
                                        <textarea className="form-control shadow-sm" rows="3" placeholder="Lưu ý cho đơn vị vận chuyển..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ fontSize: '13.5px' }}></textarea>
                                    </div>
                                    <button className="btn btn-block text-white font-weight-bold text-uppercase py-3 shadow-sm btn-order-submit" style={{ backgroundColor: '#FF6B35', border: 'none', borderRadius: '4px', transition: 'background-color 0.2s' }} onClick={handleCheckout}>
                                        <i className="fas fa-check-circle mr-2"></i>XÁC NHẬN ĐẶT HÀNG
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <div className="alert alert-warning small mb-4 text-left">
                                        <i className="fas fa-exclamation-triangle mr-2"></i><strong>HỆ THỐNG CHẶN THANH TOÁN:</strong> Bạn phải sở hữu tài khoản thành viên để tiệm cơ khí đối chiếu công nợ và bảo hành thiết bị.
                                    </div>
                                    <Link to="/login" className="btn btn-dark btn-block font-weight-bold py-2 text-uppercase mb-2 shadow-sm">
                                        <i className="fas fa-sign-in-alt mr-2"></i>Đăng nhập tài khoản ngay
                                    </Link>
                                    <Link to="/register" className="text-decoration-none small font-weight-bold d-block mt-2" style={{ color: '#FF6B35' }}>
                                        Hoặc Đăng ký thành viên mới
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .btn-order-submit:hover { background-color: #E05621 !important; }
            `}</style>
        </div>
    );
}

export default CartPage;
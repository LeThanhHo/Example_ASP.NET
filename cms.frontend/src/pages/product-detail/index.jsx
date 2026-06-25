// src/pages/product-detail/index.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';

function ProductDetail() {
    // 1. Lấy ID động từ URL (Ví dụ: /product/1 -> id = 1)
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7116";

    // 2. Kích hoạt gọi API nạp dữ liệu thiết bị cơ khí khi mở trang
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);

                // Đề phòng trường hợp C# trả về object bọc mảng hoặc dữ liệu gốc
                const cleanData = data?.$values ? data.$values[0] : data;
                setProduct(cleanData);
                setQuantity(1); // Reset lại số lượng mua bằng 1 khi đổi máy
            } catch (error) {
                console.error("Không thể tải thông tin chi tiết thiết bị:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProductDetail();
    }, [id]);

    // Hàm định dạng tiền tệ VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm xử lý tăng giảm số lượng mua máy
    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increase' && quantity < (product?.stockQuantity || 1)) setQuantity(quantity + 1);
    };

    // 💡 LÔGIC MỚI: Thêm thiết bị đính kèm số lượng mua thực tế vào LocalStorage
    const handleAddToCart = () => {
        if (!product) return;

        // Rút giỏ hàng hiện tại ở máy khách ra
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Tìm xem thiết bị cơ khí này đã nằm trong giỏ hay chưa
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            // Nếu có rồi, cộng dồn thêm số lượng thợ vừa chọn trên ô input
            const totalQty = existingItem.quantity + quantity;

            // Chốt chặn không cho vượt quá kho hàng thực tế của C#
            if (totalQty > product.stockQuantity) {
                alert(`Không thể thêm! Số lượng trong giỏ (${existingItem.quantity}) + số lượng chọn thêm (${quantity}) đã vượt quá tồn kho hiện tại của tiệm (${product.stockQuantity} máy).`);
                return;
            }
            existingItem.quantity = totalQty;
        } else {
            // Nếu chưa có, đẩy Object linh kiện mới vào mảng
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity // Nhận số lượng động
            });
        }

        // Ghi dữ liệu mới đè lại vào bộ nhớ máy trình duyệt
        localStorage.setItem('cart', JSON.stringify(cart));

        // 🔄 Bắn tín hiệu đồng bộ để Icon giỏ hàng trên thanh Header tự động nhảy số theo
        window.dispatchEvent(new Event('storage'));

        alert(`Đã thêm thành công [${quantity}] máy [${product.name}] vào giỏ vật tư!`);
    };

    if (loading) {
        return (
            <div className="container my-5 text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted">Đang truy xuất thông số kỹ thuật sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container my-5 text-center py-5">
                <div className="alert alert-danger">Không tìm thấy thông tin thiết bị yêu cầu hoặc sản phẩm đã bị xóa khỏi hệ thống.</div>
                <Link to="/" className="btn btn-dark mt-3">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            {/* Thanh điều hướng Breadcrumb nhỏ - Đã sửa class thành className chuẩn React */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb bg-transparent p-0 small">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none text-muted">Dụng cụ &amp; Máy móc</Link></li>
                    <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row g-5">
                {/* KHỐI 1: HÌNH ẢNH THIẾT BỊ (Bên trái) */}
                <div className="col-md-6 col-12 mb-4">
                    <div className="p-4 border rounded bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ height: '420px' }}>
                        <img
                            src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`) : "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500"}
                            alt={product.name}
                            className="img-fluid"
                            style={{ maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* KHỐI 2: THÔNG SỐ VÀ ĐẶT MUA SẢN PHẨM (Bên phải) */}
                <div className="col-md-6 col-12">
                    <div className="product-detail-info bg-white p-4 border rounded shadow-sm">
                        {/* Tên thiết bị cơ khí */}
                        <h3 className="font-weight-bold mb-2" style={{ color: '#0D2C54', fontSize: '24px' }}>{product.name}</h3>

                        {/* Trạng thái kho hàng */}
                        <div className="mb-3">
                            {product.stockQuantity > 0 ? (
                                <span className="badge bg-success text-white px-2 py-1">
                                    <i className="fas fa-check mr-1"></i> Sẵn hàng tại kho (Còn {product.stockQuantity} máy)
                                </span>
                            ) : (
                                <span className="badge bg-secondary text-white px-2 py-1">
                                    <i className="fas fa-exclamation-triangle mr-1"></i> Tạm hết hàng online
                                </span>
                            )}
                        </div>

                        {/* Giá tiền niêm yết lớn rực rỡ */}
                        <h4 className="text-danger font-weight-bold mb-4" style={{ fontSize: '26px' }}>
                            {formatCurrency(product.price)}
                        </h4>

                        <hr />

                        {/* Đoạn mô tả kỹ thuật / tính năng máy */}
                        <div className="my-4">
                            <h6 className="font-weight-bold text-dark text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                                <i className="fas fa-file-alt text-secondary mr-2"></i>Mô tả sản phẩm &amp; Thông số kĩ thuật:
                            </h6>
                            <p className="text-secondary text-justify mt-2" style={{ fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                {product.description || "Thiết bị công cụ cầm tay chuyên dụng phân phối chính hãng bởi LeThanhHo.Tools. Sản phẩm được sản xuất trên dây chuyền công nghệ hiện đại, kết cấu cơ khí chính xác, khả năng chịu tải cao và bền bỉ trong môi trường công xưởng."}
                            </p>
                        </div>

                        <hr />

                        {/* KHU VỰC TƯƠNG TÁC SỐ LƯỢNG VÀ BẤM ĐẶT HÀNG */}
                        {product.stockQuantity > 0 && (
                            <div className="order-section mt-4">
                                <div className="d-flex align-items-center mb-4">
                                    <span className="font-weight-bold mr-3 text-secondary small">Số lượng mua:</span>
                                    {/* Cụm nút bấm tăng giảm số lượng */}
                                    <div className="input-group input-group-sm" style={{ width: '110px' }}>
                                        <button className="btn btn-outline-secondary font-weight-bold" type="button" onClick={() => handleQuantityChange('decrease')}>-</button>
                                        <input type="text" className="form-control text-center bg-white font-weight-bold p-0" value={quantity} readOnly />
                                        <button className="btn btn-outline-secondary font-weight-bold" type="button" onClick={() => handleQuantityChange('increase')}>+</button>
                                    </div>
                                </div>

                                <div className="d-flex">
                                    {/* Nút Thêm vào giỏ vật tư */}
                                    <button
                                        className="btn btn-block text-white font-weight-bold text-uppercase py-3"
                                        style={{ backgroundColor: '#FF6B35', borderColor: '#FF6B35', borderRadius: '4px', fontSize: '13px', letterSpacing: '0.5px' }}
                                        onClick={handleAddToCart}
                                    >
                                        <i className="fas fa-cart-plus mr-2"></i> THÊM VÀO GIỎ HÀNG
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Các cam kết an tâm mua hàng kỹ thuật */}
                        <div className="mt-4 p-3 bg-light rounded border" style={{ fontSize: '12.5px' }}>
                            <div className="row text-secondary">
                                <div className="col-6 mb-2"><i className="fas fa-shield-alt text-success mr-2"></i>Bảo hành đổi mới 7 ngày</div>
                                <div className="col-6 mb-2"><i className="fas fa-wrench text-success mr-2"></i>Thử máy đạt chuẩn mới trả tiền</div>
                                <div className="col-6"><i className="fas fa-check-circle text-success mr-2"></i>Cam kết chính hãng 100%</div>
                                <div className="col-6"><i className="fas fa-headset text-success mr-2"></i>Hỗ trợ kỹ thuật trọn đời</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
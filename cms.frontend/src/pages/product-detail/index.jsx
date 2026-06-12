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
            {/* Thanh điều hướng Breadcrumb nhỏ */}
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb bg-transparent p-0 small">
                    <li class="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                    <li class="breadcrumb-item"><Link to="/shop" className="text-decoration-none text-muted">Dụng cụ & Máy móc</Link></li>
                    <li class="breadcrumb-item active text-dark fw-bold" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row g-5">
                {/* KHỐI 1: HÌNH ẢNH THIẾT BỊ (Bên trái) */}
                <div className="col-md-6 col-12">
                    <div className="p-3 border rounded bg-white d-flex align-items-center justify-content-center" style={{ height: '420px' }}>
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
                    <div className="product-detail-info">
                        {/* Tên thiết bị cơ khí */}
                        <h2 className="font-weight-bold mb-2" style={{ color: '#0D2C54' }}>{product.name}</h2>

                        {/* Trạng thái kho hàng Linh Xuân */}
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
                        <h3 className="text-danger font-weight-bold mb-4" style={{ fontSize: '28px' }}>
                            {formatCurrency(product.price)}
                        </h3>

                        <hr />

                        {/* Đoạn mô tả kỹ thuật / tính năng máy */}
                        <div className="my-4">
                            <h6 className="font-weight-bold text-dark text-uppercase"><i className="fas fa-file-alt text-secondary mr-2"></i>Mô tả sản phẩm & Thông số kĩ thuật:</h6>
                            <p className="text-secondary text-justify mt-2" style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                                {product.description || "Thiết bị công cụ cầm tay chuyên dụng phân phối chính hãng bởi LeThanhHo.Tools. Sản phẩm được sản xuất trên dây chuyền công nghệ hiện đại, kết cấu cơ khí chính xác, khả năng chịu tải cao và bền bỉ trong môi trường công xưởng."}
                            </p>
                        </div>

                        <hr />

                        {/* KHU VỰC TƯƠNG TÁC SỐ LƯỢNG VÀ BẤM ĐẶT HÀNG */}
                        {product.stockQuantity > 0 && (
                            <div className="order-section mt-4">
                                <div className="d-flex align-items-center mb-4">
                                    <span className="font-weight-bold mr-3 text-secondary" style={{ fontSize: '14px' }}>Số lượng mua:</span>
                                    {/* Cụm nút bấm tăng giảm số lượng */}
                                    <div className="input-group" style={{ width: '130px' }}>
                                        <button className="btn btn-outline-secondary px-3" type="button" onClick={() => handleQuantityChange('decrease')}>-</button>
                                        <input type="text" className="form-control text-center bg-white font-weight-bold" value={quantity} readOnly />
                                        <button className="btn btn-outline-secondary px-3" type="button" onClick={() => handleQuantityChange('increase')}>+</button>
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    {/* Nút Thêm vào giỏ vật tư */}
                                    <button
                                        className="btn btn-lg text-white font-weight-bold px-4 py-3"
                                        style={{ backgroundColor: '#FF6B35', borderColor: '#FF6B35', borderRadius: '4px', flexGrow: 1 }}
                                        onClick={() => alert(`Đã thêm thành công [${quantity}] máy [${product.name}] vào giỏ hàng!`)}
                                    >
                                        <i className="fas fa-cart-plus mr-2"></i> THÊM VÀO GIỎ HÀNG
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Các cam kết an tâm mua hàng kỹ thuật */}
                        <div className="mt-4 p-3 bg-light rounded border" style={{ fontSize: '13px' }}>
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
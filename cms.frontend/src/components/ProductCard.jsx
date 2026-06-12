import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7116";

function ProductCard({ item }) {

    // Hàm bổ trợ: Định dạng số thô thành chuỗi tiền tệ VNĐ (450.000 ₫)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Kiểm tra ảnh sản phẩm hợp lệ (Dự phòng ảnh công cụ kỹ thuật chất lượng cao)
    const getProductImage = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500';
        if (url.startsWith('http')) return url;
        return `${IMAGE_BASE_URL}${url}`;
    };

    return (
        <div className="card h-100 shadow-sm border-0 product-card-hover"
            style={{
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #eef2f5'
            }}>

            {/* KHỐI 1: HÌNH ẢNH MÁY MÓC / PHỤ KIỆN + NHÃN TỒN KHO */}
            <div className="position-relative overflow-hidden" style={{ height: '260px', backgroundColor: '#f8fafc' }}>
                <img
                    src={getProductImage(item.imageUrl)}
                    className="card-img-top w-100 h-100"
                    alt={item.name}
                    style={{ objectFit: 'contain', padding: '15px', transition: 'transform 0.4s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.06)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />

                {/* Thuật toán cơ khí: Kiểm tra số lượng tồn kho thấp */}
                {item.stockQuantity <= 5 && item.stockQuantity > 0 && (
                    <span className="badge bg-danger text-white position-absolute px-2 py-1 shadow-sm"
                        style={{ top: '12px', left: '12px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="fas fa-fire mr-1"></i> SẮP HẾT HÀNG / Còn {item.stockQuantity} sản phẩm
                    </span>
                )}

                {/* Dự phòng trường hợp cháy hàng kho Linh Xuân */}
                {item.stockQuantity === 0 && (
                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center text-white font-weight-bold"
                        style={{ top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                        <span className="badge bg-secondary px-3 py-2 text-uppercase"><i className="fas fa-exclamation-triangle mr-1"></i> Tạm hết hàng</span>
                    </div>
                )}
            </div>

            {/* KHỐI 2: NỘI DUNG THÔNG TIN KỸ THUẬT VÀ GIÁ BÁN */}
            <div className="card-body d-flex flex-column p-3" style={{ backgroundColor: '#ffffff' }}>

                {/* Hiển thị Thương hiệu hoặc Mã loại máy mẫu giả lập phục vụ UX đồ án */}
                <small className="text-uppercase font-weight-bold mb-1 d-block text-muted" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    <i className="fas fa-cube mr-1 text-secondary"></i> {item.brand || item.categoryName || "Thiết bị chính hãng"}
                </small>

                {/* Tên dòng máy / Phụ kiện kim khí */}
                <h6 className="card-title font-weight-bold text-dark text-truncate mb-2"
                    title={item.name}
                    style={{ fontSize: '15px', color: '#0D2C54', minHeight: '22px' }}>
                    {item.name}
                </h6>

                {/* Giá tiền niêm yết sản phẩm */}
                <p className="card-text font-weight-bold text-danger mb-3" style={{ fontSize: '17px' }}>
                    {formatCurrency(item.price)}
                </p>

                {/* CỤM NÚT TƯƠNG TÁC CHUẨN CƠ KHÍ */}
                <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    {/* Nút Xem thông số chi tiết */}
                    <Link
                        to={`/product/${item.id}`}
                        className="btn btn-sm btn-outline-secondary font-weight-bold px-2 py-2 d-flex align-items-center justify-content-center mr-1"
                        style={{ borderRadius: '4px', flex: 1, fontSize: '13px', border: '1px solid #ced4da' }}
                    >
                        <i className="fas fa-info-circle mr-1"></i> Xem thông số
                    </Link>

                    {/* Nút Đặt mua ngay */}
                    <button
                        className="btn btn-sm text-white font-weight-bold px-2 py-2 ml-1 d-flex align-items-center justify-content-center"
                        style={{
                            borderRadius: '4px',
                            backgroundColor: item.stockQuantity === 0 ? '#6c757d' : '#FF6B35',
                            borderColor: item.stockQuantity === 0 ? '#6c757d' : '#FF6B35',
                            flex: 1.2,
                            fontSize: '13px',
                            boxShadow: item.stockQuantity === 0 ? 'none' : '0 2px 6px rgba(255, 107, 53, 0.2)'
                        }}
                        onClick={() => alert(`Đã thêm thiết bị [${item.name}] vào giỏ vật tư!`)}
                        disabled={item.stockQuantity === 0}
                    >
                        <i className="fas fa-cart-plus mr-1"></i> Đặt mua ngay
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ProductCard;
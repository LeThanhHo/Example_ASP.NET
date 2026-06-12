import React from 'react';
import { Link } from 'react-router-dom';

function HeroBanner() {
    return (
        <div className="hero-banner-wrapper my-4 rounded shadow-sm overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1A4B83 100%)',
                color: '#ffffff'
            }}>
            <div className="container py-5 px-4 px-md-5">
                <div className="row align-items-center">

                    {/* CỘT TRÁI: THÔNG TIN KHUYẾN MÃI & NÚT KÊU GỌI MUA HÀNG */}
                    <div className="col-lg-6 text-center text-lg-left mb-4 mb-lg-0">
                        {/* Nhãn chương trình nhỏ phía trên */}
                        <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-3"
                            style={{ backgroundColor: '#FF6B35', fontSize: '12px', letterSpacing: '1px' }}>
                            <i className="fas fa-bolt mr-1"></i> Tuần Lễ Vàng Kim Khí
                        </span>

                        {/* Tiêu đề chính */}
                        <h1 className="display-4 font-weight-bold mb-3" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                            DỤNG CỤ CẦM TAY <br />
                            <span style={{ color: '#FF6B35' }}>CHÍNH HÃNG 100%</span>
                        </h1>

                        {/* Mô tả ngắn */}
                        <p className="lead mb-4 text-justify-sm" style={{ fontSize: '16px', color: '#e0e6ed', opacity: 0.9 }}>
                            Bứt phá hiệu suất công việc với các dòng máy khoan pin lực siết khủng, máy cắt mài bền bỉ và bộ phụ kiện đá cắt, mũi khoan siêu cứng. Bảo hành dài hạn từ 6 - 12 tháng.
                        </p>

                        {/* Cụm thông tin cốt lõi (Cam kết nhanh) */}
                        <div className="d-flex justify-content-center justify-content-lg-start mb-4" style={{ fontSize: '13px' }}>
                            <span className="mr-3"><i className="fas fa-check-circle text-warning mr-1"></i> Đổi mới 7 ngày</span>
                            <span className="mr-3"><i className="fas fa-shield-alt text-warning mr-1"></i> Bảo hành toàn quốc</span>
                            <span><i className="fas fa-truck text-warning mr-1"></i> Ship COD tận xưởng</span>
                        </div>

                        {/* Nút chuyển trang mua sắm */}
                        <Link to="/shop"
                            className="btn btn-lg font-weight-bold px-5 py-3 transition-all"
                            style={{
                                backgroundColor: '#FF6B35',
                                borderColor: '#FF6B35',
                                color: '#fff',
                                borderRadius: '4px',
                                fontSize: '16px',
                                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#e0531f'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#FF6B35'}
                        >
                            <i className="fas fa-shopping-bag mr-2"></i> KHÁM PHÁ NGAY
                        </Link>
                    </div>

                    {/* CỘT PHẢI: HÌNH ẢNH MINH HỌA MÁY MÓC THIẾT BỊ (BÁN CHẠY) */}
                    <div className="col-lg-6 text-center">
                        <div className="position-relative p-3">
                            {/* Bạn có thể thay link ảnh minh họa này bằng ảnh máy móc thật từ thư mục assets sau này */}
                            <img
                                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=60"
                                alt="Dụng cụ điện cơ khí cầm tay"
                                className="img-fluid rounded shadow"
                                style={{
                                    maxHeight: '350px',
                                    objectFit: 'cover',
                                    border: '4px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                            {/* Vòng tròn decal trang trí giảm giá đè lên ảnh */}
                            <div className="position-absolute d-flex flex-column align-items-center justify-content-center text-white font-weight-bold rounded-circle shadow-lg"
                                style={{
                                    top: '-10px',
                                    right: '20px',
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#E63946',
                                    border: '2px dashed #fff',
                                    transform: 'rotate(15deg)'
                                }}>
                                <span className="p-0 m-0" style={{ fontSize: '11px', lineHeight: '1' }}>GIẢM</span>
                                <span className="p-0 m-0" style={{ fontSize: '20px', lineHeight: '1' }}>30%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HeroBanner;
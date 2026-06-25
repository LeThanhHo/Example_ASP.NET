import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveBanners } from '../../services/bannerService';

// Đổi URL này theo domain backend thực tế của bạn (dùng để ghép ảnh /uploads/...)
const API_BASE_URL = 'https://localhost:7116';

function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Gọi service lấy banner đang active, đã sort theo DisplayOrder
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getActiveBanners();
                setBanners(data);
            } catch (err) {
                console.error('Lỗi tải banner:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Tự động chuyển banner mỗi 5 giây nếu có nhiều hơn 1 banner
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    // ── Trạng thái loading ──
    if (loading) {
        return (
            <div className="hero-banner-wrapper my-4 rounded shadow-sm overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0D2C54 0%, #1A4B83 100%)',
                    minHeight: '350px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Đang tải...</span>
                </div>
            </div>
        );
    }

    // ── Không có banner nào (API rỗng hoặc lỗi) → fallback giữ nguyên banner mặc định ──
    if (error || banners.length === 0) {
        return <DefaultBanner />;
    }

    const current = banners[activeIndex];

    return (
        <div className="hero-banner-wrapper my-4 rounded shadow-sm overflow-hidden position-relative"
            style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1A4B83 100%)',
                color: '#ffffff'
            }}>
            <div className="container py-5 px-4 px-md-5">
                <div className="row align-items-center">

                    {/* CỘT TRÁI: TIÊU ĐỀ TỪ BANNER + NÚT MUA HÀNG */}
                    <div className="col-lg-6 text-center text-lg-left mb-4 mb-lg-0">
                        <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-3"
                            style={{ backgroundColor: '#FF6B35', fontSize: '12px', letterSpacing: '1px' }}>
                            <i className="fas fa-bolt mr-1"></i> Khuyến mãi đặc biệt
                        </span>

                        <h1 className="display-4 font-weight-bold mb-3" style={{ fontSize: '2.2rem', lineHeight: '1.2' }}>
                            {current.title}
                        </h1>

                        <div className="d-flex justify-content-center justify-content-lg-start mb-4" style={{ fontSize: '13px' }}>
                            <span className="mr-3"><i className="fas fa-check-circle text-warning mr-1"></i> Đổi mới 7 ngày</span>
                            <span className="mr-3"><i className="fas fa-shield-alt text-warning mr-1"></i> Bảo hành toàn quốc</span>
                            <span><i className="fas fa-truck text-warning mr-1"></i> Ship COD tận xưởng</span>
                        </div>

                        <Link to={current.linkUrl || '/shop'}
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

                    {/* CỘT PHẢI: ẢNH BANNER LẤY TỪ API */}
                    <div className="col-lg-6 text-center">
                        <div className="position-relative p-3">
                            <img
                                key={current.id}
                                src={current.imageUrl?.startsWith('http')
                                    ? current.imageUrl
                                    : `${API_BASE_URL}${current.imageUrl}`}
                                alt={current.title}
                                className="img-fluid rounded shadow"
                                style={{
                                    maxHeight: '350px',
                                    width: '100%',
                                    objectFit: 'cover',
                                    border: '4px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Dấu chấm chỉ vị trí banner nếu có nhiều hơn 1 banner */}
            {banners.length > 1 && (
                <div className="d-flex justify-content-center pb-3" style={{ gap: '8px' }}>
                    {banners.map((b, idx) => (
                        <button
                            key={b.id}
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Chuyển tới banner ${idx + 1}`}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: idx === activeIndex ? '#FF6B35' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Banner mặc định — hiển thị khi API lỗi hoặc chưa có banner nào trong hệ thống
function DefaultBanner() {
    return (
        <div className="hero-banner-wrapper my-4 rounded shadow-sm overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1A4B83 100%)',
                color: '#ffffff'
            }}>
            <div className="container py-5 px-4 px-md-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 text-center text-lg-left mb-4 mb-lg-0">
                        <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-3"
                            style={{ backgroundColor: '#FF6B35', fontSize: '12px', letterSpacing: '1px' }}>
                            <i className="fas fa-bolt mr-1"></i> Tuần Lễ Vàng Kim Khí
                        </span>
                        <h1 className="display-4 font-weight-bold mb-3" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                            DỤNG CỤ CẦM TAY <br />
                            <span style={{ color: '#FF6B35' }}>CHÍNH HÃNG 100%</span>
                        </h1>
                        <p className="lead mb-4" style={{ fontSize: '16px', color: '#e0e6ed', opacity: 0.9 }}>
                            Bứt phá hiệu suất công việc với các dòng máy khoan pin lực siết khủng, máy cắt mài bền bỉ và bộ phụ kiện đá cắt, mũi khoan siêu cứng.
                        </p>
                        <Link to="/shop"
                            className="btn btn-lg font-weight-bold px-5 py-3"
                            style={{
                                backgroundColor: '#FF6B35',
                                borderColor: '#FF6B35',
                                color: '#fff',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}>
                            <i className="fas fa-shopping-bag mr-2"></i> KHÁM PHÁ NGAY
                        </Link>
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=60"
                            alt="Dụng cụ điện cơ khí cầm tay"
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: '350px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroBanner;

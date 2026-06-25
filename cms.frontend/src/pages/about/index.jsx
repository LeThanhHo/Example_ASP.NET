// src/pages/AboutPage.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ACCENT = '#FF6B35';
const NAVY = '#0D2C54';

const STATS = [
    { number: '12+', label: 'Năm kinh nghiệm' },
    { number: '8.500+', label: 'Khách hàng tin dùng' },
    { number: '350+', label: 'Sản phẩm chính hãng' },
    { number: '24/7', label: 'Hỗ trợ kỹ thuật' }
];

const VALUES = [
    {
        icon: 'fa-certificate',
        title: 'Chính hãng 100%',
        desc: 'Mọi sản phẩm đều có giấy tờ nhập khẩu rõ ràng, tem bảo hành chống giả từ nhà phân phối ủy quyền.'
    },
    {
        icon: 'fa-shield-alt',
        title: 'Bảo hành dài hạn',
        desc: 'Bảo hành 6–12 tháng tùy dòng sản phẩm, hỗ trợ đổi mới trong 7 ngày nếu lỗi kỹ thuật từ nhà sản xuất.'
    },
    {
        icon: 'fa-truck',
        title: 'Giao hàng tận xưởng',
        desc: 'Ship COD toàn quốc, kiểm tra hàng trước khi nhận. Giao nhanh trong 24h tại khu vực nội thành.'
    },
    {
        icon: 'fa-headset',
        title: 'Tư vấn kỹ thuật',
        desc: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng tư vấn chọn đúng máy, đúng nhu cầu công việc.'
    }
];

function AboutPage() {
    return (
        <div className="about-page">

            <Header />
            <div className="py-5" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1A4B83 100%)`, color: '#fff' }}>
                <div className="container py-4 text-center">
                    <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-3"
                        style={{ backgroundColor: ACCENT, fontSize: '11px', letterSpacing: '1px' }}>
                        <i className="fas fa-industry mr-1"></i> Từ 2014 đến nay
                    </span>
                    <h1 className="font-weight-bold mb-3" style={{ fontSize: '2.3rem' }}>
                        Đồng hành cùng người thợ Việt
                    </h1>
                    <p className="mx-auto mb-0" style={{ maxWidth: '640px', color: '#e0e6ed', fontSize: '16px' }}>
                        Chúng tôi cung cấp dụng cụ cầm tay chính hãng cho hàng nghìn xưởng cơ khí,
                        công trình và thợ sửa chữa trên toàn quốc — bền bỉ, đúng giá, đúng cam kết.
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="container">
                <div className="row text-center" style={{ marginTop: '-40px' }}>
                    {STATS.map((s, idx) => (
                        <div className="col-6 col-md-3 mb-3" key={idx}>
                            <div className="bg-white rounded shadow-sm py-4 h-100">
                                <div className="font-weight-bold" style={{ fontSize: '1.8rem', color: ACCENT }}>
                                    {s.number}
                                </div>
                                <div className="text-muted small">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CÂU CHUYỆN */}
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <img
                            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&auto=format&fit=crop&q=60"
                            alt="Xưởng cơ khí"
                            className="img-fluid rounded shadow-sm w-100"
                            style={{ maxHeight: '360px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-lg-6">
                        <span className="text-uppercase font-weight-bold small" style={{ color: ACCENT, letterSpacing: '1px' }}>
                            Câu chuyện của chúng tôi
                        </span>
                        <h2 className="font-weight-bold mb-3 mt-2" style={{ color: NAVY }}>
                            Bắt đầu từ một xưởng sửa máy nhỏ
                        </h2>
                        <p className="text-muted">
                            Năm 2014, chúng tôi khởi đầu là một xưởng sửa chữa máy cơ khí nhỏ.
                            Hiểu rõ nỗi đau của người thợ khi dùng dụng cụ kém chất lượng — vừa tốn tiền,
                            vừa mất thời gian sửa lại — chúng tôi quyết định tự nhập khẩu và phân phối
                            trực tiếp dụng cụ chính hãng, giá hợp lý cho cộng đồng thợ kỹ thuật Việt Nam.
                        </p>
                        <p className="text-muted mb-4">
                            Đến nay, chúng tôi đã đồng hành cùng hàng nghìn xưởng cơ khí, công trình xây dựng
                            và đội ngũ kỹ thuật trên toàn quốc, với cam kết: <strong>đúng hàng, đúng giá, đúng cam kết bảo hành.</strong>
                        </p>
                        <Link to="/shop"
                            className="btn font-weight-bold px-4 py-2"
                            style={{ backgroundColor: ACCENT, color: '#fff', borderRadius: '4px' }}>
                            <i className="fas fa-shopping-bag mr-2"></i> Xem sản phẩm
                        </Link>
                    </div>
                </div>
            </div>

            {/* GIÁ TRỊ CỐT LÕI */}
            <div className="py-5" style={{ backgroundColor: '#F7F8FA' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-uppercase font-weight-bold small" style={{ color: ACCENT, letterSpacing: '1px' }}>
                            Vì sao chọn chúng tôi
                        </span>
                        <h2 className="font-weight-bold mt-2" style={{ color: NAVY }}>Cam kết với khách hàng</h2>
                    </div>
                    <div className="row">
                        {VALUES.map((v, idx) => (
                            <div className="col-md-6 col-lg-3 mb-4" key={idx}>
                                <div className="bg-white rounded shadow-sm p-4 h-100 text-center">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255,107,53,0.1)' }}>
                                        <i className={`fas ${v.icon}`} style={{ color: ACCENT, fontSize: '22px' }}></i>
                                    </div>
                                    <h6 className="font-weight-bold mb-2" style={{ color: NAVY }}>{v.title}</h6>
                                    <p className="text-muted small mb-0">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA LIÊN HỆ */}
            <div className="py-5" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1A4B83 100%)`, color: '#fff' }}>
                <div className="container text-center">
                    <h3 className="font-weight-bold mb-2">Cần tư vấn chọn dụng cụ phù hợp?</h3>
                    <p className="mb-4" style={{ color: '#e0e6ed' }}>
                        Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn chọn đúng sản phẩm cho công việc.
                    </p>
                    <a href="tel:0900000000"
                        className="btn font-weight-bold px-4 py-2 mr-2"
                        style={{ backgroundColor: ACCENT, color: '#fff', borderRadius: '4px' }}>
                        <i className="fas fa-phone-alt mr-2"></i> Gọi ngay: 0900 000 000
                    </a>
                    <Link to="/shop"
                        className="btn btn-outline-light font-weight-bold px-4 py-2"
                        style={{ borderRadius: '4px' }}>
                        Xem sản phẩm
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutPage;

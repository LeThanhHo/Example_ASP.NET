import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    // Định nghĩa màu xám sáng bảo vệ chữ không bị chìm trên nền tối
    const lightTextColor = { color: '#caeed8' }; // Màu trắng xám dễ đọc
    const linkColor = { color: '#a0aab5' };     // Màu link xám kỹ thuật

    return (
        <footer className="main-footer-wrapper text-light pt-5 mt-5 border-top" style={{ backgroundColor: '#1e2229', borderTopColor: '#343a40' }}>

            <div className="container pb-4">
                <div className="row">

                    {/* CỘT 1: GIỚI THIỆU TIỆM MÁY CƠ KHÍ & ĐIỆN CẦM TAY */}
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <h4 className="font-weight-bold mb-3" style={{ color: '#FF6B35', letterSpacing: '0.5px' }}>
                            <i className="fas fa-tools mr-2"></i>LeThanhHo<span className="text-white">.Tools</span>
                        </h4>
                        <p className="text-justify pr-md-3" style={{ fontSize: '14px', lineHeight: '1.6', color: '#ced4da' }}>
                            Siêu thị bán lẻ dụng cụ điện cầm tay và phụ kiện kim khí chất lượng cao. Chuyên phân phối các dòng máy khoan pin, máy cắt sắt, máy mài góc chính hãng cùng hệ thống vật tư tiêu hao như đá cắt mài, mũi khoan siêu cứng phục vụ đắc lực cho anh em thợ và xưởng cơ khí.
                        </p>
                    </div>

                    {/* CỘT 2: DANH MỤC MÁY & PHỤ KIỆN */}
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 pl-lg-4">
                        <div className="row">
                            {/* Nhóm Thiết Bị */}
                            <div className="col-6">
                                <h5 className="font-weight-bold mb-3 text-uppercase border-left pl-2" style={{ borderLeftColor: '#FF6B35', borderLeftWidth: '3px', fontSize: '14px', color: '#fff' }}>
                                    Dụng Cụ Điện
                                </h5>
                                <ul className="list-unstyled" style={{ fontSize: '13px' }}>
                                    <li className="mb-2"><Link to="/shop?category=khoan" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Máy khoan pin/điện</Link></li>
                                    <li className="mb-2"><Link to="/shop?category=cat" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Máy cắt sắt/gỗ</Link></li>
                                    <li className="mb-2"><Link to="/shop?category=mai" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Máy mài cầm tay</Link></li>
                                    <li className="mb-2"><Link to="/shop?category=bao" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Máy bào gỗ điện</Link></li>
                                </ul>
                            </div>
                            {/* Nhóm Phụ Kiện */}
                            <div className="col-6">
                                <h5 className="font-weight-bold mb-3 text-uppercase border-left pl-2" style={{ borderLeftColor: '#FF6B35', borderLeftWidth: '3px', fontSize: '14px', color: '#fff' }}>
                                    Phụ Kiện
                                </h5>
                                <ul className="list-unstyled" style={{ fontSize: '13px' }}>
                                    <li className="mb-2"><Link to="/shop?category=muikhoan" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Mũi khoan đa năng</Link></li>
                                    <li className="mb-2"><Link to="/shop?category=dacat" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Đá cắt & Đá mài</Link></li>
                                    <li className="mb-2"><Link to="/shop?category=luoicat" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Lưỡi cắt hợp kim</Link></li>
                                    <li className="mb-2"><Link to="/policy/warranty" className="text-decoration-none" style={linkColor} onMouseOver={(e) => e.target.style.color = '#FF6B35'} onMouseOut={(e) => e.target.style.color = '#a0aab5'}>Chính sách bảo hành</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CỘT 3: THÔNG TIN CỬA HÀNG & CHỈ ĐƯỜNG LIÊN HỆ */}
                    <div className="col-lg-4 col-md-12">
                        <h5 className="font-weight-bold mb-3 text-uppercase border-left pl-2" style={{ borderLeftColor: '#FF6B35', borderLeftWidth: '3px', fontSize: '15px', color: '#fff' }}>
                            Thông Tin Liên Hệ
                        </h5>
                        <ul className="list-unstyled mb-0" style={{ fontSize: '14px', lineHeight: '1.8', color: '#ced4da' }}>
                            <li className="mb-2 d-flex align-items-start">
                                <i className="fas fa-store text-warning mr-2 mt-1" style={{ width: '15px' }}></i>
                                <span><strong>Địa chỉ:</strong> Phường Linh Xuân, Thành phố Thủ Đức, Hồ Chí Minh</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <i className="fas fa-phone-alt text-warning mr-2" style={{ width: '15px' }}></i>
                                <span><strong>Hotline thử máy:</strong> <span style={{ color: '#FF6B35', fontWeight: 'bold' }}>0398820547</span></span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <i className="fas fa-truck-moving text-warning mr-2" style={{ width: '15px' }}></i>
                                <span><strong>Vận chuyển:</strong> Nhận hàng - Kiểm tra máy - Thanh toán</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* PHẦN 2: THANH BẢN QUYỀN (COPYRIGHT BAR) */}
            <div className="copyright-bar py-3 mt-4" style={{ backgroundColor: '#13161a', borderTop: '1px solid #2a2f38' }}>
                <div className="container text-center">
                    <p className="m-0" style={{ fontSize: '13px', color: '#868e96' }}>
                        &copy; {new Date().getFullYear()} <strong style={{ color: '#FF6B35' }}>LeThanhHo Tools Store</strong>. Hệ thống quản lý bán hàng thiết bị và linh kiện kim khí cơ khí.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
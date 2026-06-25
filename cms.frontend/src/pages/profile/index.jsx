// src/pages/profile/index.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerProfilePage() {
    const customerId = localStorage.getItem('customerId');
    const customerName = localStorage.getItem('customerName') || 'Khách hàng';

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // 'all', '0', '1', '2'
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Quản lý đóng mở thông minh
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    // State phục vụ form đổi mật khẩu kỹ thuật
    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [pwdSuccess, setPwdSuccess] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);

    const [accountInfo] = useState({
        role: "Khách hàng (Thợ cơ khí)",
        status: "Đang hoạt động",
        loginTime: new Date().toLocaleTimeString('vi-VN') + " " + new Date().toLocaleDateString('vi-VN')
    });

    useEffect(() => {
        if (!customerId) {
            setErrorMsg("Bạn chưa đăng nhập hệ thống! Vui lòng quay lại trang đăng nhập.");
            setLoading(false);
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                const res = await axios.get(`https://localhost:7116/api/CustomerOrdersApi/history/${customerId}`);
                let data = [];
                if (Array.isArray(res.data)) {
                    data = res.data;
                } else if (res.data.data) {
                    data = res.data.data;
                }
                setOrders(data);
                setFilteredOrders(data);
            } catch (err) {
                console.error("Lỗi bốc lịch sử đơn hàng:", err);
                setErrorMsg("Không thể tải lịch sử mua hàng từ hệ thống Backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [customerId]);

    // Bộ lọc thông minh chuyển trạng thái tab đơn hàng
    const handleTabChange = (tabType) => {
        setActiveTab(tabType);
        if (tabType === 'all') {
            setFilteredOrders(orders);
        } else {
            const statusNumber = parseInt(tabType, 10);
            setFilteredOrders(orders.filter(o => o.status === statusNumber));
        }
        setExpandedOrderId(null);
    };

    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const totalSpent = orders.filter(o => o.status === 2).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 0).length;

    const renderStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="badge bg-warning text-white text-uppercase py-1.5 px-2.5 rounded-pill" style={{ fontSize: '10.5px', letterSpacing: '0.3px' }}><i className="fas fa-clock mr-1"></i> Chờ duyệt</span>;
            case 1:
                return <span className="badge bg-primary text-white text-uppercase py-1.5 px-2.5 rounded-pill" style={{ fontSize: '10.5px', letterSpacing: '0.3px' }}><i className="fas fa-truck mr-1"></i> Đang giao</span>;
            case 2:
                return <span className="badge bg-success text-white text-uppercase py-1.5 px-2.5 rounded-pill" style={{ fontSize: '10.5px', letterSpacing: '0.3px' }}><i className="fas fa-check-circle mr-1"></i> Hoàn tất</span>;
            default:
                return <span className="badge bg-secondary text-white rounded-pill py-1.5 px-2.5">Không rõ</span>;
        }
    };

    if (!customerId) {
        return (
            <div className="container my-5 py-5 text-center">
                <div className="alert alert-danger d-inline-block px-4 py-3 shadow-sm">{errorMsg}</div>
            </div>
        );
    }

    return (
        <>
            <div className="container my-4 py-2">
                {/* ── TIÊU ĐỀ CHÀO HỒ LÊ TRÊN CÙNG ── */}
                <div className="p-4 rounded-3 shadow-sm border-0 mb-4 text-white d-flex align-items-center justify-content-between position-relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                    <div style={{ zIndex: 2 }}>
                        <h3 className="font-weight-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
                            Chào, {customerName} 👋
                        </h3>
                        <p className="mb-0 text-white-50 small">Chào mừng thợ đối tác trở lại xưởng điều hành trực tuyến.</p>
                    </div>
                    <div className="text-right d-none d-sm-block" style={{ zIndex: 2 }}>
                        <span className="badge bg-blur px-3 py-2 border rounded border-white-10 font-weight-bold text-warning" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '13px' }}>
                            Mã đối tác: #{customerId}
                        </span>
                    </div>
                </div>

                <div className="row">
                    {/* ── KHỐI 1: THÔNG TIN TÀI KHOẢN & ĐỔI MẬT KHẨU ── */}
                    <div className="col-12 col-lg-4 mb-4">
                        <div className="card shadow-sm border-0 bg-white">
                            <div className="card-body p-4" style={{ fontSize: '14px' }}>
                                <div className="text-center mb-3">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-soft-primary font-weight-bold rounded-circle shadow-sm"
                                        style={{ width: '64px', height: '64px', fontSize: '24px', background: '#f0f4f9', color: '#0D2C54', border: '2px solid #0D2C54' }}>
                                        {customerName.substring(0, 1).toUpperCase()}
                                    </div>
                                    <h6 className="font-weight-bold text-dark mt-2 mb-1">{customerName}</h6>
                                    <span className="badge bg-success-subtle text-success border px-2 py-1 rounded-pill small" style={{ fontSize: '11px' }}>
                                        <i className="fas fa-circle mr-1" style={{ fontSize: '7px' }}></i> {accountInfo.status}
                                    </span>
                                </div>

                                <hr className="my-3 opacity-10" />

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Vai trò tài khoản:</span>
                                    <span className="font-weight-semibold text-dark">{accountInfo.role}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Phiên kết nối:</span>
                                    <span className="text-secondary font-italic small">{accountInfo.loginTime.split(' ')[0]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Form đổi mật khẩu kỹ thuật trực quan */}
                        <div className="card shadow-sm border-0 bg-white mt-4">
                            <div className="card-header bg-transparent border-bottom py-3">
                                <h6 className="m-0 font-weight-bold text-dark text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                                    <i className="fas fa-lock text-warning mr-2"></i> Đổi mật khẩu kỹ thuật
                                </h6>
                            </div>
                            <div className="card-body p-3">
                                {pwdError && <div className="alert alert-danger small py-1.5 px-2">{pwdError}</div>}
                                {pwdSuccess && <div className="alert alert-success small py-1.5 px-2">{pwdSuccess}</div>}

                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setPwdError('');
                                    setPwdSuccess('');

                                    if (pwdData.newPassword !== pwdData.confirmPassword) {
                                        setPwdError("Mật khẩu mới nhập lại không trùng khớp!");
                                        return;
                                    }
                                    if (pwdData.newPassword.length < 6) {
                                        setPwdError("Mật khẩu mới phải từ 6 ký tự trở lên!");
                                        return;
                                    }

                                    setPwdLoading(true);
                                    try {
                                        await axios.post('https://localhost:7116/api/AuthApi/change-password', {
                                            customerId: parseInt(customerId, 10),
                                            oldPassword: pwdData.oldPassword,
                                            newPassword: pwdData.newPassword
                                        });
                                        setPwdSuccess("Đã đổi mật khẩu thành công!");
                                        setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                    } catch (err) {
                                        setPwdError(err.response?.data?.message || "Lỗi cập nhật mật khẩu!");
                                    } finally {
                                        setPwdLoading(false);
                                    }
                                }}>
                                    <div className="form-group mb-2">
                                        <label className="text-muted small mb-1" style={{ fontSize: '11px' }}>Mật khẩu hiện tại</label>
                                        <input type="password" className="form-control form-control-sm" required value={pwdData.oldPassword} onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })} placeholder="••••••••" />
                                    </div>
                                    <div className="form-group mb-2">
                                        <label className="text-muted small mb-1" style={{ fontSize: '11px' }}>Mật khẩu mới</label>
                                        <input type="password" className="form-control form-control-sm" required value={pwdData.newPassword} onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })} placeholder="Tối thiểu 4 ký tự" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="text-muted small mb-1" style={{ fontSize: '11px' }}>Nhập lại mật khẩu mới</label>
                                        <input type="password" className="form-control form-control-sm" required value={pwdData.confirmPassword} onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })} placeholder="••••••••" />
                                    </div>
                                    <button type="submit" className="btn btn-sm btn-block text-white font-weight-bold w-100 py-2 text-uppercase" style={{ backgroundColor: '#0D2C54', fontSize: '12px' }} disabled={pwdLoading}>
                                        {pwdLoading ? 'Đang lưu...' : 'Xác nhận thay đổi'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Thống kê mua sắm nhỏ */}
                        <div className="card shadow-sm border-0 bg-white p-3 mt-4">
                            <h6 className="font-weight-bold text-secondary text-uppercase small mb-3" style={{ letterSpacing: '0.5px' }}>Hiệu suất mua sắm</h6>
                            <div className="row g-2">
                                <div className="col-6 text-center border-right">
                                    <span className="text-muted small d-block">Đã mua tổng</span>
                                    <h5 className="font-weight-bold text-success m-0 mt-1" style={{ fontSize: '14px' }}>{formatPrice(totalSpent)}</h5>
                                </div>
                                <div className="col-6 text-center">
                                    <span className="text-muted small d-block">Đơn chờ duyệt</span>
                                    <h5 className="font-weight-bold text-warning m-0 mt-1" style={{ fontSize: '14px' }}>{pendingCount} đơn</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── KHỐI 2: LỊCH SỬ ĐƠN HÀNG VÀ BỘ LỌC TAB TẤT CẢ ── */}
                    <div className="col-12 col-lg-8 mb-4">
                        <div className="card shadow-sm border-0 bg-white">
                            <div className="card-header bg-transparent border-bottom pt-3 pb-0">
                                <ul className="nav nav-tabs border-bottom-0" style={{ gap: '5px' }}>
                                    <li className="nav-item">
                                        <button className={`nav-link border-0 py-2.5 font-weight-bold small ${activeTab === 'all' ? 'active text-primary border-bottom-primary' : 'text-muted'}`} onClick={() => handleTabChange('all')}>Tất cả ({orders.length})</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link border-0 py-2.5 font-weight-bold small ${activeTab === '0' ? 'active text-warning' : 'text-muted'}`} onClick={() => handleTabChange('0')}>Chờ duyệt</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link border-0 py-2.5 font-weight-bold small ${activeTab === '1' ? 'active text-primary' : 'text-muted'}`} onClick={() => handleTabChange('1')}>Đang giao</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link border-0 py-2.5 font-weight-bold small ${activeTab === '2' ? 'active text-success' : 'text-muted'}`} onClick={() => handleTabChange('2')}>Hoàn tất</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5 text-muted small">
                                        <div className="spinner-border spinner-border-sm text-primary mr-2" role="status"></div>
                                        Đang đồng bộ hóa hóa đơn vật tư...
                                    </div>
                                ) : errorMsg ? (
                                    <div className="p-3 text-center text-danger small">{errorMsg}</div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="text-center py-5 text-muted bg-light" style={{ fontSize: '14px' }}>
                                        <i className="fas fa-box-open d-block h3 text-muted mb-2"></i>
                                        Không tìm thấy dữ liệu đơn hàng nào thuộc bộ lọc này.
                                    </div>
                                ) : (
                                    <div className="order-list-wrapper">
                                        {filteredOrders.map((order) => {
                                            const isExpanded = expandedOrderId === order.id;
                                            return (
                                                <div className="border-bottom transition-all" key={order.id} style={{ background: isExpanded ? '#f8fafc' : '#fff' }}>
                                                    <div className="p-3 d-flex flex-wrap align-items-center justify-content-between" onClick={() => toggleOrderDetails(order.id)} style={{ cursor: 'pointer', gap: '10px' }}>
                                                        <div>
                                                            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                                                                <strong className="text-dark">Đơn hàng #{order.id}</strong>
                                                                {renderStatusBadge(order.status)}
                                                            </div>
                                                            <span className="text-muted small mt-0.5 d-block" style={{ fontSize: '12px' }}>
                                                                Giá trị thiết bị: <strong className="text-danger font-weight-bold">{formatPrice(order.totalAmount)}</strong>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <i className={`fas ${isExpanded ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-muted'} small`}></i>
                                                        </div>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="px-3 pb-3 pt-1 animate-fade-in">
                                                            <div className="table-responsive bg-white rounded border shadow-sm">
                                                                <table className="table table-sm table-borderless m-0 style-table">
                                                                    <thead className="bg-light text-secondary border-bottom" style={{ fontSize: '11.5px' }}>
                                                                        <tr>
                                                                            <th className="p-2.5 ps-3">Tên linh kiện / Thiết bị cơ khí</th>
                                                                            <th className="p-2.5 text-center" style={{ width: '80px' }}>SL</th>
                                                                            <th className="p-2.5 text-right pe-3" style={{ width: '130px' }}>Đơn giá</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.items && order.items.map((item) => (
                                                                            <tr className="border-bottom border-light" key={item.productId}>
                                                                                <td className="p-2.5 ps-3 text-dark fw-medium">{item.productName}</td>
                                                                                <td className="p-2.5 text-center text-dark font-weight-bold">{item.quantity} máy</td>
                                                                                <td className="p-2.5 text-right font-weight-bold text-secondary pe-3">{formatPrice(item.unitPrice)}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            {order.notes && (
                                                                <div className="text-muted small mt-2 px-2 py-1.5 rounded bg-white border border-dashed">
                                                                    <i className="fas fa-comment-dots mr-1.5 text-secondary"></i>
                                                                    Ghi chú: <span className="font-italic">"{order.notes}"</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .border-bottom-primary { border-bottom: 2px solid #2563eb !important; }
                .bg-success-subtle { background-color: #f0fdf4; }
                .text-success { color: #16a34a !important; }
                .border-right { border-right: 1px solid #e2e8f0; }
                .animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-3px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}

export default CustomerProfilePage;
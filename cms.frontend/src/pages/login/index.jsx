// src/pages/login/index.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await axios.post('https://localhost:7116/api/AuthApi/login', credentials);

            // 🔒 BẪY BẢO MẬT FRONTEND: Kiểm tra xem tài khoản đăng nhập có phải "Khách hàng" hay không
            if (res.data.role !== "Khách hàng") {
                setErrorMsg("Tài khoản quản trị viên không được dùng để mua sắm. Vui lòng dùng tài khoản Khách hàng!");
                setLoading(false);
                return;
            }

            // Nếu chuẩn vai trò Khách hàng -> Tiến hành lưu trạng thái mua hàng
            localStorage.setItem('customerId', res.data.customerId);
            localStorage.setItem('customerName', res.data.fullName);

            // Điều hướng về trang chủ mua sắm dụng cụ
            window.location.href = "/";
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu bẫy bảo mật!');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container my-5 d-flex justify-content-center py-5">
            <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }}>
                <h3 className="text-center font-weight-bold mb-4" style={{ color: '#0D2C54' }}>
                    <i className="fas fa-sign-in-alt mr-2 text-warning"></i>ĐĂNG NHẬP THỢ
                </h3>

                {errorMsg && <div className="alert alert-danger small py-2">{errorMsg}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label className="form-label font-weight-bold small">Email đăng nhập</label>
                        <input type="email" name="email" className="form-control form-control-sm" required onChange={handleChange} placeholder="name@example.com" />
                    </div>
                    <div className="form-group mb-4">
                        <label className="form-label font-weight-bold small">Mật khẩu kỹ thuật</label>
                        <input type="password" name="password" className="form-control form-control-sm" required onChange={handleChange} placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn btn-block text-white font-weight-bold text-uppercase py-2" style={{ backgroundColor: '#0D2C54' }} disabled={loading}>
                        {loading ? 'Đang xác thực...' : 'Vào hệ thống'}
                    </button>
                </form>
                <div className="text-center mt-3 small">
                    Chưa có tài khoản? <Link to="/register" className="text-decoration-none font-weight-bold" style={{ color: '#FF6B35' }}>Đăng ký thành viên</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
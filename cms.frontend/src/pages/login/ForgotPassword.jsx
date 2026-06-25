// src/pages/login/ForgotPassword.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [generatedPwd, setGeneratedPwd] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setMessage('');
        setGeneratedPwd('');

        try {
            const res = await axios.post('https://localhost:7116/api/AuthApi/forgot-password', { email });

            // Xử lý khi Backend cấp mật khẩu mới thành công
            setMessage(res.data.message);
            setGeneratedPwd(res.data.newPassword); // Lấy mật khẩu mới hiển thị thẳng ra màn hình
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Đã xảy ra lỗi kết nối bẫy bảo mật hệ thống!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5 d-flex justify-content-center py-5">
            <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '420px', width: '100%', borderRadius: '8px' }}>
                <h4 className="text-center font-weight-bold mb-3" style={{ color: '#0D2C54' }}>
                    <i className="fas fa-key mr-2 text-warning"></i>KHÔI PHỤC MẬT KHẨU
                </h4>
                <p className="text-muted text-center small mb-4">Nhập email thợ của bạn, hệ thống sẽ xác thực và cấp lại mật khẩu kỹ thuật mới ngay lập tức.</p>

                {errorMsg && <div className="alert alert-danger small py-2">{errorMsg}</div>}

                {/* Khối thông báo thành công rực rỡ kèm mật khẩu mới */}
                {message && (
                    <div className="alert alert-success small py-3 text-center">
                        <p className="mb-1 text-dark font-weight-bold">{message}</p>
                        <div className="p-2 bg-white rounded border border-success my-2">
                            Mật khẩu mới của bạn là: <strong className="text-danger h5 m-0 font-weight-bold d-block mt-1">{generatedPwd}</strong>
                        </div>
                        <small className="text-muted font-italic">Hãy lưu lại và đổi mật khẩu ngay sau khi đăng nhập thành công!</small>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label className="form-label font-weight-bold small">Email đăng nhập tài khoản thợ</label>
                        <input
                            type="email"
                            className="form-control form-control-sm"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn btn-block text-white font-weight-bold text-uppercase py-2" style={{ backgroundColor: '#0D2C54' }} disabled={loading}>
                        {loading ? 'Đang xác thực hệ thống...' : 'Cấp lại mật khẩu'}
                    </button>
                </form>

                <div className="text-center mt-4 small">
                    <Link to="/login" className="text-decoration-none font-weight-bold" style={{ color: '#FF6B35' }}>
                        <i className="fas fa-arrow-left mr-1"></i> Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
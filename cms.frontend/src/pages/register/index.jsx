// src/pages/register/index.jsx
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const response = await axios.post('https://localhost:7116/api/AuthApi/register', formData);
            setMsg({ type: 'success', text: response.data.message || 'Đăng ký tài khoản cơ khí thành công!' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMsg({
                type: 'danger',
                text: error.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký thành viên.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5 d-flex justify-content-center">
            <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '500px', width: '100%', borderRadius: '8px' }}>
                <h3 className="text-center font-weight-bold mb-4" style={{ color: '#0D2C54' }}>
                    <i className="fas fa-user-plus mr-2 text-warning"></i>ĐĂNG KÝ THÀNH VIÊN
                </h3>

                {msg.text && <div className={`alert alert-${msg.type} small`}>{msg.text}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="form-label font-weight-bold small">Họ và tên <span className="text-danger">*</span></label>
                        <input type="text" name="fullName" className="form-control form-control-sm" required onChange={handleChange} placeholder="Nhập họ tên thợ/đối tác..." />
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label font-weight-bold small">Email tài khoản <span className="text-danger">*</span></label>
                        <input type="email" name="email" className="form-control form-control-sm" required onChange={handleChange} placeholder="example@gmail.com" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group mb-3">
                            <label className="form-label font-weight-bold small">Số điện thoại</label>
                            <input type="text" name="phone" className="form-control form-control-sm" onChange={handleChange} placeholder="09xxx..." />
                        </div>
                        <div className="col-md-6 form-group mb-3">
                            <label className="form-label font-weight-bold small">Mật khẩu <span className="text-danger">*</span></label>
                            <input type="password" name="password" className="form-control form-control-sm" required onChange={handleChange} placeholder="••••••••" />
                        </div>
                    </div>
                    <div className="form-group mb-4">
                        <label className="form-label font-weight-bold small">Địa chỉ nhận thiết bị vật tư</label>
                        <input type="text" name="address" className="form-control form-control-sm" onChange={handleChange} placeholder="Số nhà, đường, Thủ Đức, HCM..." />
                    </div>

                    <button type="submit" className="btn btn-warning btn-block text-white font-weight-bold text-uppercase py-2" disabled={loading}>
                        {loading ? 'Đang khởi tạo...' : 'Kích hoạt tài khoản'}
                    </button>
                </form>
                <div className="text-center mt-3 small">
                    Đã có tài khoản? <Link to="/login" className="text-decoration-none font-weight-bold" style={{ color: '#FF6B35' }}>Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
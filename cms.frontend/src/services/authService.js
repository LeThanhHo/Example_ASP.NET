// src/services/authService.js
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import axiosClient from '../api/axiosClient'; // Hoặc import axios thuần tùy dự án bạn setup

const API_URL = 'https://localhost:7116/api/AuthApi';

const authService = {
    /**
     * Gửi yêu cầu đăng ký tài khoản Customer mới về SQL Server
     * @param {Object} customerData - Chứa fullName, email, phone, address, password
     */
    register: async (customerData) => {
        try {
            const response = await axiosClient.post(`${API_URL}/register`, customerData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi tại authService.register:", error);
            throw error;
        }
    },

    /**
     * Gửi thông tin email/password thô để xác thực đăng nhập
     * @param {Object} credentials - Chứa email và password
     */
    login: async (credentials) => {
        try {
            const response = await axiosClient.post(`${API_URL}/login`, credentials);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi tại authService.login:", error);
            throw error;
        }
    },

    /**
     * Đăng xuất: Xóa toàn bộ vết tài khoản khỏi bộ nhớ máy trình duyệt
     */
    logout: () => {
        localStorage.removeItem('customerId');
        localStorage.removeItem('customerName');
        // Ép tải lại trang chủ để thanh Header cập nhật lại trạng thái nút Đăng nhập
        window.location.href = "/";
    },

    /**
     * Kiểm tra nhanh trạng thái xem khách hiện tại đã đăng nhập hay chưa
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const customerId = localStorage.getItem('customerId');
        return customerId !== null && customerId !== undefined && customerId !== '';
    }
};

export default authService;
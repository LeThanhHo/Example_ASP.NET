// src/services/cartService.js
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import axiosClient from '../api/axiosClient';

const API_URL = 'https://localhost:7116/api/CartApi';

const cartService = {
    /**
     * Lấy danh sách sản phẩm hiện có trong giỏ hàng lưu ở máy
     */
    getCartItems: () => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    /**
     * Thêm một thiết bị/linh kiện mới vào giỏ hàng
     * @param {Object} product - Đối tượng sản phẩm cơ khí
     */
    addToCart: (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Tìm xem sản phẩm này đã có trong giỏ hàng chưa
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            existingItem.quantity += 1; // Có rồi thì tăng số lượng lên 1 máy
        } else {
            // Chưa có thì đẩy object mới vào (Ghi nhận thông tin hiển thị nhanh)
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Đã thêm thành công thiết bị [${product.name}] vào giỏ vật tư!`);
    },

    /**
     * Gửi yêu cầu chốt hóa đơn đơn hàng sang API Backend C#
     * Ràng buộc: Bắt buộc kèm CustomerId hợp lệ
     * @param {string} notes - Ghi chú giao hàng (Thủ Đức, HCM...)
     */
    checkout: async (notes = '') => {
        const customerId = localStorage.getItem('customerId');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // 🔒 RÀNG BUỘC PHÍA CLIENT: Chặn ngay nếu phát hiện khách mồ côi tài khoản
        if (!customerId) {
            throw new Error("Bạn bắt buộc phải đăng nhập tài khoản thành viên để thực hiện thanh toán hóa đơn vật tư!");
        }

        if (cart.length === 0) {
            throw new Error("Giỏ hàng của bạn đang trống. Không thể tiến hành thanh toán!");
        }

        // Cấu trúc chuẩn hóa Payload DTO tương thích 100% với CartCheckoutDto bên C#
        const payload = {
            customerId: Number(customerId),
            notes: notes,
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        };

        try {
            const response = await axiosClient.post(`${API_URL}/checkout`, payload);

            // Nếu lưu database C# thành công -> Xóa giỏ hàng offline ở máy khách
            localStorage.removeItem('cart');

            return response.data || response;
        } catch (error) {
            console.error("Lỗi tại cartService.checkout:", error);
            throw error;
        }
    }
};

export default cartService;
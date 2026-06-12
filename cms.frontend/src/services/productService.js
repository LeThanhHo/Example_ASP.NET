// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * 1. Lấy danh sách toàn bộ sản phẩm thời trang (hoặc theo bộ lọc)
     * API Endpoint: GET https://localhost:xxxx/api/Products
     */
    getAllProducts: async () => {
        try {
            // Thực hiện gọi API GET để lấy danh sách sản phẩm
            const response = await axiosClient.get('/Products');

            // Trả về mảng dữ liệu sản phẩm
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            throw error; // Đẩy lỗi ra ngoài để component ProductGrid bắt được và xử lý giao diện
        }
    },
    /**
      * Lấy danh sách sản phẩm (Có hỗ trợ lọc theo đường dẫn danh mục của bạn)
      * @param {number|null} categoryId - ID của danh mục cần lọc
      */
    getAllProducts: async (categoryId = null) => {
        try {
            // 💡 ĐÃ SỬA: Nếu có ID thì gọi đúng chuẩn /Products/category/1
            // Nếu không có ID (null) thì gọi toàn bộ sản phẩm /Products
            const url = categoryId ? `/Products/category/${categoryId}` : '/Products';

            const response = await axiosClient.get(url);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi hệ thống khi gọi API getAllProducts:", error);
            throw error;
        }
    },

    /**
     * 2. Lấy thông tin chi tiết của một sản phẩm theo ID
     * API Endpoint: GET https://localhost:xxxx/api/Products/{id}
     */
    getProductById: async (id) => {
        try {
            // axiosClient đã có baseURL là https://localhost:7116/api
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            throw error;
        }
    }
};


// CRITICAL: Xuất mặc định đối tượng này để file ProductGrid.jsx import vào không bị lỗi 'default was not found'
export default productService;

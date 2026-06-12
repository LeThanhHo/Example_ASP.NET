import React, { useState, useEffect } from 'react';
// Import dịch vụ gọi API danh mục sản phẩm đã thiết lập ở Buổi 7
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu() {
    // 1. Khai báo State để lưu mảng danh mục sản phẩm từ SQL Server đổ về
    const [categories, setCategories] = useState([]);

    // 2. Khai báo State để theo dõi danh mục nào đang được người dùng bấm chọn (Mặc định là chọn tất cả - null)
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    // 3. Khai báo State quản lý trạng thái Loading dữ liệu mạng
    const [loading, setLoading] = useState(true);

    // 4. Gọi API ngay khi file thành phần component Tầng 3 được nạp lên trang chủ
    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();

                // 💡 KỸ THUẬT ÉP MẢNG AN TOÀN TRÁNH SẬP GIAO DIỆN
                let dataArray = [];

                if (Array.isArray(response)) {
                    dataArray = response;
                } else if (response && Array.isArray(response.data)) {
                    dataArray = response.data;
                } else if (response && response.$values && Array.isArray(response.$values)) {
                    dataArray = response.$values;
                } else if (typeof response === 'object' && response !== null) {
                    const foundArray = Object.values(response).find(val => Array.isArray(val));
                    if (foundArray) dataArray = foundArray;
                }

                setCategories(dataArray);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
                setCategories([]); // Nếu lỗi, gán mảng rỗng để không bị sập giao diện
            } finally {
                setLoading(false);
            }
        };

        fetchMenuCategories();
    }, []);

    // 5. Hàm xử lý khi khách hàng click chọn một danh mục máy móc/phụ kiện cụ thể
    const handleCategoryClick = (id) => {
        setActiveCategoryId(id);
        // Điểm mở rộng đồ án: Đây là nơi sinh viên sẽ viết logic truyền Id này sang
        // để ép file thành phần component <ProductGrid /> (Tầng 4) tải lại sản phẩm theo bộ lọc.
        console.log(`Sinh viên LeThanhHo sẽ xử lý lọc thiết bị cho danh mục có ID: ${id}`);
    };

    // Kịch bản giao diện tạm thời trong lúc hệ thống đang tải dữ liệu mạng cơ khí
    if (loading) {
        return (
            <div className="container my-3 text-center">
                <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp danh mục thiết bị...</span>
            </div>
        );
    }

    return (
        <section id="category-menu-section" className="category-menu-wrapper my-4">
            <div className="container">
                <div className="card shadow-sm border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <div className="card-body p-2 bg-white">

                        {/* Sử dụng cấu trúc Flexbox Nav của Bootstrap để dàn ngang menu các loại máy */}
                        <ul className="nav nav-pills nav-fill flex-column flex-sm-row">

                            {/* Nút mặc định: Xem tất cả máy móc & phụ kiện */}
                            <li className="nav-item m-1">
                                <button
                                    className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === null ? 'active text-white' : 'text-secondary bg-transparent'}`}
                                    style={{
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        backgroundColor: activeCategoryId === null ? '#0D2C54' : 'transparent',
                                        transition: '0.3s'
                                    }}
                                    onClick={() => handleCategoryClick(null)}
                                >
                                    <i className="fas fa-boxes mr-2"></i> Tất cả sản phẩm
                                </button>
                            </li>

                            {/* VÒNG LẶP ĐỘNG: Duyệt mảng từ SQL Server sinh ra nút phân loại (Máy khoan, máy cắt, đá cắt,...) */}
                            {categories.map((cat) => (
                                <li className="nav-item m-1" key={cat.id || cat.categoryId || cat.categoryProductId}>
                                    <button
                                        className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === (cat.id || cat.categoryId) ? 'active text-white' : 'text-secondary bg-transparent'}`}
                                        style={{
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            backgroundColor: activeCategoryId === (cat.id || cat.categoryId) ? '#FF6B35' : 'transparent',
                                            color: activeCategoryId === (cat.id || cat.categoryId) ? '#fff' : '#495057',
                                            transition: '0.3s'
                                        }}
                                        onClick={() => handleCategoryClick(cat.id || cat.categoryId)}
                                    >
                                        <i className="fas fa-wrench mr-2" style={{ fontSize: '12px', opacity: 0.7 }}></i>
                                        {cat.name || cat.categoryName || cat.categoryProductName}
                                    </button>
                                </li>
                            ))}

                        </ul>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
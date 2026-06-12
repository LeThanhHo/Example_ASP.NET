import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

// 💡 ĐÃ CẬP NHẬT: Nhận activeCategoryId và hàm callback từ Component Cha truyền xuống
function CategoryMenu({ activeCategoryId, onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();

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
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuCategories();
    }, []);

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
                                    onClick={() => onCategoryChange(null)} // 💡 Đẩy giá trị null lên cho cha
                                >
                                    <i className="fas fa-boxes mr-2"></i> Tất cả sản phẩm
                                </button>
                            </li>

                            {/* VÒNG LẶP ĐỘNG: Duyệt mảng từ SQL Server sinh ra nút phân loại */}
                            {categories.map((cat) => {
                                const currentId = cat.id || cat.categoryId;
                                return (
                                    <li className="nav-item m-1" key={cat.id || cat.categoryId || cat.categoryProductId}>
                                        <button
                                            className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === currentId ? 'active text-white' : 'text-secondary bg-transparent'}`}
                                            style={{
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                backgroundColor: activeCategoryId === currentId ? '#FF6B35' : 'transparent',
                                                color: activeCategoryId === currentId ? '#fff' : '#495057',
                                                transition: '0.3s'
                                            }}
                                            onClick={() => onCategoryChange(currentId)} // 💡 Đẩy ID thật lên cho cha khi click
                                        >
                                            <i className="fas fa-wrench mr-2" style={{ fontSize: '12px', opacity: 0.7 }}></i>
                                            {cat.name || cat.categoryName || cat.categoryProductName}
                                        </button>
                                    </li>
                                );
                            })}

                        </ul>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
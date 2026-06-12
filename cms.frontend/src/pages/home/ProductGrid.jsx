import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

function ProductGrid({ categoryId }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                // Gọi hàm dịch vụ đã được cập nhật đường dẫn URL mới
                const data = await productService.getAllProducts(categoryId);

                const dataArray = Array.isArray(data) ? data : (data?.$values || data?.data || []);
                setProducts(dataArray);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách thiết bị:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [categoryId]); // 🔴 Luôn giữ biến này để React tự động gọi lại API khi đổi danh mục

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted">Đang lọc danh sách dụng cụ cơ khí...</p>
            </div>
        );
    }

    return (
        <section className="product-grid-wrapper py-4">
            <div className="container">
                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#0D2C54' }}>
                        <i className="fas fa-cogs mr-2 text-warning"></i> Sản phẩm đang hiển thị
                    </h4>
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                        Tìm thấy: <strong>{products.length}</strong> mặt hàng phù hợp
                    </span>
                </div>

                <div className="row">
                    {products.length === 0 ? (
                        <div className="col-12 text-center text-muted py-5">
                            <i className="fas fa-box-open d-block mb-2" style={{ fontSize: '30px', color: '#ccc' }}></i>
                            Không tìm thấy thiết bị hay linh kiện nào thuộc nhóm phân loại này.
                        </div>
                    ) : (
                        products.map((product) => (
                            <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id || product.productId}>
                                <ProductCard item={product} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductGrid;
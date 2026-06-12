import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
// IMPORT file thành phần component CON VÀO ĐỂ SỬ DỤNG
import ProductCard from '../../components/ProductCard';

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();

                // Mẹo xử lý đồ án: Nếu backend trả về object bọc mảng ($values)
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
    }, []);

    // Giao diện chờ load dữ liệu mạng chuẩn ngành máy móc dụng cụ
    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted" style={{ fontSize: '14px' }}>Đang tải danh sách thiết bị & dụng cụ cơ khí mới nhất...</p>
            </div>
        );
    }

    return (
        <section className="product-grid-wrapper py-4">
            <div className="container">

                {/* TIÊU ĐỀ PHÂN KHU SẢN PHẨM MÁY MÓC */}
                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#0D2C54' }}>
                        <i className="fas fa-cogs mr-2 text-warning"></i> Sản phẩm nổi bật
                    </h4>
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                        Tổng số: <strong>{products.length}</strong> mặt hàng có sẵn
                    </span>
                </div>

                {/* KHUNG LƯỚI GRID SYSTEM TỰ ĐỘNG RESPONSIVE */}
                <div className="row">
                    {products.length === 0 ? (
                        <div className="col-12 text-center text-muted py-5">
                            <i className="fas fa-box-open d-block mb-2" style={{ fontSize: '30px', color: '#ccc' }}></i>
                            Hiện tại chưa có thiết bị hay linh kiện nào được nạp từ cơ sở dữ liệu.
                        </div>
                    ) : (
                        products.map((product) => (
                            <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id || product.productId}>
                                {/* CHÈN ĐÚNG component CON VÀ TRUYỀN DỮ LIỆU SẢN PHẨM CƠ KHÍ ĐI */}
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
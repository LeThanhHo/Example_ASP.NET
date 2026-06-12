import React, { useState } from 'react';
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';

function Home() {
    // 💡 Quản lý ID danh mục đang được bấm chọn tại đây (null = Xem tất cả)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div className="homepage-container">
            <Header />
            <HeroBanner />

            {/* 1. Truyền ID hiện tại và hàm cập nhật xuống cho Menu Phân Loại */}
            <CategoryMenu
                activeCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}
            />

            {/* 2. Truyền ID đang chọn xuống Lưới Sản Phẩm để ép gọi lại API tương ứng */}
            <ProductGrid categoryId={selectedCategoryId} />

            <LatestBlog />
            <Footer />
        </div>
    );
}

export default Home;
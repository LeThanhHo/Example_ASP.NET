import React from 'react';
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';

function Home() {
    return (
        <div className="homepage-container">
            <Header />
            <HeroBanner />
            <CategoryMenu />
            <ProductGrid />
            <LatestBlog />
            <Footer />
        </div>
    );
}

export default Home;
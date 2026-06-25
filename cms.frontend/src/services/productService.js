// src/services/productService.js
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

const API_BASE_URL = 'https://localhost:7116';
const PRODUCT_API = `${API_BASE_URL}/api/products`;
const CATEGORY_API = `${API_BASE_URL}/api/categoryproducts`;

/** Lấy tất cả sản phẩm */
export async function getAllProducts() {
    const res = await fetch(PRODUCT_API);
    if (!res.ok) throw new Error('Lỗi tải sản phẩm');
    return res.json();
}

/** Lấy sản phẩm theo ID */
export async function getProductById(id) {
    const res = await fetch(`${PRODUCT_API}/${id}`);
    if (!res.ok) throw new Error(`Không tìm thấy sản phẩm ID=${id}`);
    return res.json();
}

/** Lấy sản phẩm theo danh mục */
export async function getProductsByCategory(categoryId) {
    const res = await fetch(`${PRODUCT_API}/category/${categoryId}`);
    if (!res.ok) throw new Error('Lỗi tải sản phẩm theo danh mục');
    return res.json();
}

/**
 * Lọc / sắp xếp sản phẩm theo giá.
 * @param {{minPrice?: number, maxPrice?: number, sort?: 'asc'|'desc'}} params
 */
export async function getProductsByPrice({ minPrice, maxPrice, sort = 'asc' } = {}) {
    const query = new URLSearchParams();
    if (minPrice != null) query.set('minPrice', minPrice);
    if (maxPrice != null) query.set('maxPrice', maxPrice);
    query.set('sort', sort);

    const res = await fetch(`${PRODUCT_API}/by-price?${query.toString()}`);
    if (!res.ok) throw new Error('Lỗi lọc sản phẩm theo giá');
    return res.json();
}

/** Lấy tất cả danh mục sản phẩm (dùng cho bộ lọc sidebar) */
export async function getAllProductCategories() {
    const res = await fetch(CATEGORY_API);
    if (!res.ok) throw new Error('Lỗi tải danh mục sản phẩm');
    return res.json();
}

export { API_BASE_URL };

// ── Default export ──────────────────────────────────────────
// Cho phép import theo 2 cách:
//   import { getAllProducts } from '../services/productService';   (named)
//   import productService from '../services/productService';       (default)
//   productService.getAllProducts(...)
const productService = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByPrice,
    getAllProductCategories,
    API_BASE_URL
};

export default productService;

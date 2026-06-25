// src/services/postService.js
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

const API_BASE_URL = 'https://localhost:7116';
const POST_API = `${API_BASE_URL}/api/posts`;
const CATEGORY_API = `${API_BASE_URL}/api/categories`;

/** Lấy tất cả bài viết */
export async function getAllPosts() {
    const res = await fetch(POST_API);
    if (!res.ok) throw new Error('Lỗi tải bài viết');
    return res.json();
}

/** Lấy bài viết theo ID */
export async function getPostById(id) {
    const res = await fetch(`${POST_API}/${id}`);
    if (!res.ok) throw new Error(`Không tìm thấy bài viết ID=${id}`);
    return res.json();
}

/** Lấy bài viết theo danh mục */
export async function getPostsByCategory(categoryId) {
    const res = await fetch(`${POST_API}/category/${categoryId}`);
    if (!res.ok) throw new Error('Lỗi tải bài viết theo danh mục');
    return res.json();
}

/** Lấy tất cả danh mục bài viết (dùng cho bộ lọc) */
export async function getAllPostCategories() {
    const res = await fetch(CATEGORY_API);
    if (!res.ok) throw new Error('Lỗi tải danh mục bài viết');
    return res.json();
}

export { API_BASE_URL };

// ── Default export ──────────────────────────────────────────
// Cho phép import theo 2 cách:
//   import { getAllPosts } from '../services/postService';   (named)
//   import postService from '../services/postService';       (default)
//   postService.getAllPosts(...)
// Một số file cũ của project import bằng tên "blogService" — vẫn dùng
// đúng object này vì đó chỉ là tên biến cục bộ khi import, không phải tên export.
const postService = {
    getAllPosts,
    getPostById,
    getPostsByCategory,
    getAllPostCategories,
    API_BASE_URL
};

export default postService;

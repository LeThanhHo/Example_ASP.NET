// src/services/bannerService.js
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

// Đổi URL này theo domain backend thực tế của bạn
const API_BASE_URL = 'https://localhost:7116';

const BANNER_API = `${API_BASE_URL}/api/banners`;

/**
 * Lấy danh sách banner đang hiển thị (IsActive = true), đã sort theo DisplayOrder.
 * Dùng cho slider/carousel ở trang chủ.
 */
export async function getActiveBanners() {
    const res = await fetch(`${BANNER_API}/active`);
    if (!res.ok) {
        throw new Error(`Lỗi tải banner: ${res.status}`);
    }
    return res.json();
}

/**
 * Lấy tất cả banner (kể cả đang ẩn) — dùng cho trang quản trị.
 */
export async function getAllBanners() {
    const res = await fetch(BANNER_API);
    if (!res.ok) {
        throw new Error(`Lỗi tải banner: ${res.status}`);
    }
    return res.json();
}

/**
 * Lấy banner theo ID.
 */
export async function getBannerById(id) {
    const res = await fetch(`${BANNER_API}/${id}`);
    if (!res.ok) {
        throw new Error(`Không tìm thấy banner ID=${id}`);
    }
    return res.json();
}

/**
 * Thêm banner mới.
 * @param {{title: string, linkUrl?: string, imageUrl: string, displayOrder?: number, isActive?: boolean}} data
 */
export async function createBanner(data) {
    const res = await fetch(BANNER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Không thêm được banner');
    }
    return res.json();
}

/**
 * Cập nhật banner.
 */
export async function updateBanner(id, data) {
    const res = await fetch(`${BANNER_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Không cập nhật được banner');
    }
    return res.json();
}

/**
 * Bật/tắt trạng thái hiển thị banner.
 */
export async function toggleBannerActive(id) {
    const res = await fetch(`${BANNER_API}/${id}/toggle-active`, {
        method: 'PATCH'
    });
    if (!res.ok) {
        throw new Error('Không đổi được trạng thái banner');
    }
    return res.json();
}

/**
 * Xóa banner.
 */
export async function deleteBanner(id) {
    const res = await fetch(`${BANNER_API}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Không xóa được banner');
    }
    return res.json();
}

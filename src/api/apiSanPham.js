const API_URL = 'https://localhost:7265/api/SanPham';

export async function getAllSanPham() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch SanPham list');
    return await response.json();
}

export async function getSanPhamById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`SanPham with id ${id} not found`);
    return await response.json();
}

export async function createSanPham(sanPham) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanPham),
    });
    if (!response.ok) throw new Error('Failed to create SanPham');
    return await response.json();
}

export async function updateSanPham(id, sanPham) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanPham),
    });
    if (!response.ok) throw new Error('Failed to update SanPham');
}

export async function deleteSanPham(id) {
    // Soft delete (set isDeleted = true)
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete SanPham');
}

export async function getSanPhamTheoLoaiSP(maLoaiSP) {
    try {
        const response = await fetch(`${API_URL}/loai/${maLoaiSP}`);
        if (!response.ok) {
            throw new Error('Không tìm thấy sản phẩm theo mã loại.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo loại:', error);
        throw error;
    }
}

const API_URL = 'https://localhost:7265/api/LoaiSanPham';

export async function getAllLoaiSanPham() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch LoaiSanPham list');
    return await response.json();
}

export async function getLoaiSanPhamById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`LoaiSanPham with id ${id} not found`);
    return await response.json();
}

export async function createLoaiSanPham(loaiSanPham) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loaiSanPham),
    });
    if (!response.ok) throw new Error('Failed to create LoaiSanPham');
    return await response.json();
}

export async function updateLoaiSanPham(id, loaiSanPham) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loaiSanPham),
    });
    if (!response.ok) throw new Error('Failed to update LoaiSanPham');
}

export async function deleteLoaiSanPham(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete LoaiSanPham');
}

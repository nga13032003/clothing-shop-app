const API_URL = 'https://localhost:7265/api/BienTheSanPham';

// GET all Biến Thể Sản Phẩm
export async function getAllBienTheSanPham() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Lỗi khi tải danh sách biến thể sản phẩm');
    return await res.json();
}

// GET by mã biến thể
export async function getBienTheSanPhamById(maBienThe) {
    const res = await fetch(`${API_URL}/${maBienThe}`);
    if (!res.ok) throw new Error(`Không tìm thấy biến thể sản phẩm có mã: ${maBienThe}`);
    return await res.json();
}

// POST: Create biến thể sản phẩm
export async function createBienTheSanPham(data) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi khi tạo biến thể sản phẩm: ${errorText}`);
    }
    return await res.json();
}

// PUT: Update biến thể sản phẩm
export async function updateBienTheSanPham(maBienThe, data) {
    const res = await fetch(`${API_URL}/${maBienThe}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Không thể cập nhật biến thể sản phẩm: ${errorText}`);
    }
}

// DELETE: Xoá biến thể sản phẩm
export async function deleteBienTheSanPham(maBienThe) {
    const res = await fetch(`${API_URL}/${maBienThe}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Không thể xoá biến thể sản phẩm');
}

// POST: Upload hình ảnh
export async function uploadBienTheImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) throw new Error('Tải ảnh thất bại');

    return await res.json(); // Trả về { imageUrl, fileName }
}

// GET: Tìm theo mã sản phẩm (query string)
export async function searchBienTheByMaSanPham(maSanPham) {
    const res = await fetch(`${API_URL}/search?masp=${maSanPham}`);
    if (!res.ok) throw new Error(`Không tìm thấy biến thể nào của sản phẩm có mã: ${maSanPham}`);
    return await res.json();
}

// GET: Tìm theo mã loại sản phẩm
export async function getBienTheByMaLoaiSP(maLoaiSP) {
    const res = await fetch(`${API_URL}/loai/${maLoaiSP}`);
    if (!res.ok) throw new Error(`Không tìm thấy sản phẩm nào thuộc mã loại: ${maLoaiSP}`);
    return await res.json();
}
export async function getBienTheTheoMaSP(maSP) {
    const res = await fetch(`${API_URL}/sanpham/${maSP}`);
    if (!res.ok) throw new Error(`Không tìm thấy biến thể cho mã sản phẩm: ${maSP}`);
    return await res.json();
}

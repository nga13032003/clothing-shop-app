const API_URL = 'https://localhost:7265/api/NhaCungCap';

export async function getAllNhaCungCap() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch NhaCungCap list');
    return await response.json();
}

export async function getNhaCungCapById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`NhaCungCap with id ${id} not found`);
    return await response.json();
}

export async function createNhaCungCap(nhaCungCap) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nhaCungCap),
    });
    if (!response.ok) throw new Error('Failed to create NhaCungCap');
    return await response.json();
}

export async function updateNhaCungCap(id, nhaCungCap) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nhaCungCap),
    });
    if (!response.ok) throw new Error('Failed to update NhaCungCap');
}

export async function deleteNhaCungCap(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete NhaCungCap');
}

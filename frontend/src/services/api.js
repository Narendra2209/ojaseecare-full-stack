const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function fetchProduct(id) {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function createProduct(data) {
    const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}

export async function updateProductAPI(id, data) {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
}

export async function deleteProductAPI(id) {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}

// ─── Offers ───────────────────────────────────────────────────────────────────

export async function fetchOffers() {
    const res = await fetch(`${API_URL}/api/offers`);
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
}

export async function fetchActiveOffers() {
    const res = await fetch(`${API_URL}/api/offers/active`);
    if (!res.ok) throw new Error('Failed to fetch active offers');
    return res.json();
}

export async function createOffer(data) {
    const res = await fetch(`${API_URL}/api/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create offer');
    return res.json();
}

export async function deleteOfferAPI(id) {
    const res = await fetch(`${API_URL}/api/offers/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete offer');
    return res.json();
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function adminLogin(username, password) {
    const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login request failed');
    return res.json();
}

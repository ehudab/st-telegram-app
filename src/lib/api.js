// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function authenticatedFetch(endpoint, options = {}) {
    // Get initData from Telegram Web App
    const initData = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData ?
        window.Telegram.WebApp.initData : '';

    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Security Gate: Treat 401 and 403 as access denied
    if (response.status === 401 || response.status === 403) {
        throw new Error("Access Denied");
    }

    return response;
}
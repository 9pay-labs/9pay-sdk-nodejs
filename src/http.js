async function request(url, { method = 'GET', headers = {}, body }) {
    const res = await fetch(url, {
        method,
        headers,
        body
    });

    const text = await res.text();

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

module.exports = { request };

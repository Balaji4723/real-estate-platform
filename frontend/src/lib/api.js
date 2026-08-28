const BASE = (import.meta.env.VITE_API_URL || "") + "/api";

async function handle(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // no JSON body — keep generic message
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  async listProperties(filters = {}) {
    const res = await fetch(`${BASE}/properties${buildQuery(filters)}`);
    return handle(res);
  },

  async getProperty(id) {
    const res = await fetch(`${BASE}/properties/${id}`);
    return handle(res);
  },

  async getMeta() {
    const res = await fetch(`${BASE}/properties/meta`);
    return handle(res);
  },

  async getStats() {
    const res = await fetch(`${BASE}/properties/stats`);
    return handle(res);
  },

  async login(password) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return handle(res);
  },

  async createProperty(formData, token) {
    const res = await fetch(`${BASE}/properties`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return handle(res);
  },

  async deleteProperty(id, token) {
    const res = await fetch(`${BASE}/properties/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handle(res);
  },
};

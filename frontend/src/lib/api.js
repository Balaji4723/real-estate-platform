const BASE = "/api";

async function handle(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // response had no JSON body — keep the generic message
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

  async createProperty(formData) {
    const res = await fetch(`${BASE}/properties`, {
      method: "POST",
      body: formData,
    });
    return handle(res);
  },

  async deleteProperty(id) {
    const res = await fetch(`${BASE}/properties/${id}`, { method: "DELETE" });
    return handle(res);
  },
};

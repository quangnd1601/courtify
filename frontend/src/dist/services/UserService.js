import config from "../config/config.js";
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;
  const response = await fetch(`${config.BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
  const data = await response.json().catch(() => ({}));
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  return data.access_token || null;
};
const handleFetch = async (url, options, retryOnAuth = true) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401 && retryOnAuth) {
        const token = await refreshAccessToken();
        if (token) {
          const newHeaders = {
            ...(options?.headers || {}),
            Authorization: `Bearer ${token}`,
          };
          return handleFetch(url, { ...options, headers: newHeaders }, false);
        }
      }
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data.message || `Lỗi từ hệ thống (HTTP ${response.status})`,
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("NETWORK_ERROR");
    }
    throw error;
  }
};
const UserService = {
  getAll: async () => {
    const data = await handleFetch(`${config.BASE_URL}/users`);
    return data.users;
  },
  getOne: async (id) => {
    const data = await handleFetch(`${config.BASE_URL}/users/${id}`);
    return data.user;
  },
  create: async (user) => {
    const data = await handleFetch(`${config.BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return data.user;
  },
  update: async (id, user) => {
    const token = localStorage.getItem("access_token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const data = await handleFetch(`${config.BASE_URL}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(user),
    });
    return data.user;
  },
  remove: async (id) => {
    await handleFetch(`${config.BASE_URL}/users/delete/${id}`, {
      method: "DELETE",
    });
  },
  login: async (credentials) => {
    const data = await handleFetch(`${config.BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (data.user) {
      localStorage.setItem("courtify_user", JSON.stringify(data.user));
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
    }
    return data;
  },
  register: async (userData) => {
    return await handleFetch(`${config.BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("courtify_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem("courtify_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};
export default UserService;
//# sourceMappingURL=UserService.js.map

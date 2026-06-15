import config from "../config/config.js";

const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
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

const ReviewService = {
  getAll: async (): Promise<any[]> => {
    try {
      const data = await handleFetch(`${config.BASE_URL}/reviews`);
      return data.reviews || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách review:", error);
      return [];
    }
  },

  getOne: async (id: string): Promise<any | null> => {
    try {
      const data = await handleFetch(`${config.BASE_URL}/reviews/${id}`);
      return data.review || null;
    } catch (error) {
      console.error(`Lỗi khi lấy review ${id}:`, error);
      return null;
    }
  },

  create: async (reviewData: any): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
  },

  update: async (id: string, reviewData: any): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
  },

  delete: async (id: string): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/reviews/${id}`, {
      method: "DELETE",
    });
  },
};

export default ReviewService;

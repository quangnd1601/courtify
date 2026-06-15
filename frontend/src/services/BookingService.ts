import config from "../config/config.js";

const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Lỗi hệ thống (HTTP ${response.status})`);
    }
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("NETWORK_ERROR");
    }
    throw error;
  }
};

const BookingService = {
  create: async (bookingData: any): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
  },

  getAll: async (): Promise<any[]> => {
    const data = await handleFetch(`${config.BASE_URL}/bookings`);
    return data.bookings || [];
  },

  update: async (id: string, bookingData: any): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
  }
};

export default BookingService;

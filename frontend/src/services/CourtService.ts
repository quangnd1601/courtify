import config from "../config/config.js";

export interface ICourt {
  _id: string;
  sport_center_id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  gallery?: string[];
  rating_avg: number;
  review_count: number;
  status: "active" | "maintenance" | "inactive";
  booking_count: number;
  created_at: string;
  updated_at: string;
}

export interface ISlot {
  start_time: string;
  end_time: string;
  price: number;
  isBooked?: boolean;
}

const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Lỗi từ hệ thống (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("NETWORK_ERROR");
    }
    throw error;
  }
};

const CourtService = {
  getBySportsCenter: async (sportCenterId: string): Promise<ICourt[]> => {
    const data = await handleFetch(`${config.BASE_URL}/courts?sport_center_id=${sportCenterId}`);
    return data.courts || [];
  },

  getOne: async (id: string): Promise<ICourt> => {
    const data = await handleFetch(`${config.BASE_URL}/courts/${id}`);
    return data.court;
  },

  /** Lấy khung giờ còn trống của sân theo ngày */
  getAvailableSlots: async (courtId: string, date: string): Promise<ISlot[]> => {
    const data = await handleFetch(
      `${config.BASE_URL}/bookings/available-slots?court_id=${courtId}&date=${date}`
    );
    return data.slots || [];
  },

  getAll: async (): Promise<ICourt[]> => {
    const data = await handleFetch(`${config.BASE_URL}/courts`);
    return data.courts || [];
  },

  create: async (courtData: any): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/courts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courtData),
    });
  },

  update: async (id: string, courtData: any): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/courts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courtData),
    });
  },

  remove: async (id: string): Promise<any> => {
    return await handleFetch(`${config.BASE_URL}/courts/${id}`, {
      method: "DELETE",
    });
  }
};

export default CourtService;

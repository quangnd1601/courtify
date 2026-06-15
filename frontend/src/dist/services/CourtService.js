import config from "../config/config.js";
const handleFetch = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Lỗi từ hệ thống (HTTP ${response.status})`);
        }
        return await response.json();
    }
    catch (error) {
        if (error instanceof TypeError) {
            throw new Error("NETWORK_ERROR");
        }
        throw error;
    }
};
const CourtService = {
    getBySportsCenter: async (sportCenterId) => {
        const data = await handleFetch(`${config.BASE_URL}/courts?sport_center_id=${sportCenterId}`);
        return data.courts || [];
    },
    getOne: async (id) => {
        const data = await handleFetch(`${config.BASE_URL}/courts/${id}`);
        return data.court;
    },
    /** Lấy khung giờ còn trống của sân theo ngày */
    getAvailableSlots: async (courtId, date) => {
        const data = await handleFetch(`${config.BASE_URL}/bookings/available-slots?court_id=${courtId}&date=${date}`);
        return data.slots || [];
    },
    getAll: async () => {
        const data = await handleFetch(`${config.BASE_URL}/courts`);
        return data.courts || [];
    },
    create: async (courtData) => {
        return await handleFetch(`${config.BASE_URL}/courts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courtData),
        });
    },
    update: async (id, courtData) => {
        return await handleFetch(`${config.BASE_URL}/courts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courtData),
        });
    },
    remove: async (id) => {
        return await handleFetch(`${config.BASE_URL}/courts/${id}`, {
            method: "DELETE",
        });
    }
};
export default CourtService;
//# sourceMappingURL=CourtService.js.map
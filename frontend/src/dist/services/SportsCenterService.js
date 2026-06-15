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
const SportsCenterService = {
    getMostBooked: async (limit = 6) => {
        const data = await handleFetch(`${config.BASE_URL}/sports-centers?sort=most-booked&limit=${limit}`);
        return data.centers || [];
    },
    getNewest: async (limit = 6) => {
        const data = await handleFetch(`${config.BASE_URL}/sports-centers?sort=newest&limit=${limit}`);
        return data.centers || [];
    },
    getOne: async (id) => {
        const data = await handleFetch(`${config.BASE_URL}/sports-centers/${id}`);
        return data.center;
    },
    search: async (params) => {
        const query = new URLSearchParams();
        if (params.location)
            query.append("location", params.location);
        if (params.sport_id)
            query.append("sport_id", params.sport_id);
        if (params.price_min)
            query.append("price_min", params.price_min);
        if (params.price_max)
            query.append("price_max", params.price_max);
        if (params.sort)
            query.append("sort", params.sort);
        const data = await handleFetch(`${config.BASE_URL}/sports-centers?${query.toString()}`);
        return data.centers || [];
    },
    getAll: async () => {
        const data = await handleFetch(`${config.BASE_URL}/sports-centers`);
        return data.centers || [];
    },
    getByOwner: async (ownerId) => {
        const data = await handleFetch(`${config.BASE_URL}/sports-centers?owner_id=${ownerId}`);
        return data.centers || [];
    },
    create: async (centerData) => {
        return await handleFetch(`${config.BASE_URL}/sports-centers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(centerData),
        });
    },
    update: async (id, centerData) => {
        return await handleFetch(`${config.BASE_URL}/sports-centers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(centerData),
        });
    },
    remove: async (id) => {
        return await handleFetch(`${config.BASE_URL}/sports-centers/${id}`, {
            method: "DELETE",
        });
    }
};
export default SportsCenterService;
//# sourceMappingURL=SportsCenterService.js.map
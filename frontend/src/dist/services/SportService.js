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
const SportService = {
    getAll: async () => {
        const data = await handleFetch(`${config.BASE_URL}/sports`);
        return data.sports || [];
    }
};
export default SportService;
//# sourceMappingURL=SportService.js.map
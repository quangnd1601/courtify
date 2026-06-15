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
const VoucherService = {
    getAll: async () => {
        try {
            const data = await handleFetch(`${config.BASE_URL}/vouchers`);
            return data.vouchers || [];
        }
        catch (error) {
            console.error("Lỗi khi lấy danh sách voucher:", error);
            return [];
        }
    },
    getOne: async (id) => {
        try {
            const data = await handleFetch(`${config.BASE_URL}/vouchers/${id}`);
            return data.voucher || null;
        }
        catch (error) {
            console.error(`Lỗi khi lấy voucher ${id}:`, error);
            return null;
        }
    },
    create: async (voucherData) => {
        return await handleFetch(`${config.BASE_URL}/vouchers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(voucherData),
        });
    },
    update: async (id, voucherData) => {
        return await handleFetch(`${config.BASE_URL}/vouchers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(voucherData),
        });
    },
    remove: async (id) => {
        return await handleFetch(`${config.BASE_URL}/vouchers/${id}`, {
            method: "DELETE",
        });
    }
};
export default VoucherService;
//# sourceMappingURL=VoucherService.js.map
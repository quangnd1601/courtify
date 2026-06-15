import SportsCenterService from "../services/SportsCenterService.js";
import { HomeView } from "../views/HomeView.js";
export default class HomeController {
    async init() {
        const app = document.getElementById("app");
        if (!app)
            return;
        // 1. Render toàn bộ cấu trúc trang chủ vào #app
        app.innerHTML = HomeView.renderPage();
        // 2. Sau khi DOM sẵn sàng, gọi Service lấy data rồi điền vào containers
        try {
            const [mostBooked, newest] = await Promise.all([
                SportsCenterService.getMostBooked(6),
                SportsCenterService.getNewest(6),
            ]);
            const mostBookedEl = document.getElementById("most-booked-centers-list");
            if (mostBookedEl)
                mostBookedEl.innerHTML = HomeView.renderList(mostBooked);
            const newestEl = document.getElementById("newest-centers-list");
            if (newestEl)
                newestEl.innerHTML = HomeView.renderList(newest);
        }
        catch (error) {
            console.error("Lỗi tải trang chủ:", error);
            const mostBookedEl = document.getElementById("most-booked-centers-list");
            if (mostBookedEl)
                mostBookedEl.innerHTML = HomeView.renderListError();
            const newestEl = document.getElementById("newest-centers-list");
            if (newestEl)
                newestEl.innerHTML = HomeView.renderListError();
        }
    }
}
//# sourceMappingURL=HomeController.js.map
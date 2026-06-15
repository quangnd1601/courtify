import AdminController from "./controllers/AdminController.js";
import UserService from "./services/UserService.js";
// Kiểm tra xem người dùng có phải là admin không
const currentUser = UserService.getCurrentUser();
if (!currentUser || currentUser.role !== "admin") {
    alert("Bạn không có quyền truy cập trang admin!");
    window.location.href = "index.html";
}
const controller = new AdminController();
const params = new URLSearchParams(window.location.search);
const ctrl = params.get("ctrl") || "dashboard";
if (ctrl === "dashboard") {
    controller.dashboard();
}
else if (ctrl === "users") {
    controller.usersList();
}
else if (ctrl === "centers") {
    controller.centersList();
}
else if (ctrl === "bookings") {
    controller.bookingsList();
}
else if (ctrl === "vouchers") {
    controller.vouchersList();
}
else if (ctrl === "reviews") {
    controller.reviewsList();
}
else {
    controller.dashboard();
}
//# sourceMappingURL=admin.js.map
import UserController from "./controllers/UserController.js";
const controller = new UserController();
const params = new URLSearchParams(window.location.search);
const ctrl = params.get("ctrl") || "user";
const act = params.get("act") || "list";
// Đăng ký hàm delete cho window object để gọi từ HTML button onclick
window.deleteUser = (id) => {
    controller.delete(id);
};
if (ctrl === "user") {
    if (act === "list") {
        controller.list();
    }
    else if (act === "add") {
        controller.add();
    }
    else if (act === "edit") {
        controller.edit();
    }
}
//# sourceMappingURL=admin.js.map
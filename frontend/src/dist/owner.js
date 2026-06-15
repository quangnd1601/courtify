import OwnerController from "./controllers/OwnerController.js";
import UserService from "./services/UserService.js";
// Kiểm tra quyền truy cập
const currentUser = UserService.getCurrentUser();
if (!currentUser || currentUser.role !== "owner") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "index.html";
}
const controller = new OwnerController();
const params = new URLSearchParams(window.location.search);
const ctrl = params.get("ctrl") || "dashboard";
const act = params.get("act") || "list";
const id = params.get("id") || "";
// Đăng ký hàm global cho button onclick
window.ownerDeleteCenter = (centerId) => {
    controller.centersDelete(centerId);
};
window.ownerDeleteCourt = (courtId) => {
    controller.courtsDelete(courtId);
};
window.ownerDeleteVoucher = (voucherId) => {
    controller.vouchersDelete(voucherId);
};
if (ctrl === "centers") {
    if (act === "add") {
        controller.centersAdd();
    }
    else if (act === "edit" && id) {
        controller.centersEdit(id);
    }
    else {
        controller.centersList();
    }
}
else if (ctrl === "courts") {
    if (act === "add") {
        controller.courtsAdd();
    }
    else if (act === "edit" && id) {
        controller.courtsEdit(id);
    }
    else {
        controller.courtsList();
    }
}
else if (ctrl === "bookings") {
    controller.bookings();
}
else if (ctrl === "vouchers") {
    if (act === "add") {
        controller.vouchersAdd();
    }
    else if (act === "edit" && id) {
        controller.vouchersEdit(id);
    }
    else {
        controller.vouchersList();
    }
}
else {
    controller.dashboard();
}
//# sourceMappingURL=owner.js.map
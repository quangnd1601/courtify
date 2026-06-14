import UserController from "./controllers/UserController.js";

// Khởi tạo controller
const controller = new UserController();

// Router
const params = new URLSearchParams(window.location.search);
const ctrl = params.get("ctrl") || "user";
const act = params.get("act") || "listClient";

if (ctrl === "user") {
  if (act === "listClient") {
    controller.listClient();
  }
}

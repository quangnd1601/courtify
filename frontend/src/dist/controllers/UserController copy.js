import UserService from "../services/UserService.js";
import { UserView } from "../views/UserView.js";
export default class UserController {
    // Client view: hiển thị danh sách
    async listClient() {
        const app = document.getElementById("app");
        if (!app)
            return;
        try {
            const users = await UserService.getAll();
            app.innerHTML = UserView.renderList(users);
        }
        catch (error) {
            app.innerHTML = `<div style="color: red; padding: 20px;">Lỗi tải dữ liệu: ${error.message}</div>`;
        }
    }
    // Admin view: danh sách quản lý
    async list() {
        const app = document.getElementById("app");
        if (!app)
            return;
        try {
            const users = await UserService.getAll();
            app.innerHTML = UserView.renderAdminList(users);
        }
        catch (error) {
            app.innerHTML = `<div style="color: red; padding: 20px;">Lỗi tải dữ liệu: ${error.message}</div>`;
        }
    }
    // Thêm mới
    async add() {
        const app = document.getElementById("app");
        if (!app)
            return;
        app.innerHTML = UserView.renderForm();
        const form = document.getElementById("userForm");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email")
                .value;
            const password = document.getElementById("password")
                .value;
            const phone = document.getElementById("phone")
                .value;
            const role = document.getElementById("role")
                .value;
            const status = document.getElementById("status")
                .value;
            try {
                // Tạo ngẫu nhiên ID string tương tự MongoDB dạng string (bởi vì backend schema của bạn sử dụng String cho _id)
                const _id = Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15);
                await UserService.create({
                    _id,
                    name,
                    email,
                    password,
                    phone,
                    role,
                    status,
                });
                alert("Thêm thành công!");
                window.location.href = "admin.html?ctrl=user&act=list";
            }
            catch (error) {
                alert("Lỗi: " + error.message);
            }
        });
    }
    // Chỉnh sửa
    async edit() {
        const app = document.getElementById("app");
        if (!app)
            return;
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) {
            alert("Không tìm thấy ID người dùng");
            window.location.href = "admin.html?ctrl=user&act=list";
            return;
        }
        try {
            const user = await UserService.getOne(id);
            app.innerHTML = UserView.renderForm(user);
            const form = document.getElementById("userForm");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const name = document.getElementById("name")
                    .value;
                const phone = document.getElementById("phone")
                    .value;
                const role = document.getElementById("role")
                    .value;
                const status = document.getElementById("status")
                    .value;
                try {
                    await UserService.update(id, { name, phone, role, status });
                    alert("Cập nhật thành công!");
                    window.location.href = "admin.html?ctrl=user&act=list";
                }
                catch (error) {
                    alert("Lỗi: " + error.message);
                }
            });
        }
        catch (error) {
            app.innerHTML = `<div style="color: red; padding: 20px;">Lỗi: ${error.message}</div>`;
        }
    }
    // Xóa
    async delete(id) {
        if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await UserService.remove(id);
                alert("Xóa thành công!");
                window.location.reload();
            }
            catch (error) {
                alert("Lỗi: " + error.message);
            }
        }
    }
}
//# sourceMappingURL=UserController%20copy.js.map
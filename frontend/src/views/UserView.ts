import { IUser } from "../models/UserModel.js";

const commonStyles = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
      color: #333333;
      padding: 20px;
    }

    .container {
      max-width: 1000px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #cccccc;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 15px;
    }

    h2 {
      font-size: 20px;
      color: #333333;
    }

    .btn {
      display: inline-block;
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .btn-default {
      background-color: #ffffff;
      color: #333333;
      border-color: #cccccc;
    }

    .btn-default:hover {
      background-color: #e6e6e6;
    }

    .btn-primary {
      background-color: #007bff;
      color: #ffffff;
    }

    .btn-primary:hover {
      background-color: #0069d9;
    }

    .btn-danger {
      background-color: #dc3545;
      color: #ffffff;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 14px;
    }

    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 10px;
    }

    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .badge-active {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #cccccc;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #66afe9;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    .action-link {
      color: #007bff;
      text-decoration: none;
    }

    .action-link:hover {
      text-decoration: underline;
    }
  </style>
`;

export const UserView = {
  renderList: (users: IUser[]): string => {
    const tableRows =
      users.length > 0
        ? users
            .map(
              (user) => `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || "N/A"}</td>
            <td>${user.role}</td>
          </tr>
        `,
            )
            .join("")
        : `<tr><td colspan="4" style="text-align: center; color: #777777;">Không có dữ liệu người dùng.</td></tr>`;

    return `
      ${commonStyles}
      <div class="container">
        <div class="header">
          <h2>Danh sách người dùng (Client View)</h2>
          <a href="admin.html?ctrl=user&act=list" class="btn btn-primary">Trang Quản Trị</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  },

  renderAdminList: (users: IUser[]): string => {
    const tableRows =
      users.length > 0
        ? users
            .map(
              (user) => `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              <span class="badge ${user.status === "active" ? "badge-active" : "badge-inactive"}">
                ${user.status}
              </span>
            </td>
            <td>
              <div class="actions">
                <a href="admin.html?ctrl=user&act=edit&id=${user._id}" class="action-link">Sửa</a>
                <button onclick="window.deleteUser('${user._id}')" style="background: none; border: none; color: #dc3545; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit; text-decoration: underline;">Xóa</button>
              </div>
            </td>
          </tr>
        `,
            )
            .join("")
        : `<tr><td colspan="5" style="text-align: center; color: #777777;">Không có dữ liệu thành viên.</td></tr>`;

    return `
      ${commonStyles}
      <div class="container">
        <div class="header">
          <h2>Quản lý người dùng (Admin Dashboard)</h2>
          <div style="display: flex; gap: 10px;">
            <a href="index.html" class="btn btn-default">Xem Client</a>
            <a href="admin.html?ctrl=user&act=add" class="btn btn-primary">Thêm thành viên mới</a>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  },

  renderForm: (user?: IUser): string => {
    const isEdit = !!user;
    return `
      ${commonStyles}
      <div class="container" style="max-width: 500px;">
        <div class="header">
          <h2>${isEdit ? "Cập nhật thành viên" : "Thêm thành viên mới"}</h2>
        </div>
        <form id="userForm">
          ${isEdit ? `<input type="hidden" id="userId" value="${user._id}">` : ""}
          
          <div class="form-group">
            <label>Họ và tên *</label>
            <input type="text" id="name" class="form-control" value="${user?.name || ""}" required>
          </div>
          
          <div class="form-group">
            <label>Email *</label>
            <input type="email" id="email" class="form-control" value="${user?.email || ""}" required ${isEdit ? "disabled" : ""} style="${isEdit ? "background-color: #eeeeee;" : ""}">
          </div>

          ${
            !isEdit
              ? `
          <div class="form-group">
            <label>Mật khẩu *</label>
            <input type="password" id="password" class="form-control" required>
          </div>
          `
              : ""
          }

          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="text" id="phone" class="form-control" value="${user?.phone || ""}">
          </div>

          <div class="form-group">
            <label>Vai trò</label>
            <select id="role" class="form-control">
              <option value="user" ${user?.role === "user" ? "selected" : ""}>User</option>
              <option value="admin" ${user?.role === "admin" ? "selected" : ""}>Admin</option>
              <option value="owner" ${user?.role === "owner" ? "selected" : ""}>Owner</option>
            </select>
          </div>

          <div class="form-group">
            <label>Trạng thái</label>
            <select id="status" class="form-control">
              <option value="active" ${user?.status === "active" ? "selected" : ""}>Active</option>
              <option value="inactive" ${user?.status === "inactive" ? "selected" : ""}>Inactive</option>
            </select>
          </div>

          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button type="submit" class="btn btn-primary">Lưu</button>
            <a href="admin.html?ctrl=user&act=list" class="btn btn-default">Hủy</a>
          </div>
        </form>
      </div>
    `;
  },
};

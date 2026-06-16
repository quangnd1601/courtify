import UserService from "../services/UserService.js";
import SportsCenterService from "../services/SportsCenterService.js";
import CourtService from "../services/CourtService.js";
import BookingService from "../services/BookingService.js";
import ReviewService from "../services/ReviewService.js";
import VoucherService from "../services/VoucherService.js";
export default class AdminController {
    getAppElement() {
        const app = document.getElementById("app");
        if (app) {
            // Reset loading state classes so they don't interfere with layout
            app.className = "w-full min-h-screen";
        }
        return app;
    }
    // ==================== SIDEBAR LAYOUT ====================
    renderLayout(activeTab, content) {
        const menuItems = [
            { key: "dashboard", icon: "dashboard", label: "Tổng Quan" },
            { key: "users", icon: "people", label: "Người Dùng" },
            { key: "centers", icon: "location_on", label: "Cụm Sân" },
            { key: "courts", icon: "sports_tennis", label: "Sân" },
            { key: "bookings", icon: "event_note", label: "Đơn Đặt Sân" },
            { key: "vouchers", icon: "local_offer", label: "Voucher" },
            { key: "reviews", icon: "star_rate", label: "Đánh Giá" },
        ];
        const user = UserService.getCurrentUser();
        const userName = user?.name || "Admin";
        const sidebar = menuItems
            .map((m) => `
        <a href="admin.html?ctrl=${m.key}"
           class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/80 transition-all ${activeTab === m.key ? "active" : ""}">
          <span class="material-symbols-outlined text-[20px]">${m.icon}</span>
          <span class="hidden lg:inline">${m.label}</span>
        </a>`)
            .join("");
        return `
      <div class="flex">
        <!-- Sidebar (fixed) -->
        <aside class="admin-sidebar w-16 lg:w-64 flex flex-col shrink-0 fixed top-0 left-0 h-screen overflow-y-auto z-50">
          <div class="p-4 border-b border-white/10">
            <a href="admin.html" class="flex items-center gap-2">
              <span class="material-symbols-outlined text-red-400 text-2xl">admin_panel_settings</span>
              <span class="hidden lg:block text-white font-bold text-lg font-headline-lg">Courtify Admin</span>
            </a>
          </div>
          <nav class="flex-1 py-4 space-y-1">
            ${sidebar}
          </nav>
          <div class="p-4 border-t border-white/10 space-y-2">
            <div class="hidden lg:flex items-center gap-2 text-white/60 text-xs">
              <span class="material-symbols-outlined text-[18px]">account_circle</span>
              <span class="truncate">${userName}</span>
            </div>
            <button onclick="localStorage.removeItem('courtify_user'); localStorage.removeItem('access_token'); window.location.href='index.html';"
              class="flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-white/5 rounded-lg transition w-full">
              <span class="material-symbols-outlined text-[18px]">logout</span>
              <span class="hidden lg:inline">Đăng Xuất</span>
            </button>
          </div>
        </aside>

        <!-- Main Content (offset by sidebar width) -->
        <main class="flex-1 ml-16 lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto">
          ${content}
        </main>
      </div>
    `;
    }
    // ==================== DASHBOARD ====================
    async dashboard() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const [users, centers, courts, bookings, vouchers, reviews] = await Promise.all([
                UserService.getAll(),
                SportsCenterService.getAll(),
                CourtService.getAll(),
                BookingService.getAll(),
                VoucherService.getAll(),
                ReviewService.getAll(),
            ]);
            const completedBookings = bookings.filter((b) => b.booking_status === "completed");
            const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
            // Revenue by month (last 6 months)
            const monthlyRevenue = {};
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                monthlyRevenue[key] = 0;
            }
            completedBookings.forEach((b) => {
                const d = new Date(b.booking_date || b.created_at);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                if (monthlyRevenue[key] !== undefined) {
                    monthlyRevenue[key] += b.total_price || 0;
                }
            });
            const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1);
            const revenueBarChart = Object.entries(monthlyRevenue)
                .map(([month, revenue]) => {
                const pct = Math.round((revenue / maxRevenue) * 100);
                const label = month.split("-")[1] + "/" + month.split("-")[0];
                return `
            <div class="flex flex-col items-center gap-1 flex-1">
              <span class="text-xs font-semibold text-slate-600">${(revenue / 1000).toFixed(0)}K</span>
              <div class="w-full bg-slate-200 rounded-t-lg relative" style="height: 120px;">
                <div class="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all" style="height: ${Math.max(pct, 4)}%;"></div>
              </div>
              <span class="text-xs text-slate-500">${label}</span>
            </div>`;
            })
                .join("");
            // Recent bookings
            const recentBookings = [...bookings]
                .sort((a, b) => new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime())
                .slice(0, 5);
            const recentBookingsRows = recentBookings
                .map((b) => {
                const statusMap = {
                    pending: { label: "Chờ duyệt", cls: "badge-pending" },
                    confirmed: { label: "Đã duyệt", cls: "badge-confirmed" },
                    completed: { label: "Hoàn thành", cls: "badge-completed" },
                    cancelled: { label: "Đã hủy", cls: "badge-cancelled" },
                };
                const st = statusMap[b.booking_status] || {
                    label: b.booking_status,
                    cls: "badge-pending",
                };
                return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-4 py-2.5 text-sm font-semibold text-blue-700">${b.booking_code || "—"}</td>
              <td class="px-4 py-2.5 text-sm text-slate-600">${b.user_id?.name || "—"}</td>
              <td class="px-4 py-2.5 text-sm text-slate-600">${b.sport_center_id?.name || "—"}</td>
              <td class="px-4 py-2.5 text-sm font-semibold text-green-600">${(b.total_price || 0).toLocaleString("vi-VN")}đ</td>
              <td class="px-4 py-2.5"><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${st.cls}">${st.label}</span></td>
            </tr>`;
            })
                .join("");
            const stats = {
                totalUsers: users.length,
                owners: users.filter((u) => u.role === "owner").length,
                customers: users.filter((u) => u.role === "user").length,
                activeUsers: users.filter((u) => u.status === "active").length,
                totalCenters: centers.length,
                totalCourts: courts.length,
                totalBookings: bookings.length,
                pendingBookings: bookings.filter((b) => b.booking_status === "pending")
                    .length,
                confirmedBookings: bookings.filter((b) => b.booking_status === "confirmed").length,
                completedBookings: completedBookings.length,
                cancelledBookings: bookings.filter((b) => b.booking_status === "cancelled").length,
                totalVouchers: vouchers.length,
                totalReviews: reviews.length,
                totalRevenue,
            };
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-8">
            <h1 class="text-2xl lg:text-3xl font-bold text-slate-900 font-headline-lg">Bảng Điều Khiển</h1>
            <p class="text-slate-500 mt-1 text-sm">Tổng quan hệ thống Courtify</p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="stat-card bg-white rounded-xl shadow-sm p-5 border border-slate-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-blue-600">payments</span>
                </div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh Thu</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString("vi-VN")}đ</p>
              <p class="text-xs text-slate-400 mt-1">${stats.completedBookings} đơn hoàn thành</p>
            </div>
            <div class="stat-card bg-white rounded-xl shadow-sm p-5 border border-slate-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-green-600">people</span>
                </div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Người Dùng</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">${stats.totalUsers}</p>
              <p class="text-xs text-slate-400 mt-1">Owner: ${stats.owners} | Khách: ${stats.customers}</p>
            </div>
            <div class="stat-card bg-white rounded-xl shadow-sm p-5 border border-slate-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-orange-600">event_note</span>
                </div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn Đặt Sân</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">${stats.totalBookings}</p>
              <p class="text-xs text-slate-400 mt-1">Chờ: ${stats.pendingBookings} | Xác nhận: ${stats.confirmedBookings}</p>
            </div>
            <div class="stat-card bg-white rounded-xl shadow-sm p-5 border border-slate-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-purple-600">sports_tennis</span>
                </div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cụm Sân / Sân</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">${stats.totalCenters} / ${stats.totalCourts}</p>
              <p class="text-xs text-slate-400 mt-1">Voucher: ${stats.totalVouchers} | Đánh giá: ${stats.totalReviews}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenue Chart -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h2 class="text-lg font-bold text-slate-900 mb-4">Doanh Thu 6 Tháng Gần Nhất</h2>
              <div class="flex items-end gap-2 h-[180px]">
                ${revenueBarChart}
              </div>
            </div>

            <!-- Recent Bookings -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div class="p-6 pb-3">
                <h2 class="text-lg font-bold text-slate-900">Đơn Đặt Sân Gần Đây</h2>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full admin-table">
                  <thead>
                    <tr>
                      <th class="px-4 py-2.5 text-left">Mã</th>
                      <th class="px-4 py-2.5 text-left">Khách</th>
                      <th class="px-4 py-2.5 text-left">Cụm sân</th>
                      <th class="px-4 py-2.5 text-left">Giá</th>
                      <th class="px-4 py-2.5 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentBookingsRows || '<tr><td colspan="5" class="px-4 py-6 text-center text-slate-400 text-sm">Chưa có đơn nào</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div class="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-yellow-600 text-lg">hourglass_top</span>
              </div>
              <div>
                <p class="text-lg font-bold text-slate-900">${stats.pendingBookings}</p>
                <p class="text-xs text-slate-500">Chờ duyệt</p>
              </div>
            </div>
            <div class="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
              </div>
              <div>
                <p class="text-lg font-bold text-slate-900">${stats.confirmedBookings}</p>
                <p class="text-xs text-slate-500">Đã xác nhận</p>
              </div>
            </div>
            <div class="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-green-600 text-lg">task_alt</span>
              </div>
              <div>
                <p class="text-lg font-bold text-slate-900">${stats.completedBookings}</p>
                <p class="text-xs text-slate-500">Hoàn thành</p>
              </div>
            </div>
            <div class="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-red-600 text-lg">cancel</span>
              </div>
              <div>
                <p class="text-lg font-bold text-slate-900">${stats.cancelledBookings}</p>
                <p class="text-xs text-slate-500">Đã hủy</p>
              </div>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("dashboard", content);
        }
        catch (error) {
            console.error("Lỗi tải dashboard:", error);
            const app2 = this.getAppElement();
            if (app2)
                app2.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi tải dashboard.</div>`;
        }
    }
    // ==================== USERS ====================
    async usersList() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const users = await UserService.getAll();
            const rows = users
                .map((u) => `
          <tr class="border-b border-slate-100 hover:bg-slate-50/50">
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  ${(u.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p class="font-semibold text-slate-900">${u.name || "—"}</p>
                  <p class="text-xs text-slate-400">${u.phone || ""}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">${u.email}</td>
            <td class="px-4 py-3 text-sm">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin"
                ? "bg-red-100 text-red-700"
                : u.role === "owner"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"}">
                ${u.role === "admin" ? "Admin" : u.role === "owner" ? "Owner" : "Khách"}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === "active" ? "badge-active" : "badge-cancelled"}">
                ${u.status === "active" ? "Hoạt động" : "Bị khóa"}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              ${u.role !== "admin"
                ? `<button class="toggle-user-status px-3 py-1.5 text-xs rounded-lg font-semibold transition ${u.status === "active"
                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"}" data-id="${u._id}">
                      <span class="material-symbols-outlined text-[14px] align-middle mr-1">${u.status === "active" ? "lock" : "lock_open"}</span>
                      ${u.status === "active" ? "Khóa" : "Mở khóa"}
                    </button>`
                : '<span class="text-xs text-slate-400">—</span>'}
            </td>
          </tr>
        `)
                .join("");
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-6 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-slate-900 font-headline-lg">Quản lý Người Dùng</h1>
              <p class="text-slate-500 mt-1 text-sm">Tổng: ${users.length} người dùng (${users.filter((u) => u.status === "active").length} hoạt động)</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full admin-table">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left">Người dùng</th>
                    <th class="px-4 py-3 text-left">Email</th>
                    <th class="px-4 py-3 text-left">Vai trò</th>
                    <th class="px-4 py-3 text-left">Trạng thái</th>
                    <th class="px-4 py-3 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("users", content);
            this.initUsersEvents(users);
        }
        catch (error) {
            console.error("Lỗi tải danh sách user:", error);
            app.innerHTML = this.renderLayout("users", `<div class="p-8 text-center text-red-600">Lỗi tải danh sách người dùng.</div>`);
        }
    }
    initUsersEvents(users) {
        const buttons = document.querySelectorAll(".toggle-user-status");
        buttons.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const userId = e.currentTarget.getAttribute("data-id");
                if (!userId)
                    return;
                const user = users.find((u) => u._id === userId);
                if (!user)
                    return;
                const newStatus = user.status === "active" ? "inactive" : "active";
                const action = newStatus === "active" ? "mở khóa" : "khóa";
                if (confirm(`Bạn chắc chắn muốn ${action} tài khoản "${user.name}"?`)) {
                    try {
                        await UserService.update(userId, { status: newStatus });
                        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} thành công!`);
                        this.usersList();
                    }
                    catch (error) {
                        alert(error.message || `Lỗi ${action} tài khoản.`);
                    }
                }
            });
        });
    }
    // ==================== CENTERS ====================
    async centersList() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const centers = await SportsCenterService.getAll();
            const rows = centers
                .map((c) => `
          <tr class="border-b border-slate-100 hover:bg-slate-50/50">
            <td class="px-4 py-3 text-sm font-semibold text-slate-900">${c.name}</td>
            <td class="px-4 py-3 text-sm text-slate-600">${typeof c.owner_id === "object" && c.owner_id !== null ? c.owner_id.name : "—"}</td>
            <td class="px-4 py-3 text-sm text-slate-600">${c.address || c.location || "—"}</td>
            <td class="px-4 py-3 text-sm text-slate-600">${typeof c.sport_id === "object" && c.sport_id !== null ? c.sport_id.name : "—"}</td>
            <td class="px-4 py-3 text-sm">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "active" ? "badge-active" : "badge-inactive"}">
                ${c.status === "active" ? "Hoạt động" : "Không hoạt động"}
              </span>
            </td>
          </tr>
        `)
                .join("");
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 font-headline-lg">Quản lý Cụm Sân</h1>
            <p class="text-slate-500 mt-1 text-sm">Tổng: ${centers.length} cụm sân</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full admin-table">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left">Tên Cụm Sân</th>
                    <th class="px-4 py-3 text-left">Chủ Sân</th>
                    <th class="px-4 py-3 text-left">Địa chỉ</th>
                    <th class="px-4 py-3 text-left">Môn Thể Thao</th>
                    <th class="px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("centers", content);
        }
        catch (error) {
            console.error("Lỗi tải danh sách center:", error);
            app.innerHTML = this.renderLayout("centers", `<div class="p-8 text-center text-red-600">Lỗi tải danh sách cụm sân.</div>`);
        }
    }
    // ==================== COURTS ====================
    async courtsList() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const courts = await CourtService.getAll();
            const rows = courts
                .map((c) => {
                const centerName = typeof c.sport_center_id === "object" && c.sport_center_id
                    ? c.sport_center_id.name
                    : "—";
                const statusCls = c.status === "active"
                    ? "badge-active"
                    : c.status === "maintenance"
                        ? "badge-maintenance"
                        : "badge-inactive";
                const statusLabel = c.status === "active"
                    ? "Hoạt động"
                    : c.status === "maintenance"
                        ? "Bảo trì"
                        : "Ngưng";
                return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-4 py-3 text-sm font-semibold text-slate-900">${c.name}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${centerName}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${c.description || "—"}</td>
              <td class="px-4 py-3 text-sm">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${statusCls}">${statusLabel}</span>
              </td>
            </tr>`;
            })
                .join("");
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 font-headline-lg">Quản lý Sân</h1>
            <p class="text-slate-500 mt-1 text-sm">Tổng: ${courts.length} sân</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full admin-table">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left">Tên Sân</th>
                    <th class="px-4 py-3 text-left">Cụm Sân</th>
                    <th class="px-4 py-3 text-left">Mô Tả</th>
                    <th class="px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("courts", content);
        }
        catch (error) {
            console.error("Lỗi tải danh sách court:", error);
            app.innerHTML = this.renderLayout("courts", `<div class="p-8 text-center text-red-600">Lỗi tải danh sách sân.</div>`);
        }
    }
    // ==================== BOOKINGS ====================
    async bookingsList() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const bookings = await BookingService.getAll();
            // Sort by date desc
            bookings.sort((a, b) => new Date(b.created_at || b.booking_date || 0).getTime() -
                new Date(a.created_at || a.booking_date || 0).getTime());
            const rows = bookings
                .map((b) => {
                const statusMap = {
                    pending: { label: "Chờ duyệt", cls: "badge-pending" },
                    confirmed: { label: "Đã duyệt", cls: "badge-confirmed" },
                    completed: { label: "Hoàn thành", cls: "badge-completed" },
                    cancelled: { label: "Đã hủy", cls: "badge-cancelled" },
                };
                const st = statusMap[b.booking_status] || {
                    label: b.booking_status,
                    cls: "badge-pending",
                };
                const paymentStatus = b.payment_status === "paid"
                    ? '<span class="text-green-600 font-semibold">Đã TT</span>'
                    : '<span class="text-orange-600 font-semibold">Chưa TT</span>';
                return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-4 py-3 text-sm font-semibold text-blue-700">${b.booking_code || "—"}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${b.user_id?.name || "—"}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${b.sport_center_id?.name || "—"}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${new Date(b.booking_date).toLocaleDateString("vi-VN")}</td>
              <td class="px-4 py-3 text-sm font-semibold text-green-600">${(b.total_price || 0).toLocaleString("vi-VN")}đ</td>
              <td class="px-4 py-3 text-sm">${paymentStatus}</td>
              <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${st.cls}">${st.label}</span></td>
            </tr>`;
            })
                .join("");
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 font-headline-lg">Quản lý Đơn Đặt Sân</h1>
            <p class="text-slate-500 mt-1 text-sm">Tổng: ${bookings.length} đơn</p>
          </div>

          <!-- Filter tabs -->
          <div class="flex gap-2 mb-4 flex-wrap">
            <button class="booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-blue-600 text-white transition" data-filter="all">Tất cả (${bookings.length})</button>
            <button class="booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition" data-filter="pending">Chờ duyệt (${bookings.filter((b) => b.booking_status === "pending").length})</button>
            <button class="booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition" data-filter="confirmed">Đã duyệt (${bookings.filter((b) => b.booking_status === "confirmed").length})</button>
            <button class="booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition" data-filter="completed">Hoàn thành (${bookings.filter((b) => b.booking_status === "completed").length})</button>
            <button class="booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition" data-filter="cancelled">Đã hủy (${bookings.filter((b) => b.booking_status === "cancelled").length})</button>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full admin-table">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left">Mã Đặt</th>
                    <th class="px-4 py-3 text-left">Khách</th>
                    <th class="px-4 py-3 text-left">Cụm Sân</th>
                    <th class="px-4 py-3 text-left">Ngày</th>
                    <th class="px-4 py-3 text-left">Giá</th>
                    <th class="px-4 py-3 text-left">Thanh Toán</th>
                    <th class="px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody id="bookings-tbody">
                  ${rows || '<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("bookings", content);
            this.initBookingsFilter();
        }
        catch (error) {
            console.error("Lỗi tải danh sách booking:", error);
            app.innerHTML = this.renderLayout("bookings", `<div class="p-8 text-center text-red-600">Lỗi tải danh sách đặt sân.</div>`);
        }
    }
    initBookingsFilter() {
        const filterButtons = document.querySelectorAll(".booking-filter-btn");
        const tbody = document.getElementById("bookings-tbody");
        if (!tbody)
            return;
        const rows = tbody.querySelectorAll("tr");
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) => {
                    b.className =
                        "booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
                });
                btn.className =
                    "booking-filter-btn px-4 py-2 text-xs font-semibold rounded-full bg-blue-600 text-white transition";
                const filter = btn.getAttribute("data-filter");
                rows.forEach((row) => {
                    const statusCell = row.querySelector("td:last-child span");
                    if (!statusCell)
                        return;
                    const statusText = statusCell.textContent?.trim() || "";
                    const statusMap = {
                        "Chờ duyệt": "pending",
                        "Đã duyệt": "confirmed",
                        "Hoàn thành": "completed",
                        "Đã hủy": "cancelled",
                    };
                    const rowStatus = statusMap[statusText] || "";
                    if (filter === "all" || rowStatus === filter) {
                        row.style.display = "";
                    }
                    else {
                        row.style.display = "none";
                    }
                });
            });
        });
    }
    // ==================== VOUCHERS ====================
    async vouchersList() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const vouchers = await VoucherService.getAll();
            const rows = vouchers
                .map((v) => {
                const centerName = typeof v.sport_center_id === "object" && v.sport_center_id
                    ? v.sport_center_id.name
                    : "—";
                const ownerName = typeof v.owner_id === "object" && v.owner_id
                    ? v.owner_id.name
                    : "—";
                const statusCls = v.status === "active"
                    ? "badge-active"
                    : v.status === "inactive"
                        ? "badge-inactive"
                        : "badge-expired";
                return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-4 py-3"><span class="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">${v.code}</span></td>
              <td class="px-4 py-3 text-sm text-slate-600">${ownerName}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${centerName}</td>
              <td class="px-4 py-3 text-sm font-semibold text-slate-900">${v.discount_percent}%</td>
              <td class="px-4 py-3 text-sm text-slate-600">${(v.max_discount || 0).toLocaleString("vi-VN")}đ</td>
              <td class="px-4 py-3 text-sm text-slate-600">${new Date(v.start_date).toLocaleDateString("vi-VN")} - ${new Date(v.end_date).toLocaleDateString("vi-VN")}</td>
              <td class="px-4 py-3 text-sm text-slate-600">${v.used_count}/${v.usage_limit}</td>
              <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${statusCls}">${v.status}</span></td>
            </tr>`;
            })
                .join("");
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 font-headline-lg">Quản lý Voucher</h1>
            <p class="text-slate-500 mt-1 text-sm">Tổng: ${vouchers.length} voucher</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full admin-table">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left">Mã</th>
                    <th class="px-4 py-3 text-left">Chủ Sân</th>
                    <th class="px-4 py-3 text-left">Cụm Sân</th>
                    <th class="px-4 py-3 text-left">Giảm</th>
                    <th class="px-4 py-3 text-left">Tối đa</th>
                    <th class="px-4 py-3 text-left">Thời hạn</th>
                    <th class="px-4 py-3 text-left">Đã dùng</th>
                    <th class="px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="8" class="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("vouchers", content);
        }
        catch (error) {
            console.error("Lỗi tải danh sách voucher:", error);
            app.innerHTML = this.renderLayout("vouchers", `<div class="p-8 text-center text-red-600">Lỗi tải danh sách voucher.</div>`);
        }
    }
    // ==================== REVIEWS ====================
    async reviewsList() {
        const app = this.getAppElement();
        if (!app)
            return;
        try {
            const reviews = await ReviewService.getAll();
            // Calculate average rating
            const avgRating = reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                    reviews.length).toFixed(1)
                : "0";
            // Rating distribution
            const ratingDist = [0, 0, 0, 0, 0];
            reviews.forEach((r) => {
                if (r.rating >= 1 && r.rating <= 5) {
                    ratingDist[r.rating - 1]++;
                }
            });
            const ratingDistBars = ratingDist
                .map((count, i) => {
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return `
            <div class="flex items-center gap-2 text-sm">
              <span class="w-6 text-right font-medium text-slate-600">${i + 1}★</span>
              <div class="flex-1 bg-slate-200 rounded-full h-2.5">
                <div class="bg-yellow-400 h-2.5 rounded-full" style="width: ${pct}%"></div>
              </div>
              <span class="w-8 text-right text-xs text-slate-500">${count}</span>
            </div>`;
            })
                .reverse()
                .join("");
            const rows = reviews
                .map((r) => `
          <tr class="border-b border-slate-100 hover:bg-slate-50/50">
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">
                  ${(r.user_id?.name || "?").charAt(0).toUpperCase()}
                </div>
                <span class="font-medium text-slate-900">${r.user_id?.name || "—"}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">${r.sport_center_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">
              <div class="flex gap-0.5">
                ${Array.from({ length: 5 })
                .map((_, i) => `<span class="text-base ${i < (r.rating || 0) ? "text-yellow-400" : "text-slate-300"}">★</span>`)
                .join("")}
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">${r.comment || "—"}</td>
            <td class="px-4 py-3 text-sm text-slate-400">${new Date(r.created_at).toLocaleDateString("vi-VN")}</td>
            <td class="px-4 py-3 text-sm">
              <button class="delete-review-btn text-red-500 hover:text-red-700 transition" data-id="${r._id}" title="Xóa">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </td>
          </tr>
        `)
                .join("");
            const content = `
        <div class="p-6 lg:p-8">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 font-headline-lg">Quản lý Đánh Giá</h1>
            <p class="text-slate-500 mt-1 text-sm">Tổng: ${reviews.length} đánh giá</p>
          </div>

          <!-- Rating Overview -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center">
              <p class="text-4xl font-bold text-slate-900">${avgRating}</p>
              <div class="flex gap-0.5 my-2">
                ${Array.from({ length: 5 })
                .map((_, i) => `<span class="text-xl ${i < Math.round(parseFloat(avgRating)) ? "text-yellow-400" : "text-slate-300"}">★</span>`)
                .join("")}
              </div>
              <p class="text-xs text-slate-500">${reviews.length} đánh giá</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 col-span-2">
              <div class="space-y-2">
                ${ratingDistBars}
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full admin-table">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left">Khách Hàng</th>
                    <th class="px-4 py-3 text-left">Cụm Sân</th>
                    <th class="px-4 py-3 text-left">Đánh Giá</th>
                    <th class="px-4 py-3 text-left">Bình Luận</th>
                    <th class="px-4 py-3 text-left">Ngày</th>
                    <th class="px-4 py-3 text-left">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
            app.innerHTML = this.renderLayout("reviews", content);
            this.initReviewsEvents();
        }
        catch (error) {
            console.error("Lỗi tải danh sách review:", error);
            app.innerHTML = this.renderLayout("reviews", `<div class="p-8 text-center text-red-600">Lỗi tải danh sách đánh giá.</div>`);
        }
    }
    initReviewsEvents() {
        const deleteButtons = document.querySelectorAll(".delete-review-btn");
        deleteButtons.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const reviewId = e.currentTarget.getAttribute("data-id");
                if (!reviewId)
                    return;
                if (confirm("Bạn chắc chắn muốn xóa đánh giá này?")) {
                    try {
                        await ReviewService.delete(reviewId);
                        alert("Xóa đánh giá thành công!");
                        this.reviewsList();
                    }
                    catch (error) {
                        alert(error.message || "Lỗi xóa đánh giá.");
                    }
                }
            });
        });
    }
}
//# sourceMappingURL=AdminController.js.map
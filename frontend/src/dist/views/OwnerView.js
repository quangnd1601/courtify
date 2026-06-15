// Helper format tiền VND
const formatMoney = (n) => n.toLocaleString("vi-VN");
// Helper format ảnh
const getImageUrl = (url, fallback = "") => {
    if (!url)
        return fallback;
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return `http://localhost:8080${url}`;
};
// Helper format ngày
const formatDate = (d) => {
    if (!d)
        return "—";
    const date = new Date(d);
    return date.toLocaleDateString("vi-VN");
};
// Status badge helpers
const bookingStatusBadge = (status) => {
    const map = {
        pending: { cls: "badge-pending", text: "Chờ duyệt" },
        confirmed: { cls: "badge-confirmed", text: "Đã xác nhận" },
        completed: { cls: "badge-completed", text: "Đã hoàn thành" },
        cancelled: { cls: "badge-cancelled", text: "Đã hủy" },
    };
    const info = map[status] || { cls: "badge-inactive", text: status };
    return `<span class="px-2 py-0.5 rounded-full text-xs font-semibold ${info.cls}">${info.text}</span>`;
};
const statusBadge = (status) => {
    const map = {
        active: "badge-active",
        inactive: "badge-inactive",
        maintenance: "badge-maintenance",
        expired: "badge-expired",
    };
    const textMap = {
        active: "Hoạt động",
        inactive: "Không HĐ",
        maintenance: "Bảo trì",
        expired: "Hết hạn",
    };
    return `<span class="px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || "badge-inactive"}">${textMap[status] || status}</span>`;
};
// Sidebar component
const renderSidebar = (active) => {
    const menuItems = [
        { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "owner.html" },
        { key: "centers", label: "Cụm sân", icon: "stadium", href: "owner.html?ctrl=centers" },
        { key: "courts", label: "Sân", icon: "sports_tennis", href: "owner.html?ctrl=courts" },
        { key: "bookings", label: "Booking", icon: "event_note", href: "owner.html?ctrl=bookings" },
        { key: "vouchers", label: "Voucher", icon: "confirmation_number", href: "owner.html?ctrl=vouchers" },
    ];
    const items = menuItems
        .map((m) => `
    <a href="${m.href}" class="flex items-center gap-3 px-4 py-3 text-sm text-white/90 rounded-lg transition-all ${active === m.key ? "active font-bold" : ""}">
      <span class="material-symbols-outlined text-[20px]">${m.icon}</span>
      ${m.label}
    </a>`)
        .join("");
    return `
    <aside class="owner-sidebar w-64 min-h-screen flex flex-col fixed top-0 left-0 z-40">
      <div class="p-6 border-b border-white/10">
        <a href="index.html" class="font-headline-xl text-xl font-bold text-white">Courtify</a>
        <p class="text-xs text-white/50 mt-1">Owner Dashboard</p>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        ${items}
      </nav>
      <div class="p-4 border-t border-white/10">
        <a href="index.html" class="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white rounded-lg transition-colors">
          <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          Về trang chủ
        </a>
      </div>
    </aside>
  `;
};
// Main layout wrapper
const renderLayout = (content, active, title) => {
    return `
    <div class="flex min-h-screen">
      ${renderSidebar(active)}
      <main class="flex-1 ml-64">
        <header class="bg-white border-b border-outline-variant/20 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <h1 class="font-headline-md text-headline-md text-primary">${title}</h1>
          <div class="flex items-center gap-3">
            <span class="text-sm text-on-surface-variant">Owner</span>
            <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">O</div>
          </div>
        </header>
        <div class="p-8">
          ${content}
        </div>
      </main>
    </div>
  `;
};
const OwnerView = {
    // ==================== DASHBOARD ====================
    renderDashboard: (stats) => {
        const cards = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-card bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-green-600">payments</span>
            </div>
            <span class="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">Doanh thu</span>
          </div>
          <p class="text-2xl font-bold text-on-surface">${formatMoney(stats.totalRevenue)}đ</p>
          <p class="text-xs text-on-surface-variant mt-1">Tổng doanh thu</p>
        </div>
        <div class="stat-card bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-blue-600">event_note</span>
            </div>
            <span class="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">Booking</span>
          </div>
          <p class="text-2xl font-bold text-on-surface">${stats.totalBookings}</p>
          <p class="text-xs text-on-surface-variant mt-1">Tổng lượt đặt</p>
        </div>
        <div class="stat-card bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-purple-600">stadium</span>
            </div>
            <span class="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-full">Cụm sân</span>
          </div>
          <p class="text-2xl font-bold text-on-surface">${stats.totalCenters}</p>
          <p class="text-xs text-on-surface-variant mt-1">Cụm sân đang quản lý</p>
        </div>
        <div class="stat-card bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-orange-600">sports_tennis</span>
            </div>
            <span class="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-full">Sân</span>
          </div>
          <p class="text-2xl font-bold text-on-surface">${stats.totalCourts}</p>
          <p class="text-xs text-on-surface-variant mt-1">Sân đang hoạt động</p>
        </div>
      </div>
    `;
        // Booking stats by status
        const bookingStats = `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-amber-700">${stats.pendingBookings}</p>
          <p class="text-xs text-amber-600 mt-1">Chờ duyệt</p>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-blue-700">${stats.confirmedBookings}</p>
          <p class="text-xs text-blue-600 mt-1">Đã xác nhận</p>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-700">${stats.completedBookings}</p>
          <p class="text-xs text-green-600 mt-1">Hoàn thành</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-red-700">${stats.cancelledBookings}</p>
          <p class="text-xs text-red-600 mt-1">Đã hủy</p>
        </div>
      </div>
    `;
        // Recent bookings table
        const recentRows = stats.recentBookings.length > 0
            ? stats.recentBookings
                .map((b) => `
          <tr class="border-b border-outline-variant/10">
            <td class="px-4 py-3 text-sm font-semibold text-primary">${b.booking_code || "—"}</td>
            <td class="px-4 py-3 text-sm">${b.user_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">${b.sport_center_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">${b.court_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">${formatDate(b.booking_date)}</td>
            <td class="px-4 py-3 text-sm font-semibold">${formatMoney(b.total_price || 0)}đ</td>
            <td class="px-4 py-3">${bookingStatusBadge(b.booking_status)}</td>
          </tr>`)
                .join("")
            : `<tr><td colspan="7" class="px-4 py-8 text-center text-on-surface-variant text-sm">Chưa có booking nào.</td></tr>`;
        const recentTable = `
      <div class="mt-8 bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-outline-variant/10">
          <h3 class="font-headline-md text-md text-on-surface font-bold">Booking gần đây</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="owner-table w-full">
            <thead>
              <tr class="border-b border-outline-variant/20">
                <th class="px-4 py-3 text-left">Mã</th>
                <th class="px-4 py-3 text-left">Khách hàng</th>
                <th class="px-4 py-3 text-left">Cụm sân</th>
                <th class="px-4 py-3 text-left">Sân</th>
                <th class="px-4 py-3 text-left">Ngày</th>
                <th class="px-4 py-3 text-left">Tổng tiền</th>
                <th class="px-4 py-3 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${recentRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
        const content = cards + bookingStats + recentTable;
        return renderLayout(content, "dashboard", "Dashboard");
    },
    // ==================== CENTERS LIST ====================
    renderCentersList: (centers) => {
        const rows = centers.length > 0
            ? centers
                .map((c) => `
          <tr class="border-b border-outline-variant/10">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img src="${c.thumbnail ? 'http://localhost:8080' + c.thumbnail : 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100'}" 
                     class="w-12 h-12 rounded-lg object-cover border border-outline-variant/20" alt="${c.name}" />
                <div>
                  <p class="font-bold text-sm text-on-surface">${c.name}</p>
                  <p class="text-xs text-on-surface-variant line-clamp-1">${c.address}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">${typeof c.sport_id === "object" ? c.sport_id.name : "—"}</td>
            <td class="px-4 py-3 text-sm">${c.booking_count}</td>
            <td class="px-4 py-3 text-sm">
              ${c.pricing && c.pricing.length > 0
                ? c.pricing.map((p) => `${formatMoney(p.price)}đ`).join(" / ")
                : "—"}
            </td>
            <td class="px-4 py-3">${statusBadge(c.status)}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <a href="owner.html?ctrl=centers&act=edit&id=${c._id}" class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold">Sửa</a>
                <button onclick="ownerDeleteCenter('${c._id}')" class="px-3 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold">Xóa</button>
              </div>
            </td>
          </tr>`)
                .join("")
            : `<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-sm">Chưa có cụm sân nào. Hãy tạo mới!</td></tr>`;
        const content = `
      <div class="flex justify-between items-center mb-6">
        <p class="text-sm text-on-surface-variant">${centers.length} cụm sân</p>
        <a href="owner.html?ctrl=centers&act=add" class="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">add</span> Thêm cụm sân
        </a>
      </div>
      <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="owner-table w-full">
            <thead>
              <tr class="border-b border-outline-variant/20">
                <th class="px-4 py-3 text-left">Cụm sân</th>
                <th class="px-4 py-3 text-left">Môn</th>
                <th class="px-4 py-3 text-left">Booking</th>
                <th class="px-4 py-3 text-left">Giá</th>
                <th class="px-4 py-3 text-left">Trạng thái</th>
                <th class="px-4 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
        return renderLayout(content, "centers", "Quản lý Cụm sân");
    },
    // ==================== CENTER FORM ====================
    renderCenterForm: (center, sports) => {
        const isEdit = !!center;
        const sportOptions = sports
            .map((s) => `<option value="${s._id}" ${center && typeof center.sport_id === "object" && center.sport_id._id === s._id ? "selected" : ""}>${s.name}</option>`)
            .join("");
        // Build pricing rows
        let pricingRows = "";
        if (center && center.pricing && center.pricing.length > 0) {
            pricingRows = center.pricing
                .map((p, i) => `
        <div class="grid grid-cols-3 gap-3 pricing-row">
          <input type="text" name="pricing_start_${i}" value="${p.start_time}" placeholder="VD: 05:00" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
          <input type="text" name="pricing_end_${i}" value="${p.end_time}" placeholder="VD: 17:00" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
          <input type="number" name="pricing_price_${i}" value="${p.price}" placeholder="Giá (VND)" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
        </div>`)
                .join("");
        }
        else {
            pricingRows = `
        <div class="grid grid-cols-3 gap-3 pricing-row">
          <input type="text" name="pricing_start_0" placeholder="VD: 05:00" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
          <input type="text" name="pricing_end_0" placeholder="VD: 17:00" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
          <input type="number" name="pricing_price_0" placeholder="Giá (VND)" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
        </div>`;
        }
        const content = `
      <div class="w-full">
        <a href="owner.html?ctrl=centers" class="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6 transition">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại
        </a>
        <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-8">
          <h2 class="font-bold text-lg text-on-surface mb-6">${isEdit ? "Chỉnh sửa Cụm sân" : "Tạo Cụm sân mới"}</h2>
          <form id="center-form" class="space-y-5">
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tên cụm sân *</label>
              <input type="text" id="center-name" value="${center?.name || ""}" required
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Địa chỉ *</label>
              <input type="text" id="center-address" value="${center?.address || ""}" required
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Khu vực</label>
              <input type="text" id="center-location" value="${center?.location || ""}" placeholder="VD: Hà Nội, TP.HCM"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Môn thể thao *</label>
              <select id="center-sport" required
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">
                <option value="">-- Chọn môn --</option>
                ${sportOptions}
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mô tả</label>
              <textarea id="center-description" rows="3"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">${center?.description || ""}</textarea>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Ảnh đại diện (Thumbnail)</label>
              <div class="flex items-center gap-4 mt-2">
                <img id="center-thumbnail-preview" src="${center?.thumbnail ? 'http://localhost:8080' + center.thumbnail : 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=120'}" 
                     class="w-20 h-20 object-cover rounded-lg border border-outline-variant/30" />
                <div class="flex-1">
                  <input type="file" id="center-thumbnail-file" accept="image/*" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  <input type="hidden" id="center-thumbnail" value="${center?.thumbnail || ""}" />
                </div>
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Thư viện ảnh (Gallery)</label>
              <div class="mt-2 space-y-3">
                <input type="file" id="center-gallery-files" accept="image/*" multiple class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                <div id="center-gallery-previews" class="flex flex-wrap gap-3">
                  ${center?.gallery && center.gallery.length > 0
            ? center.gallery.map(img => `
                          <div class="relative w-20 h-20 group rounded-lg overflow-hidden border border-outline-variant/30">
                            <img src="http://localhost:8080${img}" class="w-full h-full object-cover" />
                            <button type="button" class="delete-gallery-img absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xs font-bold" data-url="${img}">Xóa</button>
                          </div>
                        `).join("")
            : ""}
                </div>
                <input type="hidden" id="center-gallery" value='${JSON.stringify(center?.gallery || [])}' />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Bảng giá</label>
              <div class="grid grid-cols-3 gap-3 mb-2 mt-1">
                <span class="text-[10px] text-on-surface-variant uppercase font-bold">Bắt đầu</span>
                <span class="text-[10px] text-on-surface-variant uppercase font-bold">Kết thúc</span>
                <span class="text-[10px] text-on-surface-variant uppercase font-bold">Giá (VND)</span>
              </div>
              <div id="pricing-rows" class="space-y-2">
                ${pricingRows}
              </div>
              <button type="button" id="add-pricing-btn" class="mt-2 text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">add</span> Thêm khung giá
              </button>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Trạng thái</label>
              <select id="center-status"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">
                <option value="active" ${center?.status === "active" ? "selected" : ""}>Hoạt động</option>
                <option value="inactive" ${center?.status === "inactive" ? "selected" : ""}>Không hoạt động</option>
              </select>
            </div>
            <div class="pt-4 border-t border-outline-variant/20">
              <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:scale-[0.98]">
                ${isEdit ? "Cập nhật Cụm sân" : "Tạo Cụm sân"}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
        return renderLayout(content, "centers", isEdit ? "Chỉnh sửa Cụm sân" : "Thêm Cụm sân");
    },
    // ==================== COURTS LIST ====================
    renderCourtsList: (courts, centers) => {
        // Build a map of center id -> center name
        const centerMap = {};
        centers.forEach((c) => {
            centerMap[c._id] = c.name;
        });
        const rows = courts.length > 0
            ? courts
                .map((c) => `
          <tr class="border-b border-outline-variant/10">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img src="${c.thumbnail ? 'http://localhost:8080' + c.thumbnail : 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100'}" 
                     class="w-12 h-12 rounded-lg object-cover border border-outline-variant/20" alt="${c.name}" />
                <div>
                  <p class="font-bold text-sm text-on-surface">${c.name}</p>
                  <p class="text-xs text-on-surface-variant">${c.description || "—"}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">${centerMap[c.sport_center_id] || c.sport_center_id}</td>
            <td class="px-4 py-3 text-sm">${c.booking_count}</td>
            <td class="px-4 py-3">${statusBadge(c.status)}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <a href="owner.html?ctrl=courts&act=edit&id=${c._id}" class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold">Sửa</a>
                <button onclick="ownerDeleteCourt('${c._id}')" class="px-3 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold">Xóa</button>
              </div>
            </td>
          </tr>`)
                .join("")
            : `<tr><td colspan="5" class="px-4 py-8 text-center text-on-surface-variant text-sm">Chưa có sân nào.</td></tr>`;
        const content = `
      <div class="flex justify-between items-center mb-6">
        <p class="text-sm text-on-surface-variant">${courts.length} sân</p>
        <a href="owner.html?ctrl=courts&act=add" class="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">add</span> Thêm sân
        </a>
      </div>
      <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="owner-table w-full">
            <thead>
              <tr class="border-b border-outline-variant/20">
                <th class="px-4 py-3 text-left">Sân</th>
                <th class="px-4 py-3 text-left">Cụm sân</th>
                <th class="px-4 py-3 text-left">Booking</th>
                <th class="px-4 py-3 text-left">Trạng thái</th>
                <th class="px-4 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
        return renderLayout(content, "courts", "Quản lý Sân");
    },
    // ==================== COURT FORM ====================
    renderCourtForm: (court, centers) => {
        const isEdit = !!court;
        const centerOptions = centers
            .map((c) => `<option value="${c._id}" ${court && court.sport_center_id === c._id ? "selected" : ""}>${c.name}</option>`)
            .join("");
        const content = `
      <div class="w-full">
        <a href="owner.html?ctrl=courts" class="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6 transition">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại
        </a>
        <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-8">
          <h2 class="font-bold text-lg text-on-surface mb-6">${isEdit ? "Chỉnh sửa Sân" : "Tạo Sân mới"}</h2>
          <form id="court-form" class="space-y-5">
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Thuộc cụm sân *</label>
              <select id="court-center" required
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">
                <option value="">-- Chọn cụm sân --</option>
                ${centerOptions}
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tên sân *</label>
              <input type="text" id="court-name" value="${court?.name || ""}" required
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mô tả</label>
              <textarea id="court-description" rows="3"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">${court?.description || ""}</textarea>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Ảnh đại diện (Thumbnail)</label>
              <div class="flex items-center gap-4 mt-2">
                <img id="court-thumbnail-preview" src="${court?.thumbnail ? 'http://localhost:8080' + court.thumbnail : 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=120'}" 
                     class="w-20 h-20 object-cover rounded-lg border border-outline-variant/30" />
                <div class="flex-1">
                  <input type="file" id="court-thumbnail-file" accept="image/*" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  <input type="hidden" id="court-thumbnail" value="${court?.thumbnail || ""}" />
                </div>
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Trạng thái</label>
              <select id="court-status"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">
                <option value="active" ${court?.status === "active" ? "selected" : ""}>Hoạt động</option>
                <option value="maintenance" ${court?.status === "maintenance" ? "selected" : ""}>Bảo trì</option>
                <option value="inactive" ${court?.status === "inactive" ? "selected" : ""}>Không hoạt động</option>
              </select>
            </div>
            <div class="pt-4 border-t border-outline-variant/20">
              <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:scale-[0.98]">
                ${isEdit ? "Cập nhật Sân" : "Tạo Sân"}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
        return renderLayout(content, "courts", isEdit ? "Chỉnh sửa Sân" : "Thêm Sân");
    },
    // ==================== BOOKINGS ====================
    renderBookings: (bookings) => {
        const rows = bookings.length > 0
            ? bookings
                .map((b) => `
          <tr class="border-b border-outline-variant/10 booking-row" data-status="${b.booking_status}">
            <td class="px-4 py-3 text-sm font-semibold text-primary">${b.booking_code || "—"}</td>
            <td class="px-4 py-3 text-sm">${b.user_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">${b.sport_center_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">${b.court_id?.name || "—"}</td>
            <td class="px-4 py-3 text-sm">${formatDate(b.booking_date)}</td>
            <td class="px-4 py-3 text-sm">
              ${b.slots?.map((s) => `${s.start_time}-${s.end_time}`).join(", ") || "—"}
            </td>
            <td class="px-4 py-3 text-sm font-semibold">${formatMoney(b.total_price || 0)}đ</td>
            <td class="px-4 py-3">${bookingStatusBadge(b.booking_status)}</td>
            <td class="px-4 py-3">
              <div class="flex gap-1">
                ${b.booking_status === "pending" ? `
                  <button data-id="${b._id}" data-action="confirmed" class="booking-action-btn px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold">Duyệt</button>
                  <button data-id="${b._id}" data-action="cancelled" class="booking-action-btn px-2 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold">Hủy</button>
                ` : ""}
                ${b.booking_status === "confirmed" ? `
                  <button data-id="${b._id}" data-action="completed" class="booking-action-btn px-2 py-1 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold">Hoàn thành</button>
                  <button data-id="${b._id}" data-action="cancelled" class="booking-action-btn px-2 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold">Hủy</button>
                ` : ""}
              </div>
            </td>
          </tr>`)
                .join("")
            : `<tr><td colspan="9" class="px-4 py-8 text-center text-on-surface-variant text-sm">Chưa có booking nào.</td></tr>`;
        const content = `
      <div class="mb-6">
        <div class="flex gap-2 flex-wrap" id="booking-filter-tabs">
          <button data-filter="all" class="booking-filter-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-primary text-white transition-all">Tất cả</button>
          <button data-filter="pending" class="booking-filter-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-on-surface-variant border border-outline-variant/30 hover:bg-primary/5 transition-all">Chờ duyệt</button>
          <button data-filter="confirmed" class="booking-filter-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-on-surface-variant border border-outline-variant/30 hover:bg-primary/5 transition-all">Đã xác nhận</button>
          <button data-filter="completed" class="booking-filter-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-on-surface-variant border border-outline-variant/30 hover:bg-primary/5 transition-all">Hoàn thành</button>
          <button data-filter="cancelled" class="booking-filter-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-on-surface-variant border border-outline-variant/30 hover:bg-primary/5 transition-all">Đã hủy</button>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="owner-table w-full">
            <thead>
              <tr class="border-b border-outline-variant/20">
                <th class="px-4 py-3 text-left">Mã</th>
                <th class="px-4 py-3 text-left">Khách hàng</th>
                <th class="px-4 py-3 text-left">Cụm sân</th>
                <th class="px-4 py-3 text-left">Sân</th>
                <th class="px-4 py-3 text-left">Ngày</th>
                <th class="px-4 py-3 text-left">Khung giờ</th>
                <th class="px-4 py-3 text-left">Tổng tiền</th>
                <th class="px-4 py-3 text-left">Trạng thái</th>
                <th class="px-4 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody id="bookings-tbody">
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
        return renderLayout(content, "bookings", "Quản lý Booking");
    },
    // ==================== VOUCHERS LIST ====================
    renderVouchersList: (vouchers) => {
        const rows = vouchers.length > 0
            ? vouchers
                .map((v) => `
          <tr class="border-b border-outline-variant/10">
            <td class="px-4 py-3">
              <span class="font-bold text-sm text-primary bg-primary-fixed/30 px-2 py-1 rounded-lg">${v.code}</span>
            </td>
            <td class="px-4 py-3 text-sm">${v.description || "—"}</td>
            <td class="px-4 py-3 text-sm font-semibold">${v.discount_percent}%</td>
            <td class="px-4 py-3 text-sm">${formatMoney(v.max_discount)}đ</td>
            <td class="px-4 py-3 text-sm">${formatMoney(v.min_order)}đ</td>
            <td class="px-4 py-3 text-sm">${formatDate(v.start_date)} - ${formatDate(v.end_date)}</td>
            <td class="px-4 py-3 text-sm">${v.used_count}/${v.usage_limit}</td>
            <td class="px-4 py-3">${statusBadge(v.status)}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <a href="owner.html?ctrl=vouchers&act=edit&id=${v._id}" class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold">Sửa</a>
                <button onclick="ownerDeleteVoucher('${v._id}')" class="px-3 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold">Xóa</button>
              </div>
            </td>
          </tr>`)
                .join("")
            : `<tr><td colspan="9" class="px-4 py-8 text-center text-on-surface-variant text-sm">Chưa có voucher nào.</td></tr>`;
        const content = `
      <div class="flex justify-between items-center mb-6">
        <p class="text-sm text-on-surface-variant">${vouchers.length} voucher</p>
        <a href="owner.html?ctrl=vouchers&act=add" class="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">add</span> Thêm Voucher
        </a>
      </div>
      <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="owner-table w-full">
            <thead>
              <tr class="border-b border-outline-variant/20">
                <th class="px-4 py-3 text-left">Mã</th>
                <th class="px-4 py-3 text-left">Mô tả</th>
                <th class="px-4 py-3 text-left">Giảm</th>
                <th class="px-4 py-3 text-left">Tối đa</th>
                <th class="px-4 py-3 text-left">Đơn tối thiểu</th>
                <th class="px-4 py-3 text-left">Thời hạn</th>
                <th class="px-4 py-3 text-left">Đã dùng</th>
                <th class="px-4 py-3 text-left">Trạng thái</th>
                <th class="px-4 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
        return renderLayout(content, "vouchers", "Quản lý Voucher");
    },
    // ==================== VOUCHER FORM ====================
    renderVoucherForm: (voucher, centers) => {
        const isEdit = !!voucher;
        const centerOptions = centers
            .map((c) => `<option value="${c._id}" ${voucher && voucher.sport_center_id === c._id ? "selected" : ""}>${c.name}</option>`)
            .join("");
        const content = `
      <div class="w-full">
        <a href="owner.html?ctrl=vouchers" class="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6 transition">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại
        </a>
        <div class="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-8">
          <h2 class="font-bold text-lg text-on-surface mb-6">${isEdit ? "Chỉnh sửa Voucher" : "Tạo Voucher mới"}</h2>
          <form id="voucher-form" class="space-y-5">
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cụm sân áp dụng *</label>
              <select id="voucher-center" required
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">
                <option value="">-- Chọn cụm sân --</option>
                ${centerOptions}
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mã voucher *</label>
              <input type="text" id="voucher-code" value="${voucher?.code || ""}" required ${isEdit ? "readonly" : ""}
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none uppercase ${isEdit ? "bg-gray-50" : ""}" />
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mô tả</label>
              <textarea id="voucher-description" rows="2"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">${voucher?.description || ""}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Giảm giá (%) *</label>
                <input type="number" id="voucher-discount" value="${voucher?.discount_percent ?? ""}" min="0" max="100" required
                  class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Giảm tối đa (VND) *</label>
                <input type="number" id="voucher-max-discount" value="${voucher?.max_discount ?? ""}" min="0" required
                  class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Đơn tối thiểu (VND)</label>
              <input type="number" id="voucher-min-order" value="${voucher?.min_order ?? 0}" min="0"
                class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Ngày bắt đầu *</label>
                <input type="date" id="voucher-start" value="${voucher?.start_date ? voucher.start_date.substring(0, 10) : ""}" required
                  class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Ngày kết thúc *</label>
                <input type="date" id="voucher-end" value="${voucher?.end_date ? voucher.end_date.substring(0, 10) : ""}" required
                  class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Giới hạn sử dụng *</label>
                <input type="number" id="voucher-limit" value="${voucher?.usage_limit ?? ""}" min="1" required
                  class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Trạng thái</label>
                <select id="voucher-status"
                  class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline-variant/40 text-sm bg-white focus:border-primary focus:outline-none">
                  <option value="active" ${voucher?.status === "active" ? "selected" : ""}>Hoạt động</option>
                  <option value="inactive" ${voucher?.status === "inactive" ? "selected" : ""}>Không hoạt động</option>
                </select>
              </div>
            </div>
            <div class="pt-4 border-t border-outline-variant/20">
              <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:scale-[0.98]">
                ${isEdit ? "Cập nhật Voucher" : "Tạo Voucher"}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
        return renderLayout(content, "vouchers", isEdit ? "Chỉnh sửa Voucher" : "Thêm Voucher");
    },
};
export default OwnerView;
//# sourceMappingURL=OwnerView.js.map
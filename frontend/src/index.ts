import UserController from "./controllers/UserController.js";
import HomeController from "./controllers/HomeController.js";
import DetailController from "./controllers/DetailController.js";
import SearchController from "./controllers/SearchController.js";

import UserService from "./services/UserService.js";

// Router
const params = new URLSearchParams(window.location.search);
const ctrl = params.get("ctrl");
const act = params.get("act");
const id = params.get("id");

// Helper to update active state on Navigation Bar
function updateActiveNav(activeId: string | null): void {
  const navIds = ["nav-home", "nav-search", "nav-news", "nav-contact", "nav-about"];
  navIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === activeId) {
      el.className = "text-primary border-b-2 border-primary pb-1 font-label-md";
    } else {
      el.className = "text-on-surface-variant hover:text-primary font-label-md transition-colors";
    }
  });
}

// Hàm cập nhật Header theo trạng thái Đăng nhập và Giỏ hàng
function updateHeaderState(): void {
  const userHeaderEl = document.getElementById("user-header-section");
  const cartBadgeEl = document.getElementById("cart-badge");

  // 1. Cập nhật Avatar / Button Đăng nhập
  const currentUser = UserService.getCurrentUser();
  if (userHeaderEl) {
    if (currentUser) {
      const avatarUrl = currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";
      userHeaderEl.innerHTML = `
        <div class="relative cursor-pointer" id="user-menu-btn">
          <div class="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary/10">
            <img alt="${currentUser.name}" class="w-full h-full object-cover" src="${avatarUrl}" />
          </div>
          <!-- Dropdown menu -->
          <div id="user-dropdown" class="absolute right-0 top-12 w-52 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl py-sm hidden transition-all z-50">
            <div class="px-md py-sm border-b border-outline-variant/10">
              <p class="font-bold text-sm text-on-surface line-clamp-1">${currentUser.name}</p>
              <p class="text-xs text-on-surface-variant line-clamp-1">${currentUser.email}</p>
            </div>
            ${currentUser.role === "admin"
          ? `<a href="admin.html" class="block px-md py-sm hover:bg-primary/5 text-sm text-on-surface-variant transition-colors font-semibold">Quản trị</a>`
          : currentUser.role === "owner"
            ? `<a href="owner.html" class="block px-md py-sm hover:bg-primary/5 text-sm text-on-surface-variant transition-colors font-semibold">Dashboard Chủ Sân</a>`
            : ""
        }
            <a href="?ctrl=user&act=profile" class="block px-md py-sm hover:bg-primary/5 text-sm text-on-surface-variant transition-colors">Tài khoản của tôi</a>
            <a href="?ctrl=user&act=bookings" class="block px-md py-sm hover:bg-primary/5 text-sm text-on-surface-variant transition-colors">Quản lý lịch đặt</a>
            <button id="logout-btn" class="w-full text-left px-md py-sm hover:bg-primary/5 text-sm text-red-500 font-semibold transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
      `;

      const userMenuBtn = document.getElementById("user-menu-btn");
      const userDropdown = document.getElementById("user-dropdown");
      if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          userDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          if (!userMenuBtn.contains(target)) {
            userDropdown.classList.add("hidden");
          }
        });
      }

      // Gắn sự kiện đăng xuất
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          UserService.logout();
          alert("Đã đăng xuất tài khoản!");
          window.location.href = "?";
        });
      }
    } else {
      userHeaderEl.innerHTML = `
        <a href="?ctrl=user&act=login" class="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-primary-container transition-colors text-sm">ĐĂNG NHẬP</a>
      `;
    }
  }

  // 2. Cập nhật Badge Giỏ hàng (dựa trên sessionStorage pending booking)
  if (cartBadgeEl) {
    const pendingBooking = sessionStorage.getItem("pending_booking");
    if (pendingBooking) {
      cartBadgeEl.classList.remove("hidden");
      try {
        const data = JSON.parse(pendingBooking);
        cartBadgeEl.textContent = (data.slots?.length || 1).toString();
      } catch {
        cartBadgeEl.textContent = "1";
      }
    } else {
      cartBadgeEl.classList.add("hidden");
    }
  }
}

// Khởi chạy cập nhật Header lúc tải trang
updateHeaderState();

if (ctrl === "detail" && id) {
  // Trang chi tiết cụm sân (vẫn highlight Tìm sân hoặc bỏ trống tùy chọn)
  updateActiveNav("nav-search");
  const detailController = new DetailController(id);
  detailController.init();
} else if (ctrl === "search") {
  // Trang tìm kiếm cụm sân có bộ lọc
  updateActiveNav("nav-search");
  const searchController = new SearchController();
  searchController.init();
} else if (ctrl === "user") {
  updateActiveNav(null);
  const userController = new UserController();
  if (act === "listClient") {
    userController.listClient();
  } else if (act === "login") {
    userController.login();
  } else if (act === "register") {
    userController.register();
  } else if (act === "payment") {
    userController.payment();
  } else if (act === "profile") {
    userController.profile();
  } else if (act === "bookings") {
    userController.bookings();
  }
} else {
  // Trang chủ (mặc định)
  updateActiveNav("nav-home");
  const homeController = new HomeController();
  homeController.init();
}

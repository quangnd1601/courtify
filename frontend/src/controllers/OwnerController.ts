import SportsCenterService from "../services/SportsCenterService.js";
import CourtService from "../services/CourtService.js";
import BookingService from "../services/BookingService.js";
import VoucherService from "../services/VoucherService.js";
import SportService from "../services/SportService.js";
import UserService from "../services/UserService.js";
import OwnerView from "../views/OwnerView.js";
import config from "../config/config.js";

// Lấy origin backend từ config (bỏ /api)
const API_ORIGIN = config.BASE_URL.replace(/\/api\/?$/, "");


export default class OwnerController {
  private getAppElement(): HTMLElement | null {
    const app = document.getElementById("app");
    if (app) {
      app.className = "w-full min-h-screen";
    }
    return app;
  }

  private getOwnerId(): string {
    const user = UserService.getCurrentUser();
    return user?._id || "";
  }

  // ==================== DASHBOARD ====================
  async dashboard(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      // Fetch data in parallel
      const [centers, allCourts, allBookings] = await Promise.all([
        SportsCenterService.getByOwner(ownerId),
        CourtService.getAll(),
        BookingService.getAll(),
      ]);

      // Filter courts belonging to owner's centers
      const centerIds = new Set(centers.map((c) => c._id));
      const ownerCourts = allCourts.filter((c) => centerIds.has(c.sport_center_id));
      const ownerCourtsIds = new Set(ownerCourts.map((c) => c._id));

      // Filter bookings belonging to owner's centers or courts
      const ownerBookings = allBookings.filter(
        (b) =>
          (b.sport_center_id && centerIds.has(b.sport_center_id._id || b.sport_center_id)) ||
          (b.court_id && ownerCourtsIds.has(b.court_id._id || b.court_id))
      );

      // Calculate stats
      const completedBookings = ownerBookings.filter((b) => b.booking_status === "completed");
      const confirmedBookings = ownerBookings.filter((b) => b.booking_status === "confirmed");
      const pendingBookings = ownerBookings.filter((b) => b.booking_status === "pending");
      const cancelledBookings = ownerBookings.filter((b) => b.booking_status === "cancelled");

      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

      // Sort bookings by created date desc to get recent ones
      const recentBookings = [...ownerBookings]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 5);

      const stats = {
        totalRevenue,
        totalBookings: ownerBookings.length,
        totalCenters: centers.length,
        totalCourts: ownerCourts.length,
        pendingBookings: pendingBookings.length,
        confirmedBookings: confirmedBookings.length,
        completedBookings: completedBookings.length,
        cancelledBookings: cancelledBookings.length,
        recentBookings,
      };

      app.innerHTML = OwnerView.renderDashboard(stats);
    } catch (error) {
      console.error("Lỗi khi tải Dashboard:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Đã xảy ra lỗi khi tải dữ liệu Dashboard.</div>`;
    }
  }

  // ==================== CENTERS ====================
  async centersList(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const centers = await SportsCenterService.getByOwner(ownerId);
      app.innerHTML = OwnerView.renderCentersList(centers);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cụm sân:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải danh sách cụm sân.</div>`;
    }
  }

  async centersAdd(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const sports = await SportService.getAll();
      app.innerHTML = OwnerView.renderCenterForm(null, sports);
      this.initCenterFormEvents(null);
    } catch (error) {
      console.error("Lỗi tải form thêm cụm sân:", error);
    }
  }

  async centersEdit(id: string): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const [center, sports] = await Promise.all([
        SportsCenterService.getOne(id),
        SportService.getAll(),
      ]);
      app.innerHTML = OwnerView.renderCenterForm(center, sports);
      this.initCenterFormEvents(center);
    } catch (error) {
      console.error("Lỗi tải form sửa cụm sân:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải thông tin cụm sân.</div>`;
    }
  }

  private initCenterFormEvents(center: any | null): void {
    // 1. Thumbnail Upload Handling
    const thumbnailFileInput = document.getElementById("center-thumbnail-file") as HTMLInputElement;
    const thumbnailHiddenInput = document.getElementById("center-thumbnail") as HTMLInputElement;
    const thumbnailPreview = document.getElementById("center-thumbnail-preview") as HTMLImageElement;

    if (thumbnailFileInput && thumbnailHiddenInput && thumbnailPreview) {
      thumbnailFileInput.addEventListener("change", async () => {
        const file = thumbnailFileInput.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
          thumbnailPreview.style.opacity = "0.5";
          const res = await fetch(`${config.BASE_URL}/sports-centers/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.status === 1 && data.url) {
            thumbnailHiddenInput.value = data.url;
            thumbnailPreview.src = `http://localhost:8080${data.url}`;
          } else {
            alert("Upload ảnh thất bại!");
          }
        } catch (error) {
          console.error("Lỗi upload thumbnail:", error);
          alert("Lỗi kết nối upload ảnh!");
        } finally {
          thumbnailPreview.style.opacity = "1";
        }
      });
    }

    // 2. Gallery Upload Handling
    const galleryFileInput = document.getElementById("center-gallery-files") as HTMLInputElement;
    const galleryHiddenInput = document.getElementById("center-gallery") as HTMLInputElement;
    const galleryPreviewsContainer = document.getElementById("center-gallery-previews");

    if (galleryFileInput && galleryHiddenInput && galleryPreviewsContainer) {
      // Listen for gallery upload
      galleryFileInput.addEventListener("change", async () => {
        const files = galleryFileInput.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("image", files[i]);
        }

        try {
          galleryPreviewsContainer.style.opacity = "0.5";
          const res = await fetch(`${config.BASE_URL}/sports-centers/uploads`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.status === 1 && data.urls) {
            let galleryUrls: string[] = [];
            try {
              galleryUrls = JSON.parse(galleryHiddenInput.value || "[]");
            } catch {
              galleryUrls = [];
            }

            galleryUrls = [...galleryUrls, ...data.urls];
            galleryHiddenInput.value = JSON.stringify(galleryUrls);

            // Re-render gallery previews
            this.renderGalleryPreviews(galleryUrls, galleryPreviewsContainer, galleryHiddenInput);
          } else {
            alert("Upload thư viện ảnh thất bại!");
          }
        } catch (error) {
          console.error("Lỗi upload gallery:", error);
          alert("Lỗi kết nối upload thư viện ảnh!");
        } finally {
          galleryPreviewsContainer.style.opacity = "1";
        }
      });

      // Listen for delete buttons (delegation)
      galleryPreviewsContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("delete-gallery-img")) {
          e.preventDefault();
          const urlToDelete = target.getAttribute("data-url");
          if (urlToDelete) {
            let galleryUrls: string[] = [];
            try {
              galleryUrls = JSON.parse(galleryHiddenInput.value || "[]");
            } catch {
              galleryUrls = [];
            }
            galleryUrls = galleryUrls.filter((url) => url !== urlToDelete);
            galleryHiddenInput.value = JSON.stringify(galleryUrls);
            this.renderGalleryPreviews(galleryUrls, galleryPreviewsContainer, galleryHiddenInput);
          }
        }
      });
    }

    const addPricingBtn = document.getElementById("add-pricing-btn");
    const pricingRowsContainer = document.getElementById("pricing-rows");

    if (addPricingBtn && pricingRowsContainer) {
      addPricingBtn.addEventListener("click", () => {
        const rowCount = pricingRowsContainer.children.length;
        const newRow = document.createElement("div");
        newRow.className = "grid grid-cols-3 gap-3 pricing-row";
        newRow.innerHTML = `
          <input type="text" name="pricing_start_${rowCount}" placeholder="VD: 05:00" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
          <input type="text" name="pricing_end_${rowCount}" placeholder="VD: 17:00" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
          <input type="number" name="pricing_price_${rowCount}" placeholder="Giá (VND)" class="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm bg-white" />
        `;
        pricingRowsContainer.appendChild(newRow);
      });
    }

    const form = document.getElementById("center-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const name = (document.getElementById("center-name") as HTMLInputElement).value;
          const address = (document.getElementById("center-address") as HTMLInputElement).value;
          const location = (document.getElementById("center-location") as HTMLInputElement).value;
          const sport_id = (document.getElementById("center-sport") as HTMLSelectElement).value;
          const description = (document.getElementById("center-description") as HTMLTextAreaElement).value;
          const thumbnail = thumbnailHiddenInput.value;
          const status = (document.getElementById("center-status") as HTMLSelectElement).value;

          let gallery: string[] = [];
          if (galleryHiddenInput) {
            try {
              gallery = JSON.parse(galleryHiddenInput.value || "[]");
            } catch {
              gallery = [];
            }
          }

          // Parse pricing rows
          const pricing: any[] = [];
          if (pricingRowsContainer) {
            const rows = pricingRowsContainer.querySelectorAll(".pricing-row");
            rows.forEach((row) => {
              const inputs = row.querySelectorAll("input");
              const start = inputs[0].value.trim();
              const end = inputs[1].value.trim();
              const price = parseFloat(inputs[2].value.trim());

              if (start && end && !isNaN(price)) {
                pricing.push({
                  start_time: start,
                  end_time: end,
                  price: price,
                });
              }
            });
          }

          const owner_id = this.getOwnerId();
          const centerData = {
            owner_id,
            sport_id,
            name,
            address,
            location,
            description,
            thumbnail,
            gallery,
            pricing,
            status,
          };

          if (center) {
            await SportsCenterService.update(center._id, centerData);
            alert("Cập nhật cụm sân thành công!");
          } else {
            await SportsCenterService.create(centerData);
            alert("Tạo cụm sân mới thành công!");
          }
          window.location.href = "owner.html?ctrl=centers";
        } catch (error: any) {
          console.error("Lỗi khi lưu cụm sân:", error);
          alert(error.message || "Lỗi khi lưu thông tin.");
        }
      });
    }
  }

  private renderGalleryPreviews(galleryUrls: string[], container: HTMLElement, hiddenInput: HTMLInputElement): void {
    container.innerHTML = galleryUrls
      .map(
        (img) => `
      <div class="relative w-20 h-20 group rounded-lg overflow-hidden border border-outline-variant/30">
        <img src="${API_ORIGIN}${img}" class="w-full h-full object-cover" />
        <button type="button" class="delete-gallery-img absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xs font-bold" data-url="${img}">Xóa</button>
      </div>`
      )
      .join("");
  }

  async centersDelete(id: string): Promise<void> {
    if (confirm("Bạn có chắc chắn muốn xóa cụm sân này không?")) {
      try {
        await SportsCenterService.remove(id);
        alert("Xóa thành công!");
        this.centersList();
      } catch (error: any) {
        console.error("Lỗi khi xóa cụm sân:", error);
        alert(error.message || "Lỗi khi xóa cụm sân.");
      }
    }
  }

  // ==================== COURTS ====================
  async courtsList(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const [centers, allCourts] = await Promise.all([
        SportsCenterService.getByOwner(ownerId),
        CourtService.getAll(),
      ]);

      // Filter courts that belong to the owner's centers
      const centerIds = new Set(centers.map((c) => c._id));
      const ownerCourts = allCourts.filter((c) => {
        const scId = typeof c.sport_center_id === "object" && c.sport_center_id ? (c.sport_center_id as any)._id : c.sport_center_id;
        return centerIds.has(scId);
      });

      app.innerHTML = OwnerView.renderCourtsList(ownerCourts, centers);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sân:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải danh sách sân.</div>`;
    }
  }

  async courtsAdd(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const centers = await SportsCenterService.getByOwner(ownerId);
      app.innerHTML = OwnerView.renderCourtForm(null, centers);
      this.initCourtFormEvents(null, centers);
    } catch (error) {
      console.error("Lỗi tải form thêm sân:", error);
    }
  }

  async courtsEdit(id: string): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const [court, centers] = await Promise.all([
        CourtService.getOne(id),
        SportsCenterService.getByOwner(ownerId),
      ]);
      app.innerHTML = OwnerView.renderCourtForm(court, centers);
      this.initCourtFormEvents(court, centers);
    } catch (error) {
      console.error("Lỗi tải form sửa sân:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải thông tin sân.</div>`;
    }
  }

  private initCourtFormEvents(court: any | null, centers: any[]): void {
    const thumbnailFileInput = document.getElementById("court-thumbnail-file") as HTMLInputElement;
    const thumbnailHiddenInput = document.getElementById("court-thumbnail") as HTMLInputElement;
    const thumbnailPreview = document.getElementById("court-thumbnail-preview") as HTMLImageElement;

    if (thumbnailFileInput && thumbnailHiddenInput && thumbnailPreview) {
      thumbnailFileInput.addEventListener("change", async () => {
        const file = thumbnailFileInput.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
          thumbnailPreview.style.opacity = "0.5";
          const res = await fetch(`${config.BASE_URL}/courts/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.status === 1 && data.url) {
            thumbnailHiddenInput.value = data.url;
            thumbnailPreview.src = `http://localhost:8080${data.url}`;
          } else {
            alert("Upload ảnh thất bại!");
          }
        } catch (error) {
          console.error("Lỗi upload thumbnail:", error);
          alert("Lỗi kết nối upload ảnh!");
        } finally {
          thumbnailPreview.style.opacity = "1";
        }
      });
    }

    const form = document.getElementById("court-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const sport_center_id = (document.getElementById("court-center") as HTMLSelectElement).value;
          const name = (document.getElementById("court-name") as HTMLInputElement).value;
          const description = (document.getElementById("court-description") as HTMLTextAreaElement).value;
          const thumbnail = thumbnailHiddenInput.value;
          const status = (document.getElementById("court-status") as HTMLSelectElement).value;

          const courtData = {
            sport_center_id,
            name,
            description,
            thumbnail,
            status,
          };

          if (court) {
            await CourtService.update(court._id, courtData);
            alert("Cập nhật sân thành công!");
          } else {
            await CourtService.create(courtData);
            alert("Tạo sân mới thành công!");
          }
          window.location.href = "owner.html?ctrl=courts";
        } catch (error: any) {
          console.error("Lỗi khi lưu sân:", error);
          alert(error.message || "Lỗi khi lưu thông tin.");
        }
      });
    }
  }

  async courtsDelete(id: string): Promise<void> {
    if (confirm("Bạn có chắc chắn muốn xóa sân này không?")) {
      try {
        await CourtService.remove(id);
        alert("Xóa thành công!");
        this.courtsList();
      } catch (error: any) {
        console.error("Lỗi khi xóa sân:", error);
        alert(error.message || "Lỗi khi xóa sân.");
      }
    }
  }

  // ==================== BOOKINGS ====================
  async bookings(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const [centers, allCourts, allBookings] = await Promise.all([
        SportsCenterService.getByOwner(ownerId),
        CourtService.getAll(),
        BookingService.getAll(),
      ]);

      const centerIds = new Set(centers.map((c) => c._id));
      const ownerCourts = allCourts.filter((c) => centerIds.has(c.sport_center_id));
      const ownerCourtsIds = new Set(ownerCourts.map((c) => c._id));

      const ownerBookings = allBookings.filter(
        (b) =>
          (b.sport_center_id && centerIds.has(b.sport_center_id._id || b.sport_center_id)) ||
          (b.court_id && ownerCourtsIds.has(b.court_id._id || b.court_id))
      );

      // Sort bookings by date desc
      ownerBookings.sort((a, b) => new Date(b.booking_date || 0).getTime() - new Date(a.booking_date || 0).getTime());

      app.innerHTML = OwnerView.renderBookings(ownerBookings);
      this.initBookingsEvents();
    } catch (error) {
      console.error("Lỗi tải danh sách booking:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải danh sách booking.</div>`;
    }
  }

  private initBookingsEvents(): void {
    // 1. Filter tabs logic
    const filterButtons = document.querySelectorAll(".booking-filter-btn");
    const rows = document.querySelectorAll(".booking-row");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active class
        filterButtons.forEach((b) => {
          b.classList.remove("bg-primary", "text-white");
          b.classList.add("bg-white", "text-on-surface-variant", "border", "border-outline-variant/30");
        });
        btn.classList.add("bg-primary", "text-white");
        btn.classList.remove("bg-white", "text-on-surface-variant", "border", "border-outline-variant/30");

        const filter = btn.getAttribute("data-filter");
        rows.forEach((row: any) => {
          const status = row.getAttribute("data-status");
          if (filter === "all" || status === filter) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      });
    });

    // 2. Action buttons logic (Duyệt, Hủy, Hoàn thành)
    const container = document.getElementById("bookings-tbody");
    if (container) {
      container.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("booking-action-btn")) {
          const bookingId = target.getAttribute("data-id");
          const action = target.getAttribute("data-action");

          if (bookingId && action) {
            const confirmMsg =
              action === "confirmed"
                ? "Duyệt booking này?"
                : action === "completed"
                ? "Đánh dấu hoàn thành booking này?"
                : "Hủy booking này?";

            if (confirm(confirmMsg)) {
              try {
                await BookingService.update(bookingId, { booking_status: action });
                alert("Cập nhật trạng thái booking thành công!");
                this.bookings();
              } catch (error: any) {
                console.error("Lỗi cập nhật booking:", error);
                alert(error.message || "Lỗi cập nhật booking.");
              }
            }
          }
        }
      });
    }
  }

  // ==================== VOUCHERS ====================
  async vouchersList(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const allVouchers = await VoucherService.getAll();
      const ownerId = this.getOwnerId();
      // Filter vouchers owned by this owner
      const ownerVouchers = allVouchers.filter((v) => v.owner_id === ownerId);

      app.innerHTML = OwnerView.renderVouchersList(ownerVouchers);
    } catch (error) {
      console.error("Lỗi tải danh sách voucher:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải danh sách voucher.</div>`;
    }
  }

  async vouchersAdd(): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const centers = await SportsCenterService.getByOwner(ownerId);
      app.innerHTML = OwnerView.renderVoucherForm(null, centers);
      this.initVoucherFormEvents(null);
    } catch (error) {
      console.error("Lỗi tải form thêm voucher:", error);
    }
  }

  async vouchersEdit(id: string): Promise<void> {
    const app = this.getAppElement();
    if (!app) return;

    try {
      const ownerId = this.getOwnerId();
      const [voucher, centers] = await Promise.all([
        VoucherService.getOne(id),
        SportsCenterService.getByOwner(ownerId),
      ]);
      app.innerHTML = OwnerView.renderVoucherForm(voucher, centers);
      this.initVoucherFormEvents(voucher);
    } catch (error) {
      console.error("Lỗi tải form sửa voucher:", error);
      app.innerHTML = `<div class="p-8 text-center text-red-600">Lỗi khi tải thông tin voucher.</div>`;
    }
  }

  private initVoucherFormEvents(voucher: any | null): void {
    const form = document.getElementById("voucher-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const sport_center_id = (document.getElementById("voucher-center") as HTMLSelectElement).value;
          const code = (document.getElementById("voucher-code") as HTMLInputElement).value.toUpperCase().trim();
          const description = (document.getElementById("voucher-description") as HTMLTextAreaElement).value;
          const discount_percent = parseInt((document.getElementById("voucher-discount") as HTMLInputElement).value);
          const max_discount = parseFloat((document.getElementById("voucher-max-discount") as HTMLInputElement).value);
          const min_order = parseFloat((document.getElementById("voucher-min-order") as HTMLInputElement).value) || 0;
          const start_date = (document.getElementById("voucher-start") as HTMLInputElement).value;
          const end_date = (document.getElementById("voucher-end") as HTMLInputElement).value;
          const usage_limit = parseInt((document.getElementById("voucher-limit") as HTMLInputElement).value);
          const status = (document.getElementById("voucher-status") as HTMLSelectElement).value;

          const owner_id = this.getOwnerId();
          const voucherData = {
            owner_id,
            sport_center_id,
            code,
            description,
            discount_percent,
            max_discount,
            min_order,
            start_date,
            end_date,
            usage_limit,
            status,
          };

          if (voucher) {
            await VoucherService.update(voucher._id, voucherData);
            alert("Cập nhật voucher thành công!");
          } else {
            await VoucherService.create(voucherData);
            alert("Tạo voucher mới thành công!");
          }
          window.location.href = "owner.html?ctrl=vouchers";
        } catch (error: any) {
          console.error("Lỗi khi lưu voucher:", error);
          alert(error.message || "Lỗi khi lưu thông tin.");
        }
      });
    }
  }

  async vouchersDelete(id: string): Promise<void> {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này không?")) {
      try {
        await VoucherService.remove(id);
        alert("Xóa thành công!");
        this.vouchersList();
      } catch (error: any) {
        console.error("Lỗi khi xóa voucher:", error);
        alert(error.message || "Lỗi khi xóa voucher.");
      }
    }
  }
}

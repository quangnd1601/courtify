import SportsCenterService from "../services/SportsCenterService.js";
import CourtService from "../services/CourtService.js";
import UserService from "../services/UserService.js";
import { DetailView } from "../views/DetailView.js";
export default class DetailController {
    centerId;
    selectedSlots = [];
    constructor(centerId) {
        this.centerId = centerId;
    }
    async init() {
        const app = document.getElementById("app");
        if (!app)
            return;
        // Hiển thị loading
        app.innerHTML = DetailView.renderLoading();
        try {
            // Gọi Service lấy data song song
            const [center, courts] = await Promise.all([
                SportsCenterService.getOne(this.centerId),
                CourtService.getBySportsCenter(this.centerId),
            ]);
            // View render toàn bộ trang chi tiết vào #app
            app.innerHTML = DetailView.renderDetail(center, courts);
            // Lấy sân active đầu tiên và ngày hôm nay làm mặc định
            const activeCourts = courts.filter((c) => c.status === "active");
            const defaultCourt = activeCourts[0] ?? null;
            const today = new Date().toISOString().split("T")[0];
            if (defaultCourt) {
                // Load slots mặc định cho sân đầu tiên
                await this.loadSlots(defaultCourt._id, today);
            }
            // Bind tất cả sự kiện tương tác
            this.bindEvents(activeCourts);
        }
        catch (error) {
            console.error("Lỗi tải chi tiết:", error);
            app.innerHTML = DetailView.renderError();
        }
    }
    /** Gọi API lấy slot còn trống rồi điền vào DOM */
    async loadSlots(courtId, date) {
        const container = document.getElementById("time-slot-container");
        if (!container)
            return;
        // Reset danh sách slot đã chọn khi load lại
        this.selectedSlots = [];
        this.updatePriceBreakdown();
        // Loading spinner
        container.innerHTML = `
      <div class="col-span-2 flex items-center justify-center py-sm gap-sm text-on-surface-variant">
        <div class="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span class="text-label-sm">Đang tải khung giờ...</span>
      </div>`;
        try {
            const slots = await CourtService.getAvailableSlots(courtId, date);
            if (slots.length === 0) {
                container.innerHTML = `<p class="col-span-2 text-center text-on-surface-variant text-label-sm py-sm">Không còn khung giờ trống cho ngày này.</p>`;
                return;
            }
            container.innerHTML = slots
                .map((slot) => {
                if (slot.isBooked) {
                    return `
                <button
                  disabled
                  class="time-slot-btn py-sm bg-surface-container-highest text-on-surface-variant/40 border border-outline-variant/30 rounded-xl font-label-md text-sm cursor-not-allowed text-center opacity-50 line-through">
                  ${slot.start_time} – ${slot.end_time}
                </button>`;
                }
                return `
              <button
                data-slot-start="${slot.start_time}"
                data-slot-end="${slot.end_time}"
                data-slot-price="${slot.price}"
                class="time-slot-btn py-sm border border-outline-variant rounded-xl font-label-md text-sm hover:bg-primary/10 transition-all text-center">
                ${slot.start_time} – ${slot.end_time}
              </button>`;
            })
                .join("");
            // Bind click multi-select
            this.bindSlotClick();
        }
        catch (err) {
            container.innerHTML = `<p class="col-span-2 text-center text-red-500 text-label-sm py-sm">Lỗi tải khung giờ.</p>`;
        }
    }
    /** Cập nhật breakdown giá dựa trên selectedSlots */
    updatePriceBreakdown() {
        const subtotalEl = document.getElementById("price-subtotal");
        const totalEl = document.getElementById("price-total");
        const slotLabelEl = document.getElementById("slot-label");
        const bookingBtnEl = document.getElementById("booking-btn");
        const count = this.selectedSlots.length;
        const total = this.selectedSlots.reduce((sum, s) => sum + s.price, 0);
        const formatted = new Intl.NumberFormat("vi-VN").format(total);
        if (slotLabelEl) {
            slotLabelEl.textContent = count === 0
                ? "Chưa chọn khung giờ"
                : `${count} giờ đã chọn`;
        }
        if (subtotalEl)
            subtotalEl.textContent = count === 0 ? "—" : `${formatted}đ`;
        if (totalEl)
            totalEl.textContent = count === 0 ? "—" : `${formatted}đ`;
        // Disable nút đặt sân nếu chưa chọn slot
        if (bookingBtnEl) {
            if (count === 0) {
                bookingBtnEl.setAttribute("disabled", "true");
                bookingBtnEl.classList.add("opacity-50", "cursor-not-allowed");
                bookingBtnEl.classList.remove("hover:bg-primary", "active:scale-95");
            }
            else {
                bookingBtnEl.removeAttribute("disabled");
                bookingBtnEl.classList.remove("opacity-50", "cursor-not-allowed");
                bookingBtnEl.classList.add("hover:bg-primary", "active:scale-95");
            }
        }
    }
    /** Gắn event toggle multi-select cho các nút slot */
    bindSlotClick() {
        const slotBtns = document.querySelectorAll(".time-slot-btn:not([disabled])");
        slotBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const start = btn.dataset.slotStart;
                const end = btn.dataset.slotEnd;
                const price = Number(btn.dataset.slotPrice ?? 0);
                const existingIndex = this.selectedSlots.findIndex((s) => s.start_time === start);
                if (existingIndex === -1) {
                    // Chưa chọn → thêm vào
                    this.selectedSlots.push({ start_time: start, end_time: end, price });
                    btn.classList.remove("border-outline-variant", "hover:bg-primary/10");
                    btn.classList.add("bg-primary", "text-on-primary", "border-primary", "ring-2", "ring-primary", "ring-offset-1", "shadow-md");
                }
                else {
                    // Đã chọn → bỏ ra
                    this.selectedSlots.splice(existingIndex, 1);
                    btn.classList.remove("bg-primary", "text-on-primary", "border-primary", "ring-2", "ring-primary", "ring-offset-1", "shadow-md");
                    btn.classList.add("border-outline-variant", "hover:bg-primary/10");
                }
                this.updatePriceBreakdown();
            });
        });
    }
    /** Gắn toàn bộ events tương tác sau khi trang render */
    bindEvents(activeCourts) {
        // ── Sự kiện chọn sân ──────────────────────────────────────────────────
        const courtBtns = document.querySelectorAll(".court-btn");
        const dateInput = document.querySelector("#booking-date");
        courtBtns.forEach((btn) => {
            btn.addEventListener("click", async () => {
                // Update UI
                courtBtns.forEach((b) => {
                    b.className = "court-btn py-sm border border-outline-variant rounded-xl font-label-md text-sm hover:bg-surface-container-low transition-colors";
                });
                btn.className = "court-btn py-sm bg-primary-container text-white rounded-xl font-label-md text-sm shadow-md ring-2 ring-primary-container ring-offset-2";
                const courtId = btn.dataset.courtId ?? "";
                const date = dateInput?.value ?? new Date().toISOString().split("T")[0];
                await this.loadSlots(courtId, date);
            });
        });
        // ── Sự kiện đổi ngày ─────────────────────────────────────────────────
        if (dateInput) {
            dateInput.addEventListener("change", async () => {
                // Lấy sân đang active (có class bg-primary-container)
                const activeCourtBtn = document.querySelector(".court-btn.bg-primary-container");
                const courtId = activeCourtBtn?.dataset.courtId ?? activeCourts[0]?._id ?? "";
                if (courtId) {
                    await this.loadSlots(courtId, dateInput.value);
                }
            });
        }
        // ── Sự kiện Đặt Sân (Submit Booking) ───────────────────────────────────
        const bookingBtn = document.getElementById("booking-btn");
        if (bookingBtn) {
            bookingBtn.addEventListener("click", async () => {
                const activeCourtBtn = document.querySelector(".court-btn.bg-primary-container");
                const courtId = activeCourtBtn?.dataset.courtId;
                const courtName = activeCourtBtn?.textContent?.trim() || "Sân đấu";
                const bookingDate = dateInput?.value;
                if (!courtId || !bookingDate || this.selectedSlots.length === 0) {
                    alert("Vui lòng chọn đầy đủ sân, ngày và khung giờ đặt!");
                    return;
                }
                // Tạo mã booking ngẫu nhiên để demo
                const bookingCode = `BK-${Date.now().toString().slice(-8)}`;
                const subtotal = this.selectedSlots.reduce((sum, s) => sum + s.price, 0);
                // Gói dữ liệu booking thô
                const bookingData = {
                    booking_code: bookingCode,
                    user_id: "", // Sẽ gán sau khi đăng nhập ở trang thanh toán
                    sport_center_id: this.centerId,
                    court_id: courtId,
                    booking_date: bookingDate,
                    slots: this.selectedSlots.map((s) => ({
                        start_time: s.start_time,
                        end_time: s.end_time,
                        price: s.price,
                    })),
                    subtotal: subtotal,
                    total_price: subtotal,
                    payment_method: "cash",
                    payment_status: "unpaid",
                    booking_status: "pending",
                    note: "",
                };
                // Lấy tên center name từ DOM
                const centerName = document.querySelector("h1")?.textContent?.trim() || "Cụm sân";
                // Lưu thông tin lượt booking tạm thời vào sessionStorage
                sessionStorage.setItem("pending_booking", JSON.stringify(bookingData));
                sessionStorage.setItem("pending_center_name", centerName);
                sessionStorage.setItem("pending_court_name", courtName);
                // Kiểm tra đăng nhập
                const currentUser = UserService.getCurrentUser();
                if (!currentUser) {
                    alert("Bạn cần đăng nhập để tiến hành đặt sân!");
                    window.location.href = "?ctrl=user&act=login";
                }
                else {
                    // Đã đăng nhập -> Chuyển đến trang thanh toán
                    window.location.href = "?ctrl=user&act=payment";
                }
            });
        }
    }
}
//# sourceMappingURL=DetailController.js.map
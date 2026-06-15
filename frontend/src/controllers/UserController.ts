import UserService from "../services/UserService.js";
import { UserView } from "../views/UserView.js";
import { AuthView } from "../views/AuthView.js";
import BookingService from "../services/BookingService.js";
import VoucherService from "../services/VoucherService.js";

export default class UserController {
  private currentCenters: any[] = [];
  // Client view: hiển thị danh sách
  async listClient(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;
    try {
      const users = await UserService.getAll();
      app.innerHTML = UserView.renderList(users);
    } catch (error) {
      app.innerHTML = `<div style="color: red; padding: 20px;">Lỗi tải dữ liệu: ${(error as Error).message}</div>`;
    }
  }

  // Admin view: danh sách quản lý
  async list(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;
    try {
      const users = await UserService.getAll();
      app.innerHTML = UserView.renderAdminList(users);
    } catch (error) {
      app.innerHTML = `<div style="color: red; padding: 20px;">Lỗi tải dữ liệu: ${(error as Error).message}</div>`;
    }
  }

  // Thêm mới
  async add(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = UserView.renderForm();

    const form = document.getElementById("userForm") as HTMLFormElement;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement)
        .value;
      const password = (document.getElementById("password") as HTMLInputElement)
        .value;
      const phone = (document.getElementById("phone") as HTMLInputElement)
        .value;
      const role = (document.getElementById("role") as HTMLSelectElement)
        .value as any;
      const status = (document.getElementById("status") as HTMLSelectElement)
        .value as any;

      try {
        // Tạo ngẫu nhiên ID string tương tự MongoDB dạng string (bởi vì backend schema của bạn sử dụng String cho _id)
        const _id =
          Math.random().toString(36).substring(2, 15) +
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
      } catch (error) {
        alert("Lỗi: " + (error as Error).message);
      }
    });
  }

  // Chỉnh sửa
  async edit(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;

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

      const form = document.getElementById("userForm") as HTMLFormElement;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = (document.getElementById("name") as HTMLInputElement)
          .value;
        const phone = (document.getElementById("phone") as HTMLInputElement)
          .value;
        const role = (document.getElementById("role") as HTMLSelectElement)
          .value as any;
        const status = (document.getElementById("status") as HTMLSelectElement)
          .value as any;

        try {
          await UserService.update(id, { name, phone, role, status });
          alert("Cập nhật thành công!");
          window.location.href = "admin.html?ctrl=user&act=list";
        } catch (error) {
          alert("Lỗi: " + (error as Error).message);
        }
      });
    } catch (error) {
      app.innerHTML = `<div style="color: red; padding: 20px;">Lỗi: ${(error as Error).message}</div>`;
    }
  }

  // Xóa
  async delete(id: string): Promise<void> {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await UserService.remove(id);
        alert("Xóa thành công!");
        window.location.reload();
      } catch (error) {
        alert("Lỗi: " + (error as Error).message);
      }
    }
  }

  // Đăng nhập
  async login(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = AuthView.renderLogin();

    const form = document.getElementById("login-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = (document.getElementById("login-email") as HTMLInputElement).value;
        const password = (document.getElementById("login-password") as HTMLInputElement).value;

        try {
          await UserService.login({ email, password });
          alert("Đăng nhập thành công!");
          
          // Trở lại trang trước đó nếu được yêu cầu đặt sân
          const pendingBooking = sessionStorage.getItem("pending_booking");
          if (pendingBooking) {
            window.location.href = "?ctrl=user&act=payment";
          } else {
            window.location.href = "?";
          }
        } catch (error: any) {
          alert(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.");
        }
      });
    }
  }

  // Đăng ký
  async register(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = AuthView.renderRegister();

    const form = document.getElementById("register-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = (document.getElementById("register-name") as HTMLInputElement).value;
        const email = (document.getElementById("register-email") as HTMLInputElement).value;
        const phone = (document.getElementById("register-phone") as HTMLInputElement).value;
        const password = (document.getElementById("register-password") as HTMLInputElement).value;
        const confirm_password = (document.getElementById("register-confirm-password") as HTMLInputElement).value;

        if (password !== confirm_password) {
          alert("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
          return;
        }

        try {
          await UserService.register({ name, email, phone, password, confirm_password, role: "user" });
          alert("Đăng ký tài khoản thành công! Hãy tiến hành đăng nhập.");
          window.location.href = "?ctrl=user&act=login";
        } catch (error: any) {
          alert(error.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
        }
      });
    }
  }

  // Trang thanh toán hóa đơn đặt sân
  async payment(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;

    const pendingStr = sessionStorage.getItem("pending_booking");
    if (!pendingStr) {
      alert("Không tìm thấy thông tin lượt đặt sân chờ thanh toán!");
      window.location.href = "?";
      return;
    }

    const bookingData = JSON.parse(pendingStr);
    const centerName = sessionStorage.getItem("pending_center_name") || "Cụm sân thể thao";
    const courtName = sessionStorage.getItem("pending_court_name") || "Sân đấu";

    app.innerHTML = AuthView.renderPayment(bookingData, centerName, courtName);

    // Đảm bảo có thuộc tính subtotal
    if (bookingData.subtotal === undefined) {
      bookingData.subtotal = bookingData.total_price;
    }

    const cancelBtn = document.getElementById("cancel-payment-btn") as HTMLButtonElement;
    const confirmBtn = document.getElementById("confirm-payment-btn") as HTMLButtonElement;
    const applyVoucherBtn = document.getElementById("apply-voucher-btn") as HTMLButtonElement;
    const voucherInput = document.getElementById("voucher-code-input") as HTMLInputElement;
    const voucherMessage = document.getElementById("voucher-message") as HTMLDivElement;

    const discountRow = document.getElementById("discount-row") as HTMLDivElement;
    const discountDisplay = document.getElementById("payment-discount") as HTMLSpanElement;
    const totalDisplay = document.getElementById("payment-total") as HTMLSpanElement;

    if (applyVoucherBtn && voucherInput && voucherMessage) {
      applyVoucherBtn.addEventListener("click", async () => {
        const code = voucherInput.value.trim().toUpperCase();
        if (!code) {
          voucherMessage.textContent = "Vui lòng nhập mã voucher!";
          voucherMessage.className = "text-xs mt-xs text-error block";
          return;
        }

        voucherMessage.textContent = "Đang kiểm tra...";
        voucherMessage.className = "text-xs mt-xs text-on-surface-variant block";
        applyVoucherBtn.disabled = true;

        try {
          const vouchers = await VoucherService.getAll();
          const voucher = vouchers.find(v => v.code.toUpperCase() === code);

          if (!voucher) {
            voucherMessage.textContent = "Mã giảm giá không tồn tại hoặc đã hết hạn!";
            voucherMessage.className = "text-xs mt-xs text-error block";
            applyVoucherBtn.disabled = false;
            return;
          }

          // Kiểm tra trạng thái
          if (voucher.status !== "active") {
            voucherMessage.textContent = "Mã giảm giá này hiện không khả dụng!";
            voucherMessage.className = "text-xs mt-xs text-error block";
            applyVoucherBtn.disabled = false;
            return;
          }

          // Kiểm tra thời gian
          const now = new Date();
          const startDate = new Date(voucher.start_date);
          const endDate = new Date(voucher.end_date);
          if (now < startDate || now > endDate) {
            voucherMessage.textContent = "Mã giảm giá đã hết hạn sử dụng!";
            voucherMessage.className = "text-xs mt-xs text-error block";
            applyVoucherBtn.disabled = false;
            return;
          }

          // Kiểm tra lượt sử dụng
          if (voucher.used_count >= voucher.usage_limit) {
            voucherMessage.textContent = "Mã giảm giá đã đạt giới hạn lượt sử dụng!";
            voucherMessage.className = "text-xs mt-xs text-error block";
            applyVoucherBtn.disabled = false;
            return;
          }

          // Kiểm tra cụm sân áp dụng
          if (voucher.sport_center_id !== bookingData.sport_center_id) {
            voucherMessage.textContent = "Mã giảm giá này không áp dụng cho cụm sân hiện tại!";
            voucherMessage.className = "text-xs mt-xs text-error block";
            applyVoucherBtn.disabled = false;
            return;
          }

          // Kiểm tra giá trị đơn hàng tối thiểu
          if (bookingData.subtotal < voucher.min_order) {
            const formattedMin = new Intl.NumberFormat("vi-VN").format(voucher.min_order);
            voucherMessage.textContent = `Mã giảm giá chỉ áp dụng cho đơn hàng từ ${formattedMin}đ trở lên!`;
            voucherMessage.className = "text-xs mt-xs text-error block";
            applyVoucherBtn.disabled = false;
            return;
          }

          // Hợp lệ, tiến hành tính giảm giá
          let discount = Math.round((bookingData.subtotal * voucher.discount_percent) / 100);
          if (discount > voucher.max_discount) {
            discount = voucher.max_discount;
          }

          bookingData.voucher_id = voucher._id;
          bookingData.voucher_code = voucher.code;
          bookingData.discount_amount = discount;
          bookingData.total_price = bookingData.subtotal - discount;

          // Cập nhật DOM
          const formattedDiscount = new Intl.NumberFormat("vi-VN").format(discount);
          const formattedTotal = new Intl.NumberFormat("vi-VN").format(bookingData.total_price);

          if (discountRow) discountRow.classList.remove("hidden");
          if (discountDisplay) discountDisplay.textContent = `-${formattedDiscount}đ`;
          if (totalDisplay) totalDisplay.textContent = `${formattedTotal}đ`;

          voucherMessage.textContent = `Áp dụng thành công! Đã giảm ${formattedDiscount}đ cho đơn hàng.`;
          voucherMessage.className = "text-xs mt-xs text-success block";
          applyVoucherBtn.disabled = false;

        } catch (error) {
          console.error(error);
          voucherMessage.textContent = "Đã xảy ra lỗi khi xác thực voucher!";
          voucherMessage.className = "text-xs mt-xs text-error block";
          applyVoucherBtn.disabled = false;
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        if (confirm("Bạn có muốn hủy lượt đặt sân này không?")) {
          sessionStorage.removeItem("pending_booking");
          sessionStorage.removeItem("pending_center_name");
          sessionStorage.removeItem("pending_court_name");
          window.location.href = `?ctrl=detail&id=${bookingData.sport_center_id}`;
        }
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", async () => {
        const selectedMethod = document.querySelector<HTMLInputElement>('input[name="payment_method"]:checked')?.value || "cash";
        const noteInput = document.getElementById("booking-note-input") as HTMLTextAreaElement | null;
        
        // Hoàn thiện thông tin booking trước khi gửi
        const currentUser = UserService.getCurrentUser();
        if (!currentUser) {
          alert("Vui lòng đăng nhập để hoàn tất thanh toán!");
          window.location.href = "?ctrl=user&act=login";
          return;
        }

        bookingData.user_id = currentUser._id; // Thay bằng id user thực đã đăng nhập
        bookingData.payment_method = selectedMethod;
        bookingData.payment_status = selectedMethod === "momo" ? "paid" : "unpaid";
        bookingData.booking_status = "confirmed";
        if (noteInput) {
          bookingData.note = noteInput.value.trim();
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Đang xử lý...";

        try {
          await BookingService.create(bookingData);
          alert(`Chúc mừng! Bạn đã đặt và thanh toán sân thành công.\nMã đặt sân của bạn: ${bookingData.booking_code}`);
          sessionStorage.removeItem("pending_booking");
          sessionStorage.removeItem("pending_center_name");
          sessionStorage.removeItem("pending_court_name");
          
          window.location.href = "?";
        } catch (error: any) {
          alert(error.message || "Đặt sân thất bại. Khung giờ này có thể đã bị người khác đặt trước.");
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Thanh toán ngay";
        }
      });
    }
  }

  // Trang thông tin cá nhân (bao gồm cả Lịch đặt sân dưới dạng tab)
  async profile(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;

    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để xem thông tin tài khoản!");
      window.location.href = "?ctrl=user&act=login";
      return;
    }

    const tabParam = new URLSearchParams(window.location.search).get("tab");
    const defaultTab = tabParam === "bookings" ? "bookings" : "profile";

    app.innerHTML = `<div class="py-xl px-gutter text-center text-on-surface-variant text-sm">Đang tải thông tin...</div>`;

    try {
      // Tải tất cả lịch đặt trước
      const allBookings = await BookingService.getAll();
      
      // Lọc lịch đặt của user hiện tại
      const myBookings = allBookings.filter(b => {
        const userIdStr = typeof b.user_id === "object" ? b.user_id?._id : b.user_id;
        return userIdStr === currentUser._id;
      });

      // Sắp xếp lịch đặt mới nhất lên đầu
      myBookings.sort((a, b) => new Date(b.created_at || b.booking_date).getTime() - new Date(a.created_at || a.booking_date).getTime());

      // Render giao diện tab
      app.innerHTML = AuthView.renderProfile(currentUser, myBookings, defaultTab);

      // Thiết lập bộ lọc trạng thái đơn hàng (Shopee style)
      const statusTabs = document.querySelectorAll(".booking-status-tab");
      const bookingCards = document.querySelectorAll(".booking-card-item");
      const noBookingsMessage = document.getElementById("no-bookings-message");

      statusTabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
          const clickedTab = e.currentTarget as HTMLButtonElement;
          const status = clickedTab.getAttribute("data-status");

          // Update active class on status sub-tabs
          statusTabs.forEach(t => {
            t.className = "booking-status-tab py-2 px-md font-bold text-xs uppercase tracking-wider border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-all whitespace-nowrap";
          });
          clickedTab.className = "booking-status-tab py-2 px-md font-bold text-xs uppercase tracking-wider border-b-2 border-primary text-primary transition-all whitespace-nowrap";

          // Filter card items
          let visibleCount = 0;
          bookingCards.forEach(cardEl => {
            const card = cardEl as HTMLElement;
            const cardStatus = card.getAttribute("data-status");
            if (status === "all" || cardStatus === status) {
              card.classList.remove("hidden");
              visibleCount++;
            } else {
              card.classList.add("hidden");
            }
          });

          // Show empty message if no bookings visible
          if (noBookingsMessage) {
            if (visibleCount === 0) {
              noBookingsMessage.classList.remove("hidden");
            } else {
              noBookingsMessage.classList.add("hidden");
            }
          }
        });
      });

      // Thiết lập chuyển đổi tab
      const tabProfileBtn = document.getElementById("tab-profile-btn");
      const tabPasswordBtn = document.getElementById("tab-password-btn");
      const tabBookingsBtn = document.getElementById("tab-bookings-btn");
      
      const tabProfileContent = document.getElementById("tab-profile-content");
      const tabPasswordContent = document.getElementById("tab-password-content");
      const tabBookingsContent = document.getElementById("tab-bookings-content");

      if (tabProfileBtn && tabPasswordBtn && tabBookingsBtn && tabProfileContent && tabPasswordContent && tabBookingsContent) {
        tabProfileBtn.addEventListener("click", () => {
          // Switch to Profile Tab
          tabProfileContent.classList.remove("hidden");
          tabPasswordContent.classList.add("hidden");
          tabBookingsContent.classList.add("hidden");

          // Update active classes on buttons
          tabProfileBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full bg-primary text-on-primary";
          tabPasswordBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full text-on-surface-variant hover:bg-primary/5";
          tabBookingsBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full text-on-surface-variant hover:bg-primary/5";
          
          // Cập nhật URL mà không reload trang
          const url = new URL(window.location.href);
          url.searchParams.set("tab", "profile");
          window.history.pushState({}, "", url.toString());
        });

        tabPasswordBtn.addEventListener("click", () => {
          // Switch to Password Tab
          tabProfileContent.classList.add("hidden");
          tabPasswordContent.classList.remove("hidden");
          tabBookingsContent.classList.add("hidden");

          // Update active classes on buttons
          tabProfileBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full text-on-surface-variant hover:bg-primary/5";
          tabPasswordBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full bg-primary text-on-primary";
          tabBookingsBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full text-on-surface-variant hover:bg-primary/5";

          // Cập nhật URL mà không reload trang
          const url = new URL(window.location.href);
          url.searchParams.set("tab", "password");
          window.history.pushState({}, "", url.toString());
        });

        tabBookingsBtn.addEventListener("click", () => {
          // Switch to Bookings Tab
          tabProfileContent.classList.add("hidden");
          tabPasswordContent.classList.add("hidden");
          tabBookingsContent.classList.remove("hidden");

          // Update active classes on buttons
          tabProfileBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full text-on-surface-variant hover:bg-primary/5";
          tabPasswordBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full text-on-surface-variant hover:bg-primary/5";
          tabBookingsBtn.className = "flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full bg-primary text-on-primary";

          // Cập nhật URL mà không reload trang
          const url = new URL(window.location.href);
          url.searchParams.set("tab", "bookings");
          window.history.pushState({}, "", url.toString());
        });
      }

      // Đăng ký sự kiện cập nhật profile
      const form = document.getElementById("profile-form") as HTMLFormElement;
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();

          const nameInput = document.getElementById("profile-name") as HTMLInputElement;
          const phoneInput = document.getElementById("profile-phone") as HTMLInputElement;
          const submitBtn = document.getElementById("save-profile-btn") as HTMLButtonElement;

          const name = nameInput.value.trim();
          const phone = phoneInput.value.trim();

          if (!name || !phone) {
            alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
            return;
          }

          const updateData: any = { name, phone };

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Đang cập nhật...";
          }

          try {
            const updatedUser = await UserService.update(currentUser._id, updateData);
            const newUserObj = { ...currentUser, ...updatedUser };
            localStorage.setItem("courtify_user", JSON.stringify(newUserObj));
            alert("Cập nhật thông tin tài khoản thành công!");
            window.location.reload();
          } catch (error: any) {
            alert(error.message || "Lỗi khi cập nhật thông tin!");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Cập nhật thông tin";
            }
          }
        });
      }

      // Đăng ký sự kiện đổi mật khẩu
      const passwordForm = document.getElementById("password-form") as HTMLFormElement;
      if (passwordForm) {
        passwordForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const newPasswordInput = document.getElementById("profile-new-password") as HTMLInputElement;
          const confirmPasswordInput = document.getElementById("profile-confirm-password") as HTMLInputElement;
          const submitBtn = document.getElementById("save-password-btn") as HTMLButtonElement;

          const newPassword = newPasswordInput.value;
          const confirmPassword = confirmPasswordInput.value;

          if (!newPassword || newPassword.length < 6) {
            alert("Mật khẩu mới phải từ 6 ký tự trở lên!");
            return;
          }
          if (newPassword !== confirmPassword) {
            alert("Xác nhận mật khẩu mới không trùng khớp!");
            return;
          }

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Đang lưu...";
          }

          try {
            await UserService.update(currentUser._id, { password: newPassword });
            alert("Thay đổi mật khẩu thành công!");
            newPasswordInput.value = "";
            confirmPasswordInput.value = "";
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Thay đổi mật khẩu";
            }
          } catch (error: any) {
            alert(error.message || "Lỗi khi thay đổi mật khẩu!");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Thay đổi mật khẩu";
            }
          }
        });
      }

      // Đăng ký sự kiện hủy đặt sân
      const cancelButtons = document.querySelectorAll(".cancel-booking-btn");
      cancelButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const bookingId = target.getAttribute("data-id");
          if (!bookingId) return;

          if (confirm("Bạn có chắc chắn muốn hủy lượt đặt sân này không?")) {
            target.disabled = true;
            target.textContent = "Đang xử lý...";
            try {
              await BookingService.update(bookingId, { booking_status: "cancelled" });
              alert("Đã hủy lượt đặt sân thành công!");
              this.profile(); // Tải lại view
            } catch (error: any) {
              alert(error.message || "Không thể hủy lượt đặt sân!");
              target.disabled = false;
              target.textContent = "Hủy đặt sân";
            }
          }
        });
      });

    } catch (error: any) {
      console.error(error);
      app.innerHTML = `<div class="py-xl px-gutter text-center text-error text-sm">Lỗi khi tải thông tin: ${error.message}</div>`;
    }
  }

  // Điều hướng lịch đặt về trang cá nhân tab lịch đặt
  async bookings(): Promise<void> {
    window.location.href = "?ctrl=user&act=profile&tab=bookings";
  }
}


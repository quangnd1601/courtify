export const AuthView = {
  renderLogin: (): string => {
    return `
      <div class="min-h-[500px] flex items-center justify-center py-xl px-gutter">
        <div class="w-full max-w-md bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg space-y-lg shadow-sm ">
          <div class="text-center space-y-xs">
            <h2 class="font-headline-lg text-headline-lg text-primary uppercase">ĐĂNG NHẬP</h2>
          </div>

          <form id="login-form" class="space-y-md">
            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Email của bạn: </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  id="login-email"
                  type="email"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Mật khẩu</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  id="login-password"
                  type="password"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-95 shadow-md flex items-center justify-center gap-xs"
            >
              Đăng nhập
            </button>
          </form>

          <div class="text-center text-body-md text-sm text-on-surface-variant">
            Chưa có tài khoản?
            <a href="?ctrl=user&act=register" class="text-primary hover:underline font-semibold">Đăng ký ngay</a>
          </div>
        </div>
      </div>
    `;
  },

  renderRegister: (): string => {
    return `
      <div class="min-h-[500px] flex items-center justify-center py-xl px-gutter">
        <div class="w-full max-w-md bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg space-y-lg shadow-sm">
          <div class="text-center space-y-xs">
            <h2 class="font-headline-lg text-headline-lg text-primary uppercase">ĐĂNG KÝ COURTIFY</h2>
            <p class="text-on-surface-variant font-body-md text-sm">Bắt đầu trải nghiệm tập luyện chuyên nghiệp</p>
          </div>

          <form id="register-form" class="space-y-md">
            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Họ và tên</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">person</span>
                <input
                  id="register-name"
                  type="text"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Email</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  id="register-email"
                  type="email"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Số điện thoại</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">phone</span>
                <input
                  id="register-phone"
                  type="tel"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Mật khẩu</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  id="register-password"
                  type="password"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Xác nhận mật khẩu</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-95 shadow-md flex items-center justify-center gap-xs"
            >
              Đăng ký tài khoản
            </button>
          </form>

          <div class="text-center text-body-md text-sm text-on-surface-variant">
            Đã có tài khoản?
            <a href="?ctrl=user&act=login" class="text-primary hover:underline font-semibold">Đăng nhập ngay</a>
          </div>
        </div>
      </div>
    `;
  },

  renderPayment: (bookingData: any, centerName: string, courtName: string): string => {
    const formattedTotal = new Intl.NumberFormat("vi-VN").format(bookingData.total_price);
    const slotsString = bookingData.slots.map((s: any) => `${s.start_time}-${s.end_time}`).join(", ");

    return `
      <div class="py-xl px-gutter max-w-2xl mx-auto">
        <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg space-y-lg shadow-md">
          <div class="text-center border-b border-outline-variant pb-md">
            <h2 class="font-headline-lg text-headline-lg text-primary uppercase mt-xs">Hóa Đơn Đặt Sân</h2>
            <p class="text-on-surface-variant text-sm mt-xs">Vui lòng kiểm tra lại thông tin thanh toán bên dưới</p>
          </div>

          <!-- Invoice Details -->
          <div class="space-y-md">
            <div class="flex justify-between border-b border-outline-variant/20 py-sm">
              <span class="text-on-surface-variant font-semibold">Mã Booking:</span>
              <span class="font-bold text-on-surface">${bookingData.booking_code}</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm">
              <span class="text-on-surface-variant font-semibold">Cụm Sân:</span>
              <span class="font-bold text-on-surface">${centerName}</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm">
              <span class="text-on-surface-variant font-semibold">Sân Đặt:</span>
              <span class="font-bold text-on-surface">${courtName}</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm">
              <span class="text-on-surface-variant font-semibold">Ngày Đặt:</span>
              <span class="font-bold text-on-surface">${bookingData.booking_date}</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm">
              <span class="text-on-surface-variant font-semibold">Khung Giờ:</span>
              <span class="font-bold text-on-surface text-right">${slotsString} (${bookingData.slots.length} tiếng)</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm">
              <span class="text-on-surface-variant font-semibold">Tạm Tính:</span>
              <span class="font-bold text-on-surface" id="payment-subtotal">${formattedTotal}đ</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm text-error hidden" id="discount-row">
              <span class="text-on-surface-variant font-semibold">Giảm Giá:</span>
              <span class="font-bold" id="payment-discount">-0đ</span>
            </div>
            <div class="flex justify-between border-b border-outline-variant/20 py-sm text-primary font-bold text-headline-md">
              <span>Tổng Tiền:</span>
              <span id="payment-total">${formattedTotal}đ</span>
            </div>
          </div>

          <!-- Voucher Input -->
          <div class="border-t border-outline-variant/20 pt-md">
            <h3 class="font-headline-md text-sm uppercase tracking-wider text-primary mb-sm">Mã Giảm Giá / Voucher</h3>
            <div class="flex gap-sm">
              <input
                type="text"
                id="voucher-code-input"
                placeholder="Nhập mã voucher (VD: DIS50, SALE10...)"
                class="flex-1 px-md py-xs rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm uppercase"
              />
              <button
                type="button"
                id="apply-voucher-btn"
                class="px-md py-xs bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary-container transition-all active:scale-[0.98] text-sm"
              >
                Áp dụng
              </button>
            </div>
            <div id="voucher-message" class="text-xs mt-xs hidden"></div>
          </div>

          <!-- Note Input -->
          <div class="border-t border-outline-variant/20 pt-md">
            <h3 class="font-headline-md text-sm uppercase tracking-wider text-primary mb-sm">Ghi Chú Đặt Sân</h3>
            <textarea
              id="booking-note-input"
              rows="2"
              placeholder="Nhập ghi chú cho sân (VD: thuê thêm vợt, bóng, nước uống...)"
              class="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm"
            ></textarea>
          </div>

          <!-- Payment Methods -->
          <div class="space-y-sm pt-sm">
            <h3 class="font-headline-md text-sm uppercase tracking-wider text-primary">Phương thức thanh toán</h3>
            <div class="grid grid-cols-2 gap-md">
              <label class="border border-outline-variant hover:border-primary p-md rounded-xl flex items-center gap-sm cursor-pointer hover:bg-primary/5 transition-all">
                <input type="radio" name="payment_method" value="cash" checked class="text-primary focus:ring-primary" />
                <div>
                  <div class="font-bold text-on-surface text-sm">Tiền mặt</div>
                  <div class="text-xs text-on-surface-variant">Thanh toán tại quầy</div>
                </div>
              </label>

              <label class="border border-outline-variant hover:border-primary p-md rounded-xl flex items-center gap-sm cursor-pointer hover:bg-primary/5 transition-all">
                <input type="radio" name="payment_method" value="momo" class="text-primary focus:ring-primary" />
                <div>
                  <div class="font-bold text-on-surface text-sm">Ví Momo</div>
                  <div class="text-xs text-on-surface-variant">Quét mã QR online</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-md pt-md border-t border-outline-variant">
            <button
              id="cancel-payment-btn"
              class="flex-1 py-sm border border-primary text-primary rounded-lg font-label-md hover:bg-primary/5 transition-all active:scale-[0.98]"
            >
              Hủy giao dịch
            </button>
            <button
              id="confirm-payment-btn"
              class="flex-1 py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] shadow-md"
            >
              Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderProfile: (user: any, bookings: any[], defaultTab: "profile" | "password" | "bookings" = "profile"): string => {
    const renderBookingCard = (b: any) => {
      const formattedTotal = new Intl.NumberFormat("vi-VN").format(b.total_price);
      const slotsString = b.slots.map((s: any) => `${s.start_time}-${s.end_time}`).join(", ");
      const formattedDate = new Date(b.booking_date).toLocaleDateString("vi-VN");
      const centerName = b.sport_center_id?.name || "Cụm sân thể thao";
      const courtName = b.court_id?.name || "Sân đấu";
      const address = b.sport_center_id?.address || "";

      let statusColor = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      let statusText = "Chờ duyệt";
      if (b.booking_status === "confirmed") {
        statusColor = "bg-green-500/10 text-green-500 border-green-500/20";
        statusText = "Đã xác nhận";
      } else if (b.booking_status === "completed") {
        statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        statusText = "Hoàn thành";
      } else if (b.booking_status === "cancelled") {
        statusColor = "bg-red-500/10 text-red-500 border-red-500/20";
        statusText = "Đã hủy";
      }

      // Check if it is cancelable
      const bookingDate = new Date(b.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isCancelable = bookingDate >= today && b.booking_status !== "cancelled" && b.booking_status !== "completed";

      return `
        <div class="booking-card-item bg-surface-container-low border border-outline-variant/30 rounded-xl p-md shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-md" data-status="${b.booking_status}">
          <div class="space-y-xs">
            <div class="flex items-center gap-sm flex-wrap">
              <span class="font-bold text-primary text-md uppercase">${b.booking_code}</span>
              <span class="px-xs py-0.5 border text-xs rounded-full font-semibold ${statusColor}">${statusText}</span>
              <span class="px-xs py-0.5 border border-outline-variant/30 text-xs rounded-full text-on-surface-variant font-semibold bg-surface-container-high">${b.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</span>
            </div>
            <h4 class="font-bold text-on-surface text-lg">${centerName} - <span class="text-secondary font-semibold">${courtName}</span></h4>
            <p class="text-xs text-on-surface-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm">location_on</span> ${address}
            </p>
            <p class="text-sm text-on-surface-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm">calendar_month</span> Ngày: <strong>${formattedDate}</strong> | Khung giờ: <strong>${slotsString}</strong>
            </p>
            ${b.note ? `<p class="text-xs text-on-surface-variant/80 italic">Ghi chú: ${b.note}</p>` : ""}
          </div>
          <div class="flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 border-outline-variant/20 pt-sm md:pt-0">
            <div class="text-right">
              <span class="text-xs text-on-surface-variant">Tổng cộng</span>
              <div class="font-bold text-headline-md text-primary text-xl">${formattedTotal}đ</div>
            </div>
            ${isCancelable ? `
              <button
                data-id="${b._id}"
                class="cancel-booking-btn mt-xs px-md py-xs border border-red-500 text-red-500 rounded-lg hover:bg-red-500/5 transition-all text-xs font-semibold"
              >
                Hủy đặt sân
              </button>
            ` : ""}
          </div>
        </div>
      `;
    };

    const profileActive = defaultTab === "profile";

    return `
      <div class="py-xl px-gutter max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          
          <!-- Left Sidebar Navigation -->
          <aside class="col-span-12 lg:col-span-3">
            <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-md shadow-sm space-y-md sticky top-4 h-full overflow-y-auto">
              <div class="text-center py-md border-b border-outline-variant/10">
                <div class="w-16 h-16 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary/10 mx-auto mb-xs">
                  <img alt="${user.name}" class="w-full h-full object-cover" src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}" />
                </div>
                <p class="font-bold text-md text-on-surface line-clamp-1">${user.name}</p>
                <p class="text-xs text-on-surface-variant line-clamp-1">${user.email}</p>
              </div>
              <nav class="flex flex-col gap-xs">
                <button id="tab-profile-btn" class="flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full ${defaultTab === "profile" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-primary/5"}">
                  <span class="material-symbols-outlined text-sm">person</span>
                  Thông tin cá nhân
                </button>
                <button id="tab-password-btn" class="flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full ${defaultTab === "password" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-primary/5"}">
                  <span class="material-symbols-outlined text-sm">lock</span>
                  Thay đổi mật khẩu
                </button>
                <button id="tab-bookings-btn" class="flex items-center gap-sm px-md py-sm rounded-xl text-left transition-colors font-bold text-sm w-full ${defaultTab === "bookings" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-primary/5"}">
                  <span class="material-symbols-outlined text-sm">event_note</span>
                  Lịch đặt của tôi
                </button>
              </nav>
            </div>
          </aside>

          <!-- Right Content Area -->
          <main class="lg:col-span-9 space-y-lg">
            
            <!-- Tab 1: Profile Form -->
            <div id="tab-profile-content" class="${defaultTab === "profile" ? "" : "hidden"}">
              <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg space-y-lg shadow-md">
                <div class="border-b border-outline-variant pb-sm">
                  <h2 class="font-headline-md text-headline-md text-primary uppercase">Thông Tin Cá Nhân</h2>
                  <p class="text-on-surface-variant text-xs mt-xs">Quản lý và cập nhật thông tin họ tên, số điện thoại của bạn</p>
                </div>

                <form id="profile-form" class="space-y-md">
                  <div class="space-y-xs">
                    <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Họ và tên</label>
                    <input
                      type="text"
                      id="profile-name"
                      value="${user.name}"
                      required
                      class="w-full pl-3 pr-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div class="space-y-xs">
                    <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Email (Không thể thay đổi)</label>
                    <input
                      type="email"
                      id="profile-email"
                      value="${user.email}"
                      disabled
                      class="w-full pl-3 pr-3 py-2 rounded-lg border border-outline-variant bg-surface-container/50 text-on-surface-variant text-sm cursor-not-allowed"
                    />
                  </div>

                  <div class="space-y-xs">
                    <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Số điện thoại</label>
                    <input
                      type="text"
                      id="profile-phone"
                      value="${user.phone || ""}"
                      required
                      class="w-full pl-3 pr-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div class="pt-md border-t border-outline-variant">
                    <button
                      type="submit"
                      id="save-profile-btn"
                      class="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] shadow-md text-sm"
                    >
                      Cập nhật thông tin
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Tab 2: Change Password Form -->
            <div id="tab-password-content" class="${defaultTab === "password" ? "" : "hidden"}">
              <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg space-y-lg shadow-md">
                <div class="border-b border-outline-variant pb-0">
                  <h2 class="font-headline-md text-headline-md text-primary uppercase mb-0">Thay Đổi Mật Khẩu</h2>
                </div>

                <form id="password-form" class="space-y-md">
                  <div class="space-y-xs">
                    <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Mật khẩu mới</label>
                    <input
                      type="password"
                      id="profile-new-password"
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                      required
                      class="w-full pl-3 pr-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div class="space-y-xs">
                    <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      id="profile-confirm-password"
                      placeholder="Xác nhận mật khẩu mới"
                      required
                      class="w-full pl-3 pr-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div class="pt-md border-t border-outline-variant">
                    <button
                      type="submit"
                      id="save-password-btn"
                      class="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] shadow-md text-sm"
                    >
                      Thay đổi mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Tab 3: Bookings Content (Shopee Style) -->
            <div id="tab-bookings-content" class="${defaultTab === "bookings" ? "" : "hidden"} space-y-md">
              <!-- Shopee-style Order Status Nav -->
              <div class="flex border-b border-outline-variant/20 overflow-x-auto gap-xs pb-1">
                <button class="booking-status-tab flex-1 py-2 text-center font-bold text-xs uppercase tracking-wider border-b-2 border-primary text-primary transition-all whitespace-nowrap" data-status="all">
                  Tất cả
                </button>
                <button class="booking-status-tab flex-1 py-2 text-center font-bold text-xs uppercase tracking-wider border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-all whitespace-nowrap" data-status="pending">
                  Chờ duyệt
                </button>
                <button class="booking-status-tab flex-1 py-2 text-center font-bold text-xs uppercase tracking-wider border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-all whitespace-nowrap" data-status="confirmed">
                  Đã xác nhận
                </button>
                <button class="booking-status-tab flex-1 py-2 text-center font-bold text-xs uppercase tracking-wider border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-all whitespace-nowrap" data-status="completed">
                  Đã hoàn thành
                </button>
                <button class="booking-status-tab flex-1 py-2 text-center font-bold text-xs uppercase tracking-wider border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-all whitespace-nowrap" data-status="cancelled">
                  Đã hủy
                </button>
              </div>

              <!-- Booking cards list -->
              <div id="bookings-list-container" class="space-y-md mt-md">
                ${bookings.length > 0
        ? bookings.map(b => renderBookingCard(b)).join("")
        : `<div class="text-center py-xl text-on-surface-variant text-sm">Không có lịch đặt sân nào.</div>`
      }
                <!-- No bookings matching status message -->
                <div id="no-bookings-message" class="text-center py-xl text-on-surface-variant text-sm hidden">Không có lịch đặt sân nào ở trạng thái này.</div>
              </div>
            </div>

          </main>
        </div>
      </div>
    `;
  }
};

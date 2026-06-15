export const HomeView = {
    // ─── Render card cụm sân ───────────────────────────────────────────────────
    renderCenterCard: (center) => {
        const lowestPrice = center.pricing && center.pricing.length > 0
            ? Math.min(...center.pricing.map((p) => p.price))
            : 100000;
        const formattedPrice = new Intl.NumberFormat("vi-VN").format(lowestPrice);
        const sportName = typeof center.sport_id === "object" ? center.sport_id.name : "Thể thao";
        const rating = center.rating_avg ?? 5.0;
        const thumbnail = center.thumbnail ||
            "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop";
        return `
      <div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-outline-variant/30 shadow-sm hover:shadow-lg">
        <div class="relative h-48 overflow-hidden">
          <img alt="${center.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${thumbnail}" />
          <div class="absolute top-sm left-sm bg-primary text-on-primary text-label-sm px-sm py-[2px] rounded font-semibold">${sportName}</div>
          <div class="absolute top-sm right-sm bg-amber-500 text-white text-label-sm px-sm py-[2px] rounded font-semibold flex items-center gap-[2px]">
            <span class="material-symbols-outlined text-[14px] leading-none">local_fire_department</span>
            ${center.booking_count} lần đặt
          </div>
        </div>
        <div class="p-md">
          <div class="flex justify-between mb-xs items-start gap-sm">
            <h4 class="font-headline-md text-headline-md text-on-surface line-clamp-1 flex-1">${center.name}</h4>
            <div class="flex items-center text-secondary gap-xs shrink-0 mt-[2px]">
              <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">star</span>
              <span class="text-label-sm font-semibold">${rating.toFixed(1)}</span>
            </div>
          </div>
          <p class="text-on-surface-variant font-body-md text-sm mb-md flex items-center gap-xs line-clamp-1">
            <span class="material-symbols-outlined text-sm">location_on</span>
            ${center.address}
          </p>
          <div class="flex justify-between items-center border-t border-outline-variant pt-md">
            <span class="font-headline-md text-primary text-base">
              Từ ${formattedPrice}đ<span class="text-label-sm text-on-surface-variant font-normal">/giờ</span>
            </span>
            <a href="?ctrl=detail&id=${center._id}"
               class="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-primary-container transition-colors active:scale-95 shrink-0">
              CHI TIẾT
            </a>
          </div>
        </div>
      </div>
    `;
    },
    // ─── Render danh sách cards ────────────────────────────────────────────────
    renderList: (list) => {
        if (list.length === 0) {
            return `<p class="text-on-surface-variant col-span-full text-center py-md font-body-md">Không có dữ liệu hiển thị.</p>`;
        }
        return list.map((c) => HomeView.renderCenterCard(c)).join("");
    },
    // ─── Render trạng thái lỗi danh sách ──────────────────────────────────────
    renderListError: () => `<p class="text-red-600 col-span-full text-center py-md font-body-md">Lỗi kết nối Backend. Vui lòng thử lại!</p>`,
    // ─── Render toàn bộ trang chủ (skeleton + data containers) ────────────────
    renderPage: () => `
    <!-- ═══ Hero ═══ -->
    <section class="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          alt="Sân tennis chuyên nghiệp vào lúc hoàng hôn"
          class="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUKI-Yb4eoVXRQjrn1ZUhRMQ2V4Ud70k4ZV9W_yGdcguWdts-UJek9LEw8Nkoq6JwqThvndi3f2eBgiRkMxO_dv_63RgwJYBVTUp5QIf01FHETArHf0_ORjtsRGwupmzPOFoEbdeWev7Fbdvu73DZy4haenuluhkcRO6QaRj6b0XYf6ZT4cNPgOWvtg4TJ7AyOSnj7nBiZBphjgjzpdxGbTHrRp_TnPooZp-rh-4uk0CoSmXdXbETNig"
        />
        <div class="absolute inset-0 hero-gradient"></div>
      </div>
      <div class="relative z-10 px-gutter max-w-container-max mx-auto w-full text-center text-white py-xl">
        <h1 class="font-headline-xl text-headline-xl mb-md uppercase">LÀM CHỦ MỌI TRẬN ĐẤU</h1>
        <p class="font-body-lg text-body-lg mb-xl max-w-2xl mx-auto opacity-90">
          Đặt sân Tennis, Cầu lông và Pickleball chuyên nghiệp chỉ trong vài giây.
          Đỉnh cao thi đấu bắt đầu từ sân chơi đúng tầm.
        </p>
        <!-- Search Bar -->
        <form action="" method="GET" class="glass-card p-md rounded-xl shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-sm items-end text-left">
          <input type="hidden" name="ctrl" value="search" />
          <div class="space-y-xs">
            <label class="text-label-sm text-on-surface-variant ml-1 uppercase">ĐỊA ĐIỂM</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">location_on</span>
              <input name="location" class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface" placeholder="Thành phố hoặc Câu lạc bộ" type="text" />
            </div>
          </div>
          <div class="space-y-xs">
            <label class="text-label-sm text-on-surface-variant ml-1 uppercase">MÔN THỂ THAO</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">sports_tennis</span>
              <select name="sport_name" class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface appearance-none">
                <option value="">Tất cả</option>
                <option value="Tennis">Tennis</option>
                <option value="Cầu lông">Cầu lông</option>
                <option value="Pickleball">Pickleball</option>
              </select>
            </div>
          </div>
          <div class="space-y-xs">
            <label class="text-label-sm text-on-surface-variant ml-1 uppercase">NGÀY ĐẶT</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">calendar_today</span>
              <input class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface" type="date" />
            </div>
          </div>
          <button type="submit" class="h-[46px] rounded-lg font-label-md flex items-center justify-center gap-xs bg-primary text-on-primary hover:bg-primary-container transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined">search</span> TÌM SÂN NGAY
          </button>
        </form>
      </div>
    </section>

    <!-- ═══ Categories ═══ -->
    <section class="py-xl px-gutter max-w-container-max mx-auto">
      <div class="flex items-center justify-between mb-lg">
        <h2 class="font-headline-lg text-headline-lg text-primary uppercase">CHỌN BỘ MÔN CỦA BẠN</h2>
        <div class="h-1 flex-1 mx-lg bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-secondary w-1/4"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div class="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="window.location.href='?ctrl=search&sport_name=Tennis'">
          <img alt="Sân Tennis" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiCplggzlc6yzpV4MzzycJ9Yyq0dCcywhneGkZ1Q875uF_c0hGzawzUHxIEDgzUszBTPgrR7-lv7O_U-k2s375TFEZOK_VFEZvtpYcsnOKmzS7cZSZVclHL19WaEymDfyooVYq8tleY89A8BiIRbwU4jfddrUjFtAPVtoQ3ynfb7kaMuXHGpGtcHz1M98etEfbQWujb-CIzleTQwI2hpUXhdSC9X9yU5CG32XHwMlXEe84BySmu1uanw" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-lg text-white">
            <span class="material-symbols-outlined mb-sm text-secondary-fixed text-4xl">sports_tennis</span>
            <h3 class="font-headline-md text-headline-md">Tennis</h3>
            <p class="font-body-md text-sm opacity-80 mb-md">Sân đất nện, sân cỏ và sân cứng luôn sẵn sàng.</p>
            <a class="text-secondary-fixed font-label-md flex items-center gap-xs hover:gap-sm transition-all" href="?ctrl=search&sport_name=Tennis">KHÁM PHÁ SÂN <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
          </div>
        </div>
        <div class="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="window.location.href='?ctrl=search&sport_name=Cầu lông'">
          <img alt="Sân Cầu lông" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3ke26bPwxH5WxIij-QHgFb2Kp79zG9XrjwsD2vPAm2jfkTGoiCpZ_xAvOL4A6OXP3NgkZfUKr18hAA6Wxjl3KGnRZfsypOd_mx59U01K0ZC_MibWY_szcZ4dbAOXBKb0sVTclnSiKu_ZsYTMmDR25QS4O7zXj9GYh_cQtnmMkT8YnnHOSNKSgdrF4CTWamh4xYFSedocLK84FSwImlpYHac58Yn2npdbmDS0U67MhdtTwFKQLIwlPg" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-lg text-white">
            <span class="material-symbols-outlined mb-sm text-secondary-fixed text-4xl">sports_tennis</span>
            <h3 class="font-headline-md text-headline-md">Cầu lông</h3>
            <p class="font-body-md text-sm opacity-80 mb-md">Hệ thống sân sàn gỗ và thảm tổng hợp đạt chuẩn.</p>
            <a class="text-secondary-fixed font-label-md flex items-center gap-xs hover:gap-sm transition-all" href="?ctrl=search&sport_name=Cầu lông">KHÁM PHÁ SÂN <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
          </div>
        </div>
        <div class="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="window.location.href='?ctrl=search&sport_name=Pickleball'">
          <img alt="Sân Pickleball" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvpuz8rHYbyKW0K9OWE-i_0rXKfksHA6hmPzXr8SqDpHXtPTW6CBVyjz0PVSfx6bkp0YRl-d7wcoYwnZYKEN2vbH_iLW6uFooGGMYiQStmU5Qdejevs83d5lj5rXhUBCW71l2LyGBQv1Han0kWsgXVSsY8AaUhRFL23z0atYfbTnACUsTWLhZES4uaxKlTTbnL-P2D_nD4tKoXdnhnb52EUF22IsdNGadXIEwbW5an08jQFK9rA5u4ZQ" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-lg text-white">
            <span class="material-symbols-outlined mb-sm text-secondary-fixed text-4xl">sports_tennis</span>
            <h3 class="font-headline-md text-headline-md">Pickleball</h3>
            <p class="font-body-md text-sm opacity-80 mb-md">Trung tâm kết nối cộng đồng và các giải đấu chuyên nghiệp.</p>
            <a class="text-secondary-fixed font-label-md flex items-center gap-xs hover:gap-sm transition-all" href="?ctrl=search&sport_name=Pickleball">KHÁM PHÁ SÂN <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Most Booked ═══ -->
    <section class="bg-surface-container py-xl">
      <div class="px-gutter max-w-container-max mx-auto">
        <div class="flex items-end justify-between mb-lg">
          <div>
            <span class="text-secondary font-label-md tracking-widest uppercase">Danh sách nổi bật</span>
            <h2 class="font-headline-lg text-headline-lg text-primary uppercase">CỤM SÂN ĐẶT NHIỀU NHẤT</h2>
          </div>
        </div>
        <div id="most-booked-centers-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          <p class="text-on-surface-variant col-span-full text-center py-md font-body-md">Đang tải...</p>
        </div>
      </div>
    </section>

    <!-- ═══ Newest ═══ -->
    <section class="bg-surface-container-low border-t border-outline-variant/30 py-xl">
      <div class="px-gutter max-w-container-max mx-auto">
        <div class="flex items-end justify-between mb-lg">
          <div>
            <span class="text-secondary font-label-md tracking-widest uppercase">Khám phá cụm sân mới</span>
            <h2 class="font-headline-lg text-headline-lg text-primary uppercase">CỤM SÂN MỚI GIA NHẬP</h2>
          </div>
        </div>
        <div id="newest-centers-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          <p class="text-on-surface-variant col-span-full text-center py-md font-body-md">Đang tải...</p>
        </div>
      </div>
    </section>

    <!-- ═══ How It Works ═══ -->
    <section class="py-xl px-gutter max-w-container-max mx-auto text-center">
      <h2 class="font-headline-lg text-headline-lg text-primary mb-xl uppercase">RA SÂN CHỈ VỚI 3 BƯỚC</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
        <div class="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-outline-variant/30 -z-10"></div>
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary mb-md shadow-lg">
            <span class="material-symbols-outlined text-4xl">search</span>
          </div>
          <h3 class="font-headline-md text-headline-md mb-sm">Tìm kiếm</h3>
          <p class="text-on-surface-variant max-w-xs">Lọc theo môn thể thao, loại sân và địa điểm để tìm thấy sân đấu lý tưởng của bạn.</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary mb-md shadow-lg">
            <span class="material-symbols-outlined text-4xl">event_available</span>
          </div>
          <h3 class="font-headline-md text-headline-md mb-sm">Giữ chỗ</h3>
          <p class="text-on-surface-variant max-w-xs">Chọn khung giờ phù hợp và thanh toán bảo mật tức thì qua hệ thống của chúng tôi.</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary mb-md shadow-lg">
            <span class="material-symbols-outlined text-4xl">sports</span>
          </div>
          <h3 class="font-headline-md text-headline-md mb-sm">Trải nghiệm</h3>
          <p class="text-on-surface-variant max-w-xs">Đến sân, quét mã QR và bắt đầu trận đấu đỉnh cao của bạn ngay lập tức.</p>
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="py-xl text-on-surface relative overflow-hidden bg-surface-container-low border-t border-outline-variant/30">
      <div class="absolute right-0 top-0 w-1/3 h-full flex items-center justify-end opacity-5">
        <span class="material-symbols-outlined text-[300px] text-primary leading-none">sports_tennis</span>
      </div>
      <div class="px-gutter max-w-container-max mx-auto relative z-10 text-center">
        <h2 class="font-headline-xl text-headline-xl mb-md uppercase text-primary">BẠN ĐÃ SẴN SÀNG LÀM CHỦ?</h2>
        <p class="font-body-lg text-body-lg mb-xl max-w-xl mx-auto text-on-surface-variant">
          Gia nhập cộng đồng hơn 10.000 người chơi tin dùng Courtify cho các trận giao hữu và giải đấu hàng tuần.
        </p>
        <div class="flex flex-col sm:flex-row gap-md justify-center">
          <button class="bg-primary text-on-primary px-xl py-md rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-95 shadow-lg">ĐĂNG KÝ MIỄN PHÍ</button>
          <button class="border border-primary text-primary px-xl py-md rounded-lg font-label-md hover:bg-primary/5 transition-all active:scale-95 hover:shadow-md">XEM GÓI THÀNH VIÊN</button>
        </div>
      </div>
    </section>
  `,
};
//# sourceMappingURL=HomeView.js.map
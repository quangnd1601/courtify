export const DetailView = {
    renderLoading: () => {
        return `
      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-md">
          <div class="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p class="text-on-surface-variant font-body-md">Đang tải thông tin cụm sân...</p>
        </div>
      </div>
    `;
    },
    renderError: () => {
        return `
      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-md max-w-md mx-auto px-gutter">
          <span class="material-symbols-outlined text-6xl text-error">error</span>
          <h2 class="font-headline-md text-headline-md text-on-surface">Không thể tải thông tin</h2>
          <p class="text-on-surface-variant font-body-md">Vui lòng kiểm tra kết nối mạng và thử lại.</p>
          <a href="?" class="inline-flex items-center gap-xs bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:bg-primary-container transition-colors">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Về trang chủ
          </a>
        </div>
      </div>
    `;
    },
    renderDetail: (center, courts) => {
        const sportName = typeof center.sport_id === "object" ? center.sport_id.name : "Thể thao";
        const rating = center.rating_avg || 5.0;
        const lowestPrice = center.pricing && center.pricing.length > 0
            ? Math.min(...center.pricing.map((p) => p.price))
            : 100000;
        const formattedPrice = new Intl.NumberFormat("vi-VN").format(lowestPrice);
        const description = center.description ||
            "Trải nghiệm chất lượng quốc tế trên hệ thống sân chuyên nghiệp, được thiết kế với các tiêu chuẩn cao nhất. Hệ thống chiếu sáng LED chuyên nghiệp và không gian rộng rãi đảm bảo trải nghiệm thi đấu tốt nhất.";
        // Gallery images
        const mainImage = center.thumbnail ||
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBvLTqLPRLdimmY6yXA_W0soRK3APnsdFd1Ap_Q5uyXRO2LNQqcCmXSRI1YHShNNVUZ3ftvkpIv34WNTPHppvI1NS6SkaUM5k1-8amCUqGHVtLceuHbSR8WVo2KjzR0REX7En1lshtXvM4HuDpD2lMG8plaSUMvH0qwMRlSw7oSNkEfrVaTtPIVcvQ6sUWjQiaCM3sFJGvbi09jEfQ0y7KQkQ4qUGbyoQ0yMLGgUTp9SymCFViDW-xUSg";
        const galleryImages = center.gallery && center.gallery.length > 0
            ? center.gallery
            : [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBdyQ3Osr0LqFhAozIPQqJYOcoYex8OH7fXThpwapmjJCiP63Wup4UexwKCXstqospbP4-OO-5_rY3kpXd0gqraieSFIqN5pyxaYt-kVxxiliAwNqdAqNKrYsnsEz3FL6xKe2IdHjNbJ73PMOcnDHe4xazIDSHo2sSu1bjTA_zE5qG7JWtmxpM38zfV4DNaP5bYz16plmmTNpOPv56xFiAnwqviGOuNk5EJjcl_9Rs9I9-pBu8IU-Swuw",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAfBYzN6tutzMRSCEzjWtheTYuHYvhlF6W2qtyHQB11uX1dXxdnnSuPQIk-r6N1A0VCj0uvgDiSoQD5Bs1BrzO9gkVxf8fbHKWadKctOtniNk5g5o6y4egB7GmnA0BaUmOt6mEs3mUVhknSZt7WAieBLzhX7k1acy4Vqm_ItZ322xKjOtc1pHiSxYaBNMc8GkofmzFpCD1lZFQYsEM66wUYxC1vAfdflDECs1ir2KafzbdyAti81VWrJA",
            ];
        // Build pricing table rows
        const pricingRows = center.pricing && center.pricing.length > 0
            ? center.pricing
                .map((p) => `
        <div class="flex justify-between items-center py-sm border-b border-outline-variant/20 last:border-b-0">
          <span class="font-label-md text-on-surface">${p.start_time} - ${p.end_time}</span>
          <span class="font-headline-md text-primary">${new Intl.NumberFormat("vi-VN").format(p.price)} VNĐ</span>
        </div>
      `)
                .join("")
            : `<p class="text-on-surface-variant text-sm">Chưa có thông tin giá.</p>`;
        // Build courts list
        const activeCourts = courts.filter((c) => c.status === "active");
        const courtsHtml = activeCourts.length > 0
            ? `<div class="grid grid-cols-4 gap-sm" id="court-selector">
          ${activeCourts
                .map((court, idx) => `
            <button data-court-id="${court._id}" class="court-btn py-sm ${idx === 0 ? "bg-primary-container text-white shadow-md ring-2 ring-primary-container ring-offset-2" : "border border-outline-variant hover:bg-surface-container-low transition-colors"} rounded-xl font-label-md">
              ${court.name}
            </button>
          `)
                .join("")}
        </div>`
            : `<p class="text-on-surface-variant text-sm">Chưa có sân nào hoạt động.</p>`;
        // Time slots - placeholder, DetailController sẽ load động
        const timeSlotSection = `
      <div class="space-y-xs">
        <label class="font-label-md text-primary uppercase tracking-wider">KHUNG GIỜ TRỐNG</label>
        <div class="grid grid-cols-2 gap-sm" id="time-slot-container">
          <div class="col-span-2 flex items-center justify-center py-sm gap-sm text-on-surface-variant">
            <div class="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span class="text-label-sm">Đang tải khung giờ...</span>
          </div>
        </div>
      </div>`;
        return `
      <div class="max-w-container-max mx-auto px-gutter py-lg">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-xs text-on-surface-variant font-label-sm mb-lg">
          <a href="?" class="hover:text-primary transition-colors cursor-pointer">Trang chủ</a>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>${sportName}</span>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span class="text-primary font-bold">${center.name}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <!-- Left Column: Content & Gallery -->
          <div class="lg:col-span-8 space-y-xl">
            <!-- Bento Grid Gallery -->
            <section class="grid grid-cols-4 grid-rows-2 gap-md h-[400px] md:h-[550px]">
              <div class="col-span-3 row-span-2 relative rounded-xl overflow-hidden group cursor-pointer">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="${center.name}"
                  src="${mainImage}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div class="col-span-1 row-span-1 rounded-xl overflow-hidden cursor-pointer">
                <img class="w-full h-full object-cover"
                  alt="Hình ảnh cụm sân"
                  src="${galleryImages[0] || mainImage}" />
              </div>
              <div class="col-span-1 row-span-1 relative rounded-xl overflow-hidden cursor-pointer group">
                <img class="w-full h-full object-cover"
                  alt="Hình ảnh cụm sân"
                  src="${galleryImages[1] || galleryImages[0] || mainImage}" />
                ${galleryImages.length > 2
            ? `
                <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-white font-label-md flex items-center gap-xs">
                    <span class="material-symbols-outlined">grid_view</span> Xem ${galleryImages.length} Ảnh
                  </span>
                </div>`
            : ""}
              </div>
            </section>

            <!-- Header Info -->
            <div class="space-y-md">
              <div class="flex flex-wrap items-center justify-between gap-md">
                <div>
                  <h1 class="font-headline-xl text-headline-xl text-primary">${center.name}</h1>
                  <p class="flex items-center gap-xs text-on-surface-variant mt-xs">
                    <span class="material-symbols-outlined text-[18px]">location_on</span>
                    ${center.address}
                  </p>
                </div>
                <div class="flex gap-sm">
                  <button class="p-sm rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
                    <span class="material-symbols-outlined">share</span>
                  </button>
                  <button class="p-sm rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
                    <span class="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </div>
              <!-- Stats badges -->
              <div class="flex flex-wrap gap-sm">
                <span class="inline-flex items-center gap-xs bg-primary-container text-white px-md py-xs rounded-lg text-label-sm font-semibold">
                  <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                  ${rating.toFixed(1)}
                </span>
                <span class="inline-flex items-center gap-xs bg-amber-500 text-white px-md py-xs rounded-lg text-label-sm font-semibold">
                  <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
                  Đã đặt ${center.booking_count} lần
                </span>
                <span class="inline-flex items-center gap-xs bg-secondary text-on-secondary px-md py-xs rounded-lg text-label-sm font-semibold">
                  <span class="material-symbols-outlined text-[14px]">sports_tennis</span>
                  ${sportName}
                </span>
              </div>
            </div>

            <!-- Amenities -->
            <section class="space-y-md">
              <h2 class="font-headline-md text-headline-md text-primary">Tiện ích sân</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-md">
                <div class="flex items-center gap-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <span class="material-symbols-outlined text-primary">local_parking</span>
                  <span class="font-label-md">Gửi xe miễn phí</span>
                </div>
                <div class="flex items-center gap-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <span class="material-symbols-outlined text-primary">shower</span>
                  <span class="font-label-md">Phòng tắm & Tủ đồ</span>
                </div>
                <div class="flex items-center gap-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <span class="material-symbols-outlined text-primary">restaurant</span>
                  <span class="font-label-md">Căng tin / Cà phê</span>
                </div>
                <div class="flex items-center gap-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <span class="material-symbols-outlined text-primary">ac_unit</span>
                  <span class="font-label-md">Điều hòa nhiệt độ</span>
                </div>
              </div>
            </section>

            <!-- Description -->
            <section class="space-y-md">
              <h2 class="font-headline-md text-headline-md text-primary">Mô tả</h2>
              <div class="prose max-w-none text-on-surface-variant font-body-md leading-relaxed">
                <p>${description}</p>
              </div>
            </section>

            <!-- Pricing Table -->
            <section class="space-y-md">
              <h2 class="font-headline-md text-headline-md text-primary">Bảng giá</h2>
              <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-lg">
                ${pricingRows}
              </div>
            </section>

            <!-- Map Section -->
            <section class="space-y-md">
              <h2 class="font-headline-md text-headline-md text-primary">Vị trí</h2>
              <div class="w-full h-64 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
                <div class="text-center text-on-surface-variant">
                  <span class="material-symbols-outlined text-4xl mb-sm">map</span>
                  <p class="font-body-md">${center.address}</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Booking Widget -->
          <div class="lg:col-span-4">
            <div class="sticky top-24 bg-white/95 backdrop-blur-[12px] border border-outline-variant/20 p-lg rounded-2xl shadow-lg space-y-lg">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-headline-md font-bold text-primary">Từ ${formattedPrice} VNĐ</span>
                  <span class="text-on-surface-variant font-label-sm">/ giờ</span>
                </div>
                <div class="flex items-center gap-xs bg-primary-container px-sm py-xs rounded-lg text-white">
                  <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="font-bold">${rating.toFixed(1)}</span>
                </div>
              </div>

              <!-- Date Picker -->
              <div class="space-y-xs">
                <label class="font-label-md text-primary uppercase tracking-wider">CHỌN NGÀY</label>
                <div class="relative">
                  <input
                    id="booking-date"
                    class="w-full p-md rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    type="date" value="${new Date().toISOString().split("T")[0]}" />
                </div>
              </div>

              <!-- Court Selector -->
              <div class="space-y-xs">
                <label class="font-label-md text-primary uppercase tracking-wider">CHỌN SÂN</label>
                ${courtsHtml}
              </div>

              <!-- Time Slots -->
              ${timeSlotSection}

              <!-- Price Breakdown -->
              <div class="pt-lg border-t border-outline-variant/30 space-y-md">
                <div class="flex justify-between text-on-surface-variant">
                  <span id="slot-label">Thuê sân (1 giờ)</span>
                  <span id="price-subtotal">${formattedPrice}đ</span>
                </div>
                <div class="flex justify-between text-primary font-bold text-headline-md">
                  <span>Tổng cộng</span>
                  <span id="price-total">${formattedPrice}đ</span>
                </div>
              </div>
              <button id="booking-btn" class="w-full bg-primary-container text-white hover:bg-primary py-md rounded-xl font-headline-md transition-all active:scale-95 flex items-center justify-center gap-md">
                Đặt sân 
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    },
};
//# sourceMappingURL=DetailView.js.map
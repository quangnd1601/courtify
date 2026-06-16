export const SearchView = {
    renderPage: (sports) => {
        // Generate sports options
        const sportOptions = sports
            .map((s) => `<option value="${s._id}">${s.name}</option>`)
            .join("");
        return `
      <div class="max-w-container-max mx-auto px-gutter py-lg">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-xs text-on-surface-variant font-label-sm mb-lg">
          <a href="?" class="hover:text-primary transition-colors cursor-pointer">Trang chủ</a>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span class="text-primary font-bold">Tìm sân</span>
        </nav>

        <!-- Filter and Results Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-lg items-start">
          <!-- Sidebar Bộ lọc -->
          <aside class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg space-y-lg shadow-sm sticky top-24">
            <div class="flex items-center justify-between border-b border-outline-variant pb-sm">
              <h3 class="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                <span class="material-symbols-outlined">filter_list</span> Bộ lọc
              </h3>
              <button id="clear-filters-btn" class="text-primary hover:text-primary-container font-label-md transition-colors text-sm">
                Xóa tất cả
              </button>
            </div>

            <!-- Địa điểm -->
            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Địa điểm</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">location_on</span>
                <input
                  id="filter-location"
                  type="text"
                  class="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  placeholder="Thành phố, Quận..."
                />
              </div>
            </div>

            <!-- Môn thể thao (Danh mục) -->
            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Danh mục môn thể thao</label>
              <div class="relative">

                <select
                  id="filter-sport"
                  class="w-full pl-4 pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest appearance-none"
                >
                  <option value="">Tất cả môn thể thao</option>
                  ${sportOptions}
                </select>
              </div>
            </div>

            <!-- Giá cả -->
            <div class="space-y-xs">
              <label class="text-label-sm text-on-surface-variant uppercase font-semibold">Giá cả (đ/giờ)</label>
              <div class="grid grid-cols-2 gap-sm">
                <input
                  id="filter-price-min"
                  type="number"
                  placeholder="Từ"
                  class="w-full px-sm py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  min="0"
                />
                <input
                  id="filter-price-max"
                  type="number"
                  placeholder="Đến"
                  class="w-full px-sm py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                  min="0"
                />
              </div>
            </div>

            <!-- Nút Áp Dụng (Chạy khi thay đổi trực tiếp, hoặc nhấn nút này trên mobile) -->
            <button
              id="apply-filters-btn"
              class="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-95 shadow-md flex items-center justify-center gap-xs"
            >
              <span class="material-symbols-outlined text-lg">search</span> Lọc Sân
            </button>
          </aside>

          <!-- Vùng kết quả & Sắp xếp -->
          <div class="lg:col-span-3 space-y-md">
            <!-- Thanh công cụ (Toolbar) -->
            <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-md flex flex-col sm:flex-row items-center justify-between gap-md shadow-sm">
              <div class="text-body-md text-on-surface-variant">
                Tìm thấy <span id="results-count" class="font-bold text-primary">0</span> cụm sân phù hợp.
              </div>
              <!-- Sắp xếp -->
              <div class="flex items-center gap-sm w-full sm:w-auto">
                <label for="sort-select" class="text-label-sm text-on-surface-variant shrink-0 uppercase font-semibold">Sắp xếp</label>
                <select
                  id="sort-select"
                  class="w-full sm:w-48 px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-0 text-on-surface bg-surface-container-lowest"
                >
                  <option value="most-booked">Đặt nhiều nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="az">Tên: A - Z</option>
                  <option value="za">Tên: Z - A</option>
                  <option value="price-low">Giá: Thấp - Cao</option>
                  <option value="price-high">Giá: Cao - Thấp</option>
                </select>
              </div>
            </div>

            <!-- Danh sách Cụm Sân -->
            <div id="search-results-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              <!-- Cards load động ở đây -->
            </div>
          </div>
        </div>
      </div>
    `;
    },
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
            <span class="font-headline-md text-primary text-base font-bold">
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
    renderList: (list) => {
        if (list.length === 0) {
            return `
        <div class="col-span-full flex flex-col items-center justify-center py-xl text-on-surface-variant space-y-sm">
          <span class="material-symbols-outlined text-6xl opacity-30">search_off</span>
          <p class="font-body-lg text-center">Không tìm thấy cụm sân nào phù hợp với bộ lọc.</p>
        </div>
      `;
        }
        return list.map((c) => SearchView.renderCenterCard(c)).join("");
    },
    renderLoading: () => `
    <div class="col-span-full flex flex-col items-center justify-center py-xl gap-sm text-on-surface-variant">
      <div class="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p class="text-label-md">Đang tìm kiếm cụm sân...</p>
    </div>
  `,
    renderError: () => `
    <div class="col-span-full flex flex-col items-center justify-center py-xl text-red-500 space-y-xs">
      <span class="material-symbols-outlined text-4xl">error</span>
      <p class="font-headline-md">Lỗi hệ thống</p>
      <p class="text-sm">Vui lòng tải lại trang hoặc thử lại sau.</p>
    </div>
  `,
};
//# sourceMappingURL=SearchView.js.map
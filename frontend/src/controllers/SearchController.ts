import SportsCenterService from "../services/SportsCenterService.js";
import SportService from "../services/SportService.js";
import { SearchView } from "../views/SearchView.js";
import { ISportsCenter } from "../models/SportsCenterModel.js";

export default class SearchController {
  private currentCenters: ISportsCenter[] = [];

  async init(): Promise<void> {
    const app = document.getElementById("app");
    if (!app) return;

    // Hiển thị trạng thái tải ban đầu
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>`;

    try {
      // Tải danh sách các môn thể thao từ backend để điền vào bộ lọc
      const sports = await SportService.getAll();

      // Render cấu trúc trang Tìm kiếm
      app.innerHTML = SearchView.renderPage(sports);

      // Đọc các giá trị bộ lọc từ URL (nếu có) để đặt trạng thái ban đầu
      const urlParams = new URLSearchParams(window.location.search);
      const initialLocation = urlParams.get("location") || "";
      let initialSport = urlParams.get("sport_id") || "";
      const initialPriceMin = urlParams.get("price_min") || "";
      const initialPriceMax = urlParams.get("price_max") || "";
      const initialSort = urlParams.get("sort") || "most-booked";

      // Nếu truyền sport_name từ trang chủ, tìm id tương ứng để select
      const sportNameParam = urlParams.get("sport_name");
      if (sportNameParam && !initialSport) {
        const found = sports.find((s) => s.name.toLowerCase() === sportNameParam.toLowerCase());
        if (found) {
          initialSport = found._id;
        }
      }

      // Điền giá trị vào form
      const locationInput = document.getElementById("filter-location") as HTMLInputElement;
      const sportSelect = document.getElementById("filter-sport") as HTMLSelectElement;
      const priceMinInput = document.getElementById("filter-price-min") as HTMLInputElement;
      const priceMaxInput = document.getElementById("filter-price-max") as HTMLInputElement;
      const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;

      if (locationInput) locationInput.value = initialLocation;
      if (sportSelect) sportSelect.value = initialSport;
      if (priceMinInput) priceMinInput.value = initialPriceMin;
      if (priceMaxInput) priceMaxInput.value = initialPriceMax;
      if (sortSelect) sortSelect.value = initialSort;

      // Tìm kiếm lần đầu
      await this.executeSearch();

      // Lắng nghe sự kiện của form
      this.bindEvents();
    } catch (error) {
      console.error("Lỗi khởi tạo trang tìm kiếm:", error);
      app.innerHTML = SearchView.renderError();
    }
  }

  /** Thực thi tìm kiếm bằng API dựa trên các giá trị hiện có trên form */
  private async executeSearch(): Promise<void> {
    const resultsContainer = document.getElementById("search-results-list");
    const countEl = document.getElementById("results-count");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = SearchView.renderLoading();

    try {
      const locationInput = document.getElementById("filter-location") as HTMLInputElement;
      const sportSelect = document.getElementById("filter-sport") as HTMLSelectElement;
      const priceMinInput = document.getElementById("filter-price-min") as HTMLInputElement;
      const priceMaxInput = document.getElementById("filter-price-max") as HTMLInputElement;
      const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;

      const params = {
        location: locationInput?.value.trim() || undefined,
        sport_id: sportSelect?.value || undefined,
        price_min: priceMinInput?.value || undefined,
        price_max: priceMaxInput?.value || undefined,
        sort: sortSelect?.value || "most-booked",
      };

      // Gọi service
      this.currentCenters = await SportsCenterService.search(params);

      // Render danh sách kết quả
      resultsContainer.innerHTML = SearchView.renderList(this.currentCenters);

      // Cập nhật số lượng
      if (countEl) {
        countEl.textContent = this.currentCenters.length.toString();
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      resultsContainer.innerHTML = SearchView.renderError();
    }
  }

  /** Gắn các sự kiện thay đổi bộ lọc, submit và reset */
  private bindEvents(): void {
    const applyBtn = document.getElementById("apply-filters-btn");
    const clearBtn = document.getElementById("clear-filters-btn");
    const sortSelect = document.getElementById("sort-select");

    // Click nút tìm kiếm / áp dụng bộ lọc
    if (applyBtn) {
      applyBtn.addEventListener("click", () => this.executeSearch());
    }

    // Thay đổi sắp xếp tự động gọi lại API tìm kiếm
    if (sortSelect) {
      sortSelect.addEventListener("change", () => this.executeSearch());
    }

    // Reset bộ lọc
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const locationInput = document.getElementById("filter-location") as HTMLInputElement;
        const sportSelect = document.getElementById("filter-sport") as HTMLSelectElement;
        const priceMinInput = document.getElementById("filter-price-min") as HTMLInputElement;
        const priceMaxInput = document.getElementById("filter-price-max") as HTMLInputElement;
        const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;

        if (locationInput) locationInput.value = "";
        if (sportSelect) sportSelect.value = "";
        if (priceMinInput) priceMinInput.value = "";
        if (priceMaxInput) priceMaxInput.value = "";
        if (sortSelect) sortSelect.value = "most-booked";

        // Thực thi tìm kiếm lại từ đầu
        this.executeSearch();
      });
    }

    // Cho phép ấn Enter tại các ô input để tìm kiếm nhanh
    const inputs = ["filter-location", "filter-price-min", "filter-price-max"];
    inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            this.executeSearch();
          }
        });
      }
    });
  }
}

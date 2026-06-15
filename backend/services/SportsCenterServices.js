const SportsCenterModel = require("../models/SportsCenter");

let getAll = async (options = {}) => {
  const { sort, limit, location, sport_id, price_min, price_max, owner_id } = options;

  // Build filter query object
  let filter = {};

  // 0. Lọc theo owner_id (dành cho Owner Dashboard)
  if (owner_id) {
    filter.owner_id = owner_id;
  }

  // 1. Địa điểm (location hoặc address chứa từ khoá)
  if (location) {
    filter.$or = [
      { address: { $regex: location, $options: "i" } },
      { location: { $regex: location, $options: "i" } },
    ];
  }

  // 2. Danh mục môn thể thao (sport_id)
  if (sport_id) {
    filter.sport_id = sport_id;
  }

  // 3. Lọc giá (dựa trên mức giá thấp nhất trong mảng pricing)
  if (price_min !== undefined && price_min !== "") {
    filter["pricing.price"] = { ...filter["pricing.price"], $gte: Number(price_min) };
  }
  if (price_max !== undefined && price_max !== "") {
    filter["pricing.price"] = { ...filter["pricing.price"], $lte: Number(price_max) };
  }

  let query = SportsCenterModel.find(filter)
    .populate("owner_id", "-password")
    .populate("sport_id");

  // Xử lý Sắp xếp
  if (sort === "newest") {
    query = query.sort({ created_at: -1 });
  } else if (sort === "most-booked") {
    query = query.sort({ booking_count: -1, created_at: -1 });
  } else if (sort === "az") {
    query = query.sort({ name: 1 });
  } else if (sort === "za") {
    query = query.sort({ name: -1 });
  } else if (sort === "price-low") {
    query = query.sort({ "pricing.price": 1 });
  } else if (sort === "price-high") {
    query = query.sort({ "pricing.price": -1 });
  }

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  return await query;
};

let getOne = async (id) => {
  const center = await SportsCenterModel.findById(id).populate("owner_id", "-password").populate("sport_id");
  return center;
};

let create = async (data) => {
  const center = new SportsCenterModel(data);
  const savedCenter = await center.save();
  return savedCenter;
};

let update = async (id, data) => {
  const center = await SportsCenterModel.findByIdAndUpdate(id, data, { new: true });
  return center;
};

let remove = async (id) => {
  const center = await SportsCenterModel.findByIdAndDelete(id);
  return center;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

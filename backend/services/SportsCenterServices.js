const SportsCenterModel = require("../models/SportsCenter");

let getAll = async (options = {}) => {
  const { sort, limit } = options;

  if (sort === "newest") {
    let query = SportsCenterModel.find().populate("owner_id", "-password").populate("sport_id").sort({ created_at: -1 });
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    return await query;
  }

  if (sort === "most-booked") {
    let query = SportsCenterModel.find()
      .populate("owner_id", "-password")
      .populate("sport_id")
      .sort({ booking_count: -1, created_at: -1 });
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    return await query;
  }

  let query = SportsCenterModel.find().populate("owner_id", "-password").populate("sport_id");
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

const CourtModel = require("../models/Court");

let getAll = async (options = {}) => {
  const { sort, limit } = options;

  if (sort === "newest") {
    let query = CourtModel.find().populate("sport_center_id").sort({ created_at: -1 });
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    return await query;
  }

  if (sort === "most-booked") {
    let query = CourtModel.find()
      .populate("sport_center_id")
      .sort({ booking_count: -1, created_at: -1 });
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    return await query;
  }

  let query = CourtModel.find().populate("sport_center_id");
  if (limit) {
    query = query.limit(parseInt(limit));
  }
  return await query;
};

let getOne = async (id) => {
  const court = await CourtModel.findById(id).populate("sport_center_id");
  return court;
};

let create = async (data) => {
  const court = new CourtModel(data);
  const savedCourt = await court.save();
  return savedCourt;
};

let update = async (id, data) => {
  const court = await CourtModel.findByIdAndUpdate(id, data, { new: true });
  return court;
};

let remove = async (id) => {
  const court = await CourtModel.findByIdAndDelete(id);
  return court;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

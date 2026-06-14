const CourtModel = require("../models/Court");

let getAll = async () => {
  const courts = await CourtModel.find().populate("sport_center_id");
  return courts;
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

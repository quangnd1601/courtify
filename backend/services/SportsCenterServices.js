const SportsCenterModel = require("../models/SportsCenter");

let getAll = async () => {
  const centers = await SportsCenterModel.find().populate("owner_id", "-password").populate("sport_id");
  return centers;
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

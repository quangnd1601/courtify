const SportModel = require("../models/Sport");

let getAll = async () => {
  const sports = await SportModel.find();
  return sports;
};

let getOne = async (id) => {
  const sport = await SportModel.findById(id);
  return sport;
};

let create = async (data) => {
  const sport = new SportModel(data);
  const savedSport = await sport.save();
  return savedSport;
};

let update = async (id, data) => {
  const sport = await SportModel.findByIdAndUpdate(id, data, { new: true });
  return sport;
};

let remove = async (id) => {
  const sport = await SportModel.findByIdAndDelete(id);
  return sport;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

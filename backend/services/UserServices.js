const UserModel = require("../models/User");

let getAll = async () => {
  const users = await UserModel.find().select("-password");
  return users;
};

let getOne = async (userId) => {
  const user = await UserModel.findById(userId).select("-password");
  return user;
};

let create = async (data) => {
  const user = new UserModel(data);
  const savedUser = await user.save();
  return savedUser;
};

let update = async (userId, data) => {
  data.updated_at = Date.now();
  const user = await UserModel.findByIdAndUpdate(userId, data, {
    new: true,
  }).select("-password");
  return user;
};

let remove = async (userId) => {
  const user = await UserModel.findByIdAndDelete(userId);
  return user;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

const VoucherModel = require("../models/Voucher");

let getAll = async () => {
  const vouchers = await VoucherModel.find().populate("owner_id", "-password").populate("sport_center_id");
  return vouchers;
};

let getOne = async (id) => {
  const voucher = await VoucherModel.findById(id).populate("owner_id", "-password").populate("sport_center_id");
  return voucher;
};

let create = async (data) => {
  const voucher = new VoucherModel(data);
  const savedVoucher = await voucher.save();
  return savedVoucher;
};

let update = async (id, data) => {
  const voucher = await VoucherModel.findByIdAndUpdate(id, data, { new: true });
  return voucher;
};

let remove = async (id) => {
  const voucher = await VoucherModel.findByIdAndDelete(id);
  return voucher;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

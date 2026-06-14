const VoucherService = require("../services/VoucherServices");
const mongoose = require("mongoose");

const getAllVouchers = async (req, res, next) => {
  try {
    const vouchers = await VoucherService.getAll();
    res.status(200).json({ vouchers });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getVoucherById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const voucher = await VoucherService.getOne(id);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json({ voucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const createVoucher = async (req, res, next) => {
  try {
    const {
      owner_id,
      sport_center_id,
      code,
      description,
      discount_percent,
      max_discount,
      min_order,
      start_date,
      end_date,
      usage_limit,
      used_count,
      status,
    } = req.body;
    if (
      !owner_id ||
      !sport_center_id ||
      !code ||
      discount_percent === undefined ||
      max_discount === undefined ||
      !start_date ||
      !end_date ||
      usage_limit === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ các thông tin bắt buộc (owner_id, sport_center_id, code, discount_percent, max_discount, start_date, end_date, usage_limit)" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner_id) || !mongoose.Types.ObjectId.isValid(sport_center_id)) {
      return res.status(400).json({ message: "Owner ID hoặc Sport Center ID liên kết không hợp lệ" });
    }
    const newVoucher = await VoucherService.create({
      owner_id,
      sport_center_id,
      code,
      description,
      discount_percent,
      max_discount,
      min_order,
      start_date,
      end_date,
      usage_limit,
      used_count,
      status,
    });
    res.status(201).json({ voucher: newVoucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateVoucher = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const voucher = await VoucherService.update(id, req.body);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json({ voucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteVoucher = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const voucher = await VoucherService.remove(id);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json({ message: "Xóa voucher thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};

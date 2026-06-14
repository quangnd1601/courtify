const SportsCenterService = require("../services/SportsCenterServices");
const mongoose = require("mongoose");

const getAllCenters = async (req, res, next) => {
  try {
    const centers = await SportsCenterService.getAll();
    res.status(200).json({ centers });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getCenterById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const center = await SportsCenterService.getOne(id);
    if (!center) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trung tâm thể thao" });
    }
    res.status(200).json({ center });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const createCenter = async (req, res, next) => {
  try {
    const { owner_id, sport_id, name, address, location, description, thumbnail, gallery, pricing, status } =
      req.body;
    if (!owner_id || !sport_id || !name || !address) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ các thông tin bắt buộc (owner_id, sport_id, name, address)" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner_id)) {
      return res.status(400).json({ message: "Owner ID không hợp lệ" });
    }
    if (!mongoose.Types.ObjectId.isValid(sport_id)) {
      return res.status(400).json({ message: "Sport ID không hợp lệ" });
    }
    const newCenter = await SportsCenterService.create({
      owner_id,
      sport_id,
      name,
      address,
      location,
      description,
      thumbnail,
      gallery,
      pricing,
      status,
    });
    res.status(201).json({ center: newCenter });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateCenter = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const center = await SportsCenterService.update(id, req.body);
    if (!center) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trung tâm thể thao" });
    }
    res.status(200).json({ center });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteCenter = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const center = await SportsCenterService.remove(id);
    if (!center) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trung tâm thể thao" });
    }
    res.status(200).json({ message: "Xóa trung tâm thể thao thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
};

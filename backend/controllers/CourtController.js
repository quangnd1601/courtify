const CourtService = require("../services/CourtServices");
const mongoose = require("mongoose");

const getAllCourts = async (req, res, next) => {
  try {
    const { sort, limit, sport_center_id } = req.query;
    const courts = await CourtService.getAll({ sort, limit, sport_center_id });
    res.status(200).json({ courts });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getCourtById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const court = await CourtService.getOne(id);
    if (!court) {
      return res.status(404).json({ message: "Không tìm thấy sân đấu" });
    }
    res.status(200).json({ court });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const createCourt = async (req, res, next) => {
  try {
    const { sport_center_id, name, description, thumbnail, gallery, status } =
      req.body;
    if (!sport_center_id || !name) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc (sport_center_id, name)" });
    }
    if (!mongoose.Types.ObjectId.isValid(sport_center_id)) {
      return res.status(400).json({ message: "Sport Center ID không hợp lệ" });
    }
    const newCourt = await CourtService.create({
      sport_center_id,
      name,
      description,
      thumbnail,
      gallery,
      status,
    });
    res.status(201).json({ court: newCourt });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateCourt = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const court = await CourtService.update(id, req.body);
    if (!court) {
      return res.status(404).json({ message: "Không tìm thấy sân đấu" });
    }
    res.status(200).json({ court });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteCourt = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const court = await CourtService.remove(id);
    if (!court) {
      return res.status(404).json({ message: "Không tìm thấy sân đấu" });
    }
    res.status(200).json({ message: "Xóa sân đấu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
};

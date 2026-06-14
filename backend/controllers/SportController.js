const SportService = require("../services/SportServices");
const mongoose = require("mongoose");

const getAllSports = async (req, res, next) => {
  try {
    const sports = await SportService.getAll();
    res.status(200).json({ sports });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getSportById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const sport = await SportService.getOne(id);
    if (!sport) {
      return res.status(404).json({ message: "Không tìm thấy môn thể thao" });
    }
    res.status(200).json({ sport });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const createSport = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên môn thể thao" });
    }
    const newSport = await SportService.create({ name });
    res.status(201).json({ sport: newSport });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateSport = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const sport = await SportService.update(id, req.body);
    if (!sport) {
      return res.status(404).json({ message: "Không tìm thấy môn thể thao" });
    }
    res.status(200).json({ sport });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteSport = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const sport = await SportService.remove(id);
    if (!sport) {
      return res.status(404).json({ message: "Không tìm thấy môn thể thao" });
    }
    res.status(200).json({ message: "Xóa môn thể thao thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
};

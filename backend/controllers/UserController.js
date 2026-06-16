var UserService = require("../services/UserServices");
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAll();
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// get user by id
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const user = await UserService.getOne(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// update user
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Check email
    const { email, password } = req.body;
    if (email) {
      const existingUsers = await UserService.getAll();
      const emailExists = existingUsers.find(
        (u) => u.email === email && u._id.toString() !== userId,
      );
      if (emailExists) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
    }

    const updateData = { ...req.body };
    if (password) {
      const bcrypt = require("bcryptjs");
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password, salt);
    }

    const user = await UserService.update(userId, updateData);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// delete user
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const user = await UserService.remove(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password, phone, avatar } = req.body;
    if (!name || !email || !password || !confirm_password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "Mật khẩu và xác nhận mật khẩu không trùng khớp" });
    }
    const existingUsers = await UserService.getAll();
    const emailExists = existingUsers.find((u) => u.email === email);
    if (emailExists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const UserModel = require("../models/User");
    const user = new UserModel({
      name,
      email,
      password: hash,
      phone,
      avatar,
    });
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const UserModel = require("../models/User");
    const user = await UserModel.findOne({ email: email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const access_token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: 1 * 60,
      });
      const refresh_token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: 2 * 60,
      });
      res.status(200).json({ user, access_token, refresh_token });
    } else {
      res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const refreshToken = async (req, res, next) => {
  try {
    let { refresh_token } = req.body;
    const data = jwt.verify(refresh_token, process.env.JWT_SECRET);
    const access_token = jwt.sign({ user: data.user }, process.env.JWT_SECRET, {
      expiresIn: 1 * 60,
    });
    refresh_token = jwt.sign({ user: data.user }, process.env.JWT_SECRET, {
      expiresIn: 2 * 60,
    });
    res.status(200).json({ user: data.user, access_token, refresh_token });
  } catch (error) {
    res.status(414).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  refreshToken,
};

var express = require("express");
var router = express.Router();
var {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/UserController");
const authen = require("../middleware/authen");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", authen, updateUser);
router.delete("/:id", deleteUser);

// Auth endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

module.exports = router;

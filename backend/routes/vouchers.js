var express = require("express");
var router = express.Router();
var {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} = require("../controllers/VoucherController");

router.get("/", getAllVouchers);
router.get("/:id", getVoucherById);
router.post("/", createVoucher);
router.put("/:id", updateVoucher);
router.delete("/:id", deleteVoucher);

module.exports = router;

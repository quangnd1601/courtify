var express = require("express");
var router = express.Router();
var {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
} = require("../controllers/SportController");

router.get("/", getAllSports);
router.get("/:id", getSportById);
router.post("/", createSport);
router.put("/:id", updateSport);
router.delete("/:id", deleteSport);

module.exports = router;

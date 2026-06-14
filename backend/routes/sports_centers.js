var express = require("express");
var router = express.Router();
var {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
} = require("../controllers/SportsCenterController");

const upload = require("../middleware/Upload");

router.get("/", getAllCenters);
router.get("/:id", getCenterById);
router.post("/", createCenter);
router.put("/:id", updateCenter);
router.delete("/:id", deleteCenter);

// Route upload single image for Sports Center
router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.json({ status: 0, link: "" });
    } else {
      const url = `/images/${file.filename}`; // URL to be saved in DB
      return res.json({ status: 1, url: url });
    }
  } catch (error) {
    console.log("Upload image error: ", error);
    return res.json({ status: 0, link: "" });
  }
});

// Route upload multiple images for Sports Center (max 9 files)
router.post("/uploads", upload.array("image", 9), async (req, res, next) => {
  try {
    const { files } = req;
    if (!files || files.length === 0) {
      return res.json({ status: 0, urls: [] });
    } else {
      const urls = [];
      for (const singleFile of files) {
        urls.push(`/images/${singleFile.filename}`);
      }
      return res.json({ status: 1, urls: urls });
    }
  } catch (error) {
    console.log("Upload images error: ", error);
    return res.json({ status: 0, urls: [] });
  }
});

module.exports = router;

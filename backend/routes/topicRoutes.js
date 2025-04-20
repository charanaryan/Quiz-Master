const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createTopic,
  getTopicsBySubject,
  updateTopic,
  deleteTopic,
} = require("../controllers/topicController");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), createTopic);
router.get("/:subjectId", getTopicsBySubject);
router.put("/:id", upload.single("image"), updateTopic);
router.delete("/:id", deleteTopic);

module.exports = router;
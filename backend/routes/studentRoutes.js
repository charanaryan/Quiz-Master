const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createStudentProfile,
  getStudentProfile,
  getSubjectCard
} = require("../controllers/studentController");

router.post("/profile", upload.single("profilePicture"), createStudentProfile);
router.get("/profile/:userId", getStudentProfile);
router.get('/subjects', getSubjectCard)
// GET /api/student/results/:studentId
router.get("/results/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const results = await Result.find({ studentId })
      .populate("quizId", "title subjectId")
      .populate("subjectId", "name")
      .sort({ createdAt: -1 });

    const mappedResults = results.map((r) => ({
      _id: r._id,
      quizTitle: r.quizId.title,
      subjectName: r.quizId.subjectId.name,
      score: r.score,
      createdAt: r.createdAt,
    }));

    res.json(mappedResults);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});


module.exports = router;

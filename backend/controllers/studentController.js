const StudentProfile = require("../models/StudentProfile");

exports.createStudentProfile = async (req, res) => {
  const { userId, name, bio } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  if (!userId || !name || !bio || !profilePicture) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // prevent duplicate profiles
    const existing = await StudentProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new StudentProfile({
      userId,
      name,
      bio,
      profilePicture,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Not found" });

    res.status(200).json(profile);
  } catch (err) {
    console.error("Failed to fetch student profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubjectCard = async (req, res) => {
    try {
      const subjects = await Subject.find().populate("instructorId");
      res.json(subjects);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  }

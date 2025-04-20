const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const InstructorProfile = require('../models/InstructorProfile');
const Subject = require('../models/Subject');

// Image Upload Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Where the images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});
const upload = multer({ storage: storage });

/**
 * @route   POST /api/instructor/profile
 * @desc    Create instructor profile
 */
router.post('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId, name, bio } = req.body;
    const profilePicture = req.file ? req.file.path : ''; // Handle the profile picture if uploaded

    const existing = await InstructorProfile.findOne({ userId });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });

    const profile = new InstructorProfile({ userId, name, bio, profilePicture });
    await profile.save();

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/instructor/profile/:userId
 * @desc    Get instructor profile
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/instructor/profile/:userId
 * @desc    Update instructor profile
 */
router.put('/profile/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const profilePicture = req.file ? req.file.path : undefined;

    const updatedData = {
      ...(name && { name }),
      ...(bio && { bio }),
      ...(profilePicture && { profilePicture })
    };

    const updatedProfile = await InstructorProfile.findOneAndUpdate(
      { userId: req.params.userId },
      updatedData,
      { new: true }
    );

    res.status(200).json({ message: 'Profile updated', profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/instructor/subject
 * @desc    Create subject
 */
router.post('/subject', upload.single('image'), async (req, res) => {
  try {
    const { name, instructorId } = req.body;
    const image = req.file ? req.file.path : ''; // Handle image upload if present

    const newSubject = new Subject({
      name,
      image,
      instructorId
    });

    await newSubject.save();
    res.status(201).json({ message: 'Subject created', subject: newSubject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/instructor/subjects/:userId
 * @desc    Get all subjects of instructor
 */
router.get('/subjects/:userId', async (req, res) => {
  try {
    const instructor = await InstructorProfile.findOne({ userId: req.params.userId });
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

    const subjects = await Subject.find({ instructorId: instructor._id });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/instructor/subject/:subjectId
 * @desc    Update subject
 */
router.put('/subject/:subjectId', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : undefined; // Handle image upload if present

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.subjectId,
      { ...(name && { name }), ...(image && { image }) },
      { new: true }
    );

    res.status(200).json({ message: 'Subject updated', subject: updatedSubject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/instructor/subject/:subjectId
 * @desc    Delete subject
 */
router.delete('/subject/:subjectId', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.subjectId); // Delete subject by ID
    res.status(200).json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
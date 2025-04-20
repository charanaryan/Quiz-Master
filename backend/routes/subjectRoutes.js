const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Subject = require('../models/Subject');

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/subjects/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/**
 * @route   DELETE /api/subjects/:id
 * @desc    Delete a subject
 */
router.delete('/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subject deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});


/**
 * @route   GET /api/subjects
 * @desc    Get all subjects for students (no filter)
 */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
  }
});

module.exports = router;

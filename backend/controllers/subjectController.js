const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
  try {
    const { name, instructorId } = req.body;
    const image = req.file?.filename;

    const newSubject = new Subject({ name, image, instructorId });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error });
  }
};

exports.getSubjectsByInstructor = async (req, res) => {
  try {
    const subjects = await Subject.find({ instructorId: req.params.instructorId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
};


/**
 * @route   GET /api/subjects
 * @desc    Get all subjects for students (no filter)
 */


exports.updateSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file?.filename;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, ...(image && { image }) },
      { new: true }
    );

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Error updating subject", error });
  }
};
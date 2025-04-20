const Topic = require("../models/Topic");

exports.createTopic = async (req, res) => {
  try {
    const { name, subjectId } = req.body;
    const image = req.file?.filename;

    const newTopic = new Topic({ name, image, subjectId });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ message: "Error creating topic", error });
  }
};

exports.getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subjectId: req.params.subjectId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching topics", error });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file?.filename;

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name, ...(image && { image }) },
      { new: true }
    );

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Error updating topic", error });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting topic", error });
  }
};
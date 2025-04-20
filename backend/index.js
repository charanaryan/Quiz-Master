const express = require('express');
const cors = require('cors');
const User = require('./models/User');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const quizRoutes = require("./routes/quizRoutes");
const studentRoutes = require("./routes/studentRoutes");



require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/instructor', instructorRoutes);
app.use("/api/subjects", subjectRoutes);
app.use('/api/subjects', subjectRoutes);

app.use("/api/topics", topicRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/student", studentRoutes);



app.get('/', (req, res) => {
  res.send('Backend is running!');
});
  
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
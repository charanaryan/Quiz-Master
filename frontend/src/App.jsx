import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import InstructorDashboard from './pages/InstructorDashboard';
import SubjectPage from './pages/SubjectPage';
import TopicPage from './pages/TopicPage';
import QuizPage from './pages/QuizPage';
import EditQuizForm from './components/Quiz/EditQuizModal'
import StudentDashboard from './pages/StudentDashboard';
import StudentTopicPage from "./pages/StudentTopicPage";
import StudentSubjectPage from './pages/StudentSubjectPage';
import QuizAttemptPage from './pages/QuizAttemptPage';
import QuizResultPage from './pages/QuizResultPage';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>

          {/* ✅ Public (Protected) Routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* 🔐 Instructor Private Routes */}
          <Route
            path="/instructor-dashboard"
            element={<PrivateRoute><InstructorDashboard /></PrivateRoute>}
          />
          <Route
            path="/instructor-dashboard/:subjectId"
            element={<PrivateRoute><SubjectPage /></PrivateRoute>}
          />
          <Route
            path="/instructor-dashboard/:subjectId/:topicId"
            element={<PrivateRoute><TopicPage /></PrivateRoute>}
          />
          <Route
            path="/instructor-dashboard/:subjectId/:topicId/edit-quiz/:quizId"
            element={<PrivateRoute><EditQuizForm /></PrivateRoute>}
          />
          <Route
            path="/instructor-dashboard/:subjectId/:topicId/quiz/:quizId"
            element={<PrivateRoute><QuizPage /></PrivateRoute>}
          />

          {/* 🔐 Student Private Routes */}
          <Route
            path="/student-dashboard"
            element={<PrivateRoute><StudentDashboard /></PrivateRoute>}
          />
          <Route
            path="/student-dashboard/:subjectId"
            element={<PrivateRoute><StudentSubjectPage /></PrivateRoute>}
          />
          <Route
            path="/student-dashboard/:subjectId/:topicId"
            element={<PrivateRoute><StudentTopicPage /></PrivateRoute>}
          />
          <Route
            path="/student-dashboard/:subjectId/:topicId/quiz/:quizId"
            element={<PrivateRoute><QuizAttemptPage /></PrivateRoute>}
          />
          <Route
            path="/student-dashboard/:subjectId/:topicId/quiz/:quizId/result"
            element={<PrivateRoute><QuizResultPage /></PrivateRoute>}
          />
          
        </Routes>
      </Router>
    </div>
  )
}

export default App

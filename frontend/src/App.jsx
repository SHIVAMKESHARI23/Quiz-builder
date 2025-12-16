import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import Progress from './pages/Progress';
import Analysis from './pages/Analysis';
import AboutUs from './pages/AboutUs';
import OwnerQuizzes from './pages/owner/OwnerQuizzes';
import CreateQuiz from './pages/owner/CreateQuiz';
import EditQuiz from './pages/owner/EditQuiz';
import Messages from './pages/owner/Messages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              
              <Route path="/quizzes" element={
                <ProtectedRoute><QuizList /></ProtectedRoute>
              } />
              
              <Route path="/quiz/:id" element={
                <ProtectedRoute><QuizAttempt /></ProtectedRoute>
              } />
              
              <Route path="/result/:id" element={
                <ProtectedRoute><QuizResult /></ProtectedRoute>
              } />
              
              <Route path="/progress" element={
                <ProtectedRoute><Progress /></ProtectedRoute>
              } />
              
              <Route path="/analysis" element={
                <ProtectedRoute><Analysis /></ProtectedRoute>
              } />
              
              <Route path="/about" element={
                <ProtectedRoute><AboutUs /></ProtectedRoute>
              } />
              
              <Route path="/owner/quizzes" element={
                <ProtectedRoute ownerOnly><OwnerQuizzes /></ProtectedRoute>
              } />
              
              <Route path="/owner/create" element={
                <ProtectedRoute ownerOnly><CreateQuiz /></ProtectedRoute>
              } />
              
              <Route path="/owner/edit/:id" element={
                <ProtectedRoute ownerOnly><EditQuiz /></ProtectedRoute>
              } />
              
              <Route path="/owner/messages" element={
                <ProtectedRoute ownerOnly><Messages /></ProtectedRoute>
              } />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

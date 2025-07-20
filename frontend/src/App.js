import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Added Navigate
import AnalyzeEmailPage from './AnalyzeEmailPage';
import AnalyzeWebPage from './AnalyzeWebPage';
import Login from './auth/Login';
import Register from './auth/Register';
import ProtectedRoute from './auth/ProtectedRoute';
import LandingPage from './components/LandingPage'; // ✅ Added LandingPage
import EducationPage from './components/EducationPage';
import HistoryDashboardPage from './components/HistoryDashboardPage';

// ---------------------------
// 🔁 Routing Setup
// ---------------------------
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ New route for homepage landing */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/analyze/web"
          element={
            <ProtectedRoute>
              <AnalyzeWebPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyze/email"
          element={
            <ProtectedRoute>
              <AnalyzeEmailPage />
            </ProtectedRoute>
          }
        />

        <Route path="/education" element={
          <ProtectedRoute>
            <EducationPage />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryDashboardPage />
          </ProtectedRoute>
        } />

        {/* ✅ Updated fallback route from <Login /> to redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

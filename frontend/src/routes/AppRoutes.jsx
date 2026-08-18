import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

import Tasks from "../pages/Tasks/Tasks";
import Notes from "../pages/Notes/Notes";
import Calendar from "../pages/Calendar/Calendar";
import Goals from "../pages/Goals/Goals";
import StudySessions from "../pages/StudySessions/StudySessions";
import Pomodoro from "../pages/Pomodoro/Pomodoro";

import ContestList from "../components/Contest/ContestList";
import Analytics from "../pages/Stats/Stats";
import Profile from "../pages/Profile/Profile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
                    LOGIN
                ========================= */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        {/* =========================
                    REGISTER
                ========================= */}

        <Route path="/register" element={<Register />} />

        {/* =========================
                    DASHBOARD
                ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    ANALYTICS
                ========================= */}

        {/* other routes */}

        <Route path="/analytics" element={<Analytics />} />

        {/* other routes */}

        {/* =========================
                    TASKS
                ========================= */}

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    NOTES
                ========================= */}

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    CALENDAR
                ========================= */}

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    GOALS
                ========================= */}

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    STUDY SESSIONS
                ========================= */}

        <Route
          path="/study-sessions"
          element={
            <ProtectedRoute>
              <StudySessions />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    POMODORO
                ========================= */}

        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <Pomodoro />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    CODING CONTESTS
                ========================= */}

        <Route
          path="/contests"
          element={
            <ProtectedRoute>
              <ContestList />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    PROFILEN
                ========================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

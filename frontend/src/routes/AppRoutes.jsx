import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Main pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Tasks from "../pages/Tasks/Tasks";
import Notes from "../pages/Notes/Notes";
import Calendar from "../pages/Calendar/Calendar";
import Goals from "../pages/Goals/Goals";
import StudySessions from "../pages/StudySessions/StudySessions";
import Pomodoro from "../pages/Pomodoro/Pomodoro";
import Analytics from "../pages/Stats/Stats";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";

// Contest
import ContestList from "../components/Contest/ContestList";

// Authentication protection
import ProtectedRoute from "../components/ProtectedRoute";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =======================================
                    LOGIN
                ======================================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =======================================
                    REGISTER
                ======================================= */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =======================================
                    DASHBOARD
                ======================================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    TASKS
                ======================================= */}

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    NOTES
                ======================================= */}

                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <Notes />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    GOALS
                ======================================= */}

                <Route
                    path="/goals"
                    element={
                        <ProtectedRoute>
                            <Goals />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    CALENDAR
                ======================================= */}

                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <Calendar />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    STUDY SESSIONS
                ======================================= */}

                <Route
                    path="/study-sessions"
                    element={
                        <ProtectedRoute>
                            <StudySessions />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    POMODORO
                ======================================= */}

                <Route
                    path="/pomodoro"
                    element={
                        <ProtectedRoute>
                            <Pomodoro />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    ANALYTICS
                ======================================= */}

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    PROFILE
                ======================================= */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    SETTINGS
                ======================================= */}

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />


                {/* =======================================
                    CODING CONTESTS
                ======================================= */}

                <Route
                    path="/contests"
                    element={
                        <ProtectedRoute>
                            <ContestList />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;
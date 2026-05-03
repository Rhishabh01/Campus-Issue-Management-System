import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

import { Suspense, lazy } from 'react';

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ReportIssue = lazy(() => import("./pages/ReportIssue"));
const DashboardUser = lazy(() => import("./pages/DashboardUser"));
const DashboardSupervisor = lazy(() => import("./pages/DashboardSupervisor"));
const DashboardAdmin = lazy(() => import("./pages/DashboardAdmin"));
const AdminIssues = lazy(() => import("./pages/AdminIssues"));
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-500 font-medium">Loading...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/report"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <ReportIssue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <DashboardUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supervisor"
                element={
                  <ProtectedRoute allowedRoles={["supervisor"]}>
                    <DashboardSupervisor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/issues"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminIssues />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
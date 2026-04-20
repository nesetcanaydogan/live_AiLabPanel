import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Importing Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./layouts/Layout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Senior Architect Note: Using lazy-loading for all page components to optimize initial bundle size.
// This significantly improves initial load performance (LCP) for ready-to-publish applications.
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegistrationForm = lazy(() => import("./pages/RegisterPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/MainDashboard.jsx"));
const ProfilePage = lazy(() => import("./pages/MyProfilePage.jsx"));
const MyTeam = lazy(() => import("./pages/MyTeam.jsx"));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const MessagesPage = lazy(() => import("./pages/MessagesPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));
const DevelopersPage = lazy(() => import("./pages/DevelopersPage.jsx"));

// Professional Full-Page Loader for Suspense
const GlobalLoader = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin mb-4" />
    <p className="text-gray-400 font-medium animate-pulse text-sm">Yükleniyor...</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/developers" element={<DevelopersPage />} />

          {/* Senior Architect Note: 
              Using Nested Route Groupings to manage multi-level authorization.
              Level 1: All authenticated users.
          */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/team" element={<MyTeam />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<AnnouncementsPage />} />

              {/* Level 2: RBAC Protection - Only users with 'Admin' role can mount AdminPanel components. */}
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

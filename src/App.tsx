import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import UploadPage from "@/pages/UploadPage";
import SignupPage from "@/pages/SignupPage";
import GalleryPage from "@/pages/GalleryPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { MainNav } from "@/components/main-navbar";
import ProfilePage from "@/pages/ProfilePage";
import ProfileSettings from "@/pages/ProfileSettings";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <MainNav /> {/* ✅ Add navigation bar at the top */}
        <main className="flex-grow px-4 py-6">
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header";
import MainLayout from "./pages/MainLayout";
import SocialAuthRedirectHandler from "./pages/Login/SocialAuthRedirectHandler";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth";

const App = () => {
  return (
    <div className="main-container">
      <AuthProvider>
        <Header />
        <Routes>
          <Route
            path="/login/success"
            element={<SocialAuthRedirectHandler />}
          />
          <Route
            path="/login/signup-complete"
            element={<SocialAuthRedirectHandler />}
          />
          <Route path="/" element={<Navigate to="/community" replace />} />
          <Route path="/community/*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;

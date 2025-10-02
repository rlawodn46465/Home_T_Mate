import { Routes, Route } from "react-router-dom";
import Header from "./pages/Header";
import MainLayout from "./pages/MainLayout";
import SocialAuthRedirectHandler from "./pages/Login/SocialAuthRedirectHandler";
import "./App.css";

const App = () => {
  return (
    <div className="main-container">
      <Header />
      <Routes>
        <Route path="/login/success" element={<SocialAuthRedirectHandler />} />
        <Route
          path="/login/signup-complete"
          element={<SocialAuthRedirectHandler />}
        />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
};

export default App;

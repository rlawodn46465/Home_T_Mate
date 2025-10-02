import { Routes, Route } from "react-router-dom";
import Header from "./pages/Header";
import "./App.css";
import MainLayout from "./pages/MainLayout";


const App = () => {
  return (
    <div className="main-container">
      <Header />
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
};

export default App;

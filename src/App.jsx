import "./App.css";
import CommunityPage from "./pages/Community/CommunityPage";
import Header from "./pages/Header";
import Login from "./pages/Login/LoginPage";

const App = () => {
  return (
    <div className="main-container">
      <Header />
      <div className="main-content">
        <div className="left-content">
          <CommunityPage />
        </div>
        <div className="right-content">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default App;

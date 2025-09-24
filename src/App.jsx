import "./App.css";
import CommunityPage from "./pages/Community/CommunityPage";
import Header from "./pages/Header";
import Login from "./pages/Home/Login";

function App() {
  return (
    <div className="main-container">
      <Header />
      <div className="main-content">
        <CommunityPage />
        <Login />
      </div>
    </div>
  );
}

export default App;

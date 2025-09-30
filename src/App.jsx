import "./App.css";
import CommunityPage from "./pages/Community/CommunityPage";
import Header from "./pages/Header";
import LoginPage from "./pages/Login/LoginPage";
import OnboardingPage from "./pages/Onboarding/OnboardingPage";

const App = () => {
  return (
    <div className="main-container">
      <Header />
      <div className="main-content">
        <div className="left-content">
          <CommunityPage />
        </div>
        <div className="right-content">
          {/* <LoginPage /> */}
          <OnboardingPage/>
        </div>
      </div>
    </div>
  );
};

export default App;

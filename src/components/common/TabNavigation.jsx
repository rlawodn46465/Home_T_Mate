import "./TabNavigation.css";

//부모 컴포넌트 사용법
/*
const TABS = ["오늘 운동", "리스트"];
const [activeTab, setActiveTab] = useState(TABS[0]);

<TabNavigation
  tabs={TABS}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>

// 컨텐츠 영역
{activeTab === "오늘 운동" && (
  <div>보여질 UI</div>
)}
*/

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation-detail">
      {tabs.map((tabName) => (
        <button
          key={tabName}
          className={`tab-item ${activeTab === tabName ? "active" : ""}`}
          onClick={() => onTabChange(tabName)}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

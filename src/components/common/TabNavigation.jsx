import "./TabNavigation.css";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
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

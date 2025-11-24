import "./TabNavigation.css";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation">
      {tabs.map((part) => (
        <button
          key={part}
          className={`tab-navigation__button ${activeTab === part ? "active" : ""}`}
          onClick={() => onTabChange(part)}
        >
          {part}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

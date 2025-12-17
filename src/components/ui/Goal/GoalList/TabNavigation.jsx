import styles from "./TabNavigation.module.css";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.tabNavigation}>
      {tabs.map((part) => (
        <button
          key={part}
          className={`${styles.tabNavigationButton} ${
            activeTab === part ? styles.active : ""
          }`}
          onClick={() => onTabChange(part)}
        >
          {part}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

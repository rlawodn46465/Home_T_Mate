import styles from "./TabNavigation.module.css";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <nav className={styles.tabNavigation}>
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
    </nav>
  );
};

export default TabNavigation;

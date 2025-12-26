import { memo } from "react";
import styles from "./TabNavigation.module.css";

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

interface TabNavigationProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

const TabNavigation = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps<T>) => {
  return (
    <nav className={styles.container} role="tablist">
      {tabs.map((tabName) => {
        const isActive = activeTab === tabName;
        const tabClassName = `${styles.tabItem} ${
          isActive ? styles.active : ""
        }`;

        return (
          <button
            key={tabName}
            type="button"
            className={tabClassName}
            onClick={() => onTabChange(tabName)}
            aria-selected={isActive}
            role="tab"
          >
            {tabName}
          </button>
        );
      })}
    </nav>
  );
};

export default memo(TabNavigation);

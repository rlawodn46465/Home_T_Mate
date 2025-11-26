import { useState } from "react";
import TabNavigation from "../../../common/TabNavigation";
import LoadGoalTab from "./LoadTab/LoadGoalTab";

const TABS = ["불러오기", "새 운동"];
const ExerciseInfoSection = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "불러오기" && <LoadGoalTab />}
      {activeTab === "새 운동" && <div>새 운동</div>}
    </div>
  );
};

export default ExerciseInfoSection;

import { useState } from "react";
import Button from "../../components/common/Button";
import TabNavigation from "../../components/common/TabNavigation";
import Calendar from "../../components/ui/ExerciseList/Calendar";
import ExerciseList from "../../components/ui/ExerciseList/ExerciseList";
import "./ExerciseListPage.css";

const TABS = ["전체", "개별운동", "루틴", "챌린지"];
const ExerciseListPage = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  return (
    <div className="exercise-list-page">
      <div className="exercise-list-header">
        <h2>운동 활동</h2>
        <Button text={"+ 운동 추가"} onClick={() => {}} />
      </div>
      <Calendar />
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="exercise-list-box">
        <ExerciseList activeTab={activeTab} />
      </div>
    </div>
  );
};

export default ExerciseListPage;

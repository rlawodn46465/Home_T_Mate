import TodayRoutine from "../../components/ui/Dashboard/TodayRoutine";
import WeekInfo from "../../components/ui/Dashboard/WeekInfo";
import WeightChart from "../../components/ui/Dashboard/WeightChart";

const DashboardPage = () => {
  return (
    <div>
      <TodayRoutine />
      <WeekInfo />
      <WeightChart />
    </div>
  );
};

export default DashboardPage;

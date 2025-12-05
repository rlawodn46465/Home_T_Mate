import TodayGoal from "../../components/ui/Dashboard/TodayGoal";
import WeekInfo from "../../components/ui/Dashboard/WeekInfo";
import WeightChart from "../../components/ui/Dashboard/WeightChart";

const DashboardPage = () => {
  return (
    <div>
      <TodayGoal />
      <WeekInfo />
      <WeightChart />
    </div>
  );
};

export default DashboardPage;

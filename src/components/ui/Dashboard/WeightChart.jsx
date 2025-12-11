import "./WeightChart.css";
import BarGroup from "./BarGroup";
import { useFetchWeight } from "../../../hooks/useStats";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";

const WeightChart = () => {
  const { data, loading, error, refetch } = useFetchWeight();

  if (loading) {
    return <Spinner text={"불러오는 중..."} />;
  }

  if (error) {
    return (
      <ErrorMessage message="목표를 불러오지 못했습니다." onRetry={refetch} />
    );
  }

  const OVERALL_MAX_WEIGHT = Math.max(...data.map((d) => d.max));
  const MAX_SCALE = OVERALL_MAX_WEIGHT > 0 ? OVERALL_MAX_WEIGHT : 1;

  return (
    <div className="weight-chart__container">
      <h4 className="section-title">부위별 무게</h4>
      <div className="weight-chart__chart-container">
        {data.map((data, index) => (
          <BarGroup key={index} data={data} maxScale={MAX_SCALE} />
        ))}
      </div>
      <div className="weight-chart__legend-container">
        <div className="weight-chart__legend-item">
          <span className="weight-chart__legend-color weight-chart__legend-color--current"></span>
          <span>이번 주</span>
        </div>
        <div className="weight-chart__legend-item">
          <span className="weight-chart__legend-color weight-chart__legend-color--max"></span>
          <span>최대 무게</span>
        </div>
      </div>
    </div>
  );
};

export default WeightChart;

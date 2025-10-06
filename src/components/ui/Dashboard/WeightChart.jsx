import "./WeightChart.css";
import BarGroup from "./BarGroup";

const CHART_DATA = [
  { part: "등", current: 0, max: 0 },
  { part: "어깨", current: 0, max: 0 },
  { part: "팔", current: 0, max: 0 },
  { part: "가슴", current: 75, max: 90 }, // 이번 주 75, 최대 90
  { part: "하체", current: 60, max: 70 }, // 이번 주 60, 최대 70
  { part: "코어", current: 0, max: 0 },
];

const OVERALL_MAX_WEIGHT = Math.max(...CHART_DATA.map((d) => d.max));
const MAX_SCALE = OVERALL_MAX_WEIGHT > 0 ? OVERALL_MAX_WEIGHT : 1;

const WeightChart = () => {
  return (
    <div className="weight-chart__container">
      <h4 className="section-title">부위별 무게</h4>
      <div className="weight-chart__chart-container">
        {CHART_DATA.map((data, index) => (
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

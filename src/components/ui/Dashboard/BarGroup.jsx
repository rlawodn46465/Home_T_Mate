import "./BarGroup.css";


const BarGroup = ({ data, maxScale }) => {
  const { part, current, max } = data;

  // 최대 무게 막대 높이
  const maxBarHeight = (max / maxScale) * 100;
  // 이번주 무게 막대 높이
  const currentBarHeight = (current / maxScale) * 100;

  // 무게를 소수점 첫째 자리까지 표시
  const formatWeight = (weight) => `${weight.toFixed(1)}kg`;

  return (
    <div className="weight-chart__bar-group">
      

      <div className="weight-chart__bar-wrapper">
        {/* 최대 무게 막대 */}
        <div
          className="weight-chart__bar weight-chart__bar--max"
          style={{ height: `${maxBarHeight}%` }}
        ></div>
        {/* 이번주 무게 막대 */}
        <div
          className="weight-chart__bar weight-chart__bar--current"
          style={{ height: `${currentBarHeight}%` }}
        ></div>
      </div>
    <div className="weight-chart__value-label">
        {formatWeight(current)}
      </div>
      <div className="weight-chart__part-label">{part}</div>
    </div>
  );
};

export default BarGroup;

import { memo } from "react";
import styles from "./BarGroup.module.css";

interface BarData {
  part: string;
  current: number;
  max: number;
}

interface BarGroupProps {
  data: BarData;
  maxScale: number;
}

const BarGroup = ({ data, maxScale }: BarGroupProps) => {
  const { part, current, max } = data;

  // 최대 스케일이 0이거나 데이터가 없는 경우를 대비한 방어 코드
  const safeMaxScale = maxScale || 1;

  // 막대 높이 계산 (0 ~ 100%)
  const maxBarHeight = Math.min((max / safeMaxScale) * 100, 100);
  const currentBarHeight = Math.min((current / safeMaxScale) * 100, 100);

  // 무게 포맷팅 (0일 경우 처리)
  const formatWeight = (weight: number) => `${(weight || 0).toFixed(1)}kg`;

  return (
    <div className={styles.group}>
      <div className={styles.wrapper}>
        {/* 이번주 무게 막대 */}
        <div
          className={styles.currentBar}
          style={{ height: `${currentBarHeight}%` }}
          aria-label={`이번주 ${part} 무게: ${current}kg`}
        />
        {/* 최대 무게 막대 */}
        <div
          className={styles.maxBar}
          style={{ height: `${maxBarHeight}%` }}
          aria-label={`역대 최대 ${part} 무게: ${max}kg`}
        />
      </div>

      <div className={styles.valueLabel}>{formatWeight(current)}</div>
      <div className={styles.partLabel}>{part}</div>
    </div>
  );
};

export default memo(BarGroup);

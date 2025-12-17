import { useMemo, memo } from "react";
import styles from "./WeightChart.module.css";
import BarGroup from "./BarGroup";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";
import { useFetchWeight } from "../../../hooks/useStats";

const WeightChart = () => {
  const { data, loading, error, refetch } = useFetchWeight();

  // 차트 스케일 계산 로직 (데이터 변경 시에만 재계산)
  const maxScale = useMemo(() => {
    if (!data || data.length === 0) return 1;
    const overallMax = Math.max(...data.map((d) => d.max || 0));
    return overallMax > 0 ? overallMax : 1;
  }, [data]);

  if (loading) return <Spinner text="무게 데이터 분석 중..." />;
  if (error)
    return (
      <ErrorMessage message="데이터를 불러오지 못했습니다." onRetry={refetch} />
    );
  if (!data) return null;

  return (
    <section className={styles.container}>
      <h4 className="section-title">부위별 무게</h4>

      <div className={styles.chartArea}>
        {data.map((item, index) => (
          <BarGroup key={item.part || index} data={item} maxScale={maxScale} />
        ))}
      </div>

      <div className={styles.legendArea}>
        <div className={styles.legendItem}>
          <span className={styles.currentBox} />
          <span>이번 주</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.maxBox} />
          <span>최대 무게</span>
        </div>
      </div>
    </section>
  );
};

export default memo(WeightChart);

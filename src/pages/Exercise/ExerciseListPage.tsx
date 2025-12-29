import { useMemo, useState } from "react";
import { format } from "date-fns";

import Button from "../../components/common/Button";
import TabNavigation from "../../components/common/TabNavigation";
import Calendar from "../../components/common/Calendar";
import ExerciseList from "../../components/ui/ExerciseList/ExerciseList";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import { useMonthlyHistory, useDeleteActions } from "../../hooks/useHistory";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";

import styles from "./ExerciseListPage.module.css";

type TabType = (typeof TABS)[number];
type BodyPart = "가슴" | "등" | "어깨" | "하체" | "팔" | "코어";

interface HistoryRecord {
  id: string | number;
  date: string;
  categoryGroup?: string[];
  [key: string]: any; // 기타 필드 대응
}

const TABS = ["전체", "개별운동", "루틴", "챌린지"] as const;
const ALL_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

// 운동 부위별 색상 설정
const BODY_PART_COLORS: Record<BodyPart | string, string> = {
  가슴: "#DC3545",
  등: "#FFC107",
  어깨: "#28A745",
  하체: "#007BFF",
  팔: "#17A2B8",
  코어: "#6610F2",
};

const ExerciseListPage = () => {
  const { navigateToPanel } = usePersistentPanel();
  const [activeTab, setActiveTab] = useState<TabType>(TABS[0]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 데이터 조회 및 액션 관련 훅
  const { historyData, isLoading, error, refetch } = useMonthlyHistory(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1
  );
  const { isProcessing, deleteHistory } = useDeleteActions(refetch);

  // 캘린더에 표시할 날짜별 운동 부위 데이터 가공
  const monthlyDots = useMemo(() => {
    if (!historyData?.length) return {} as Record<string, string[]>;

    return historyData.reduce((acc, curr) => {
      const dateKey = curr.date;
      const currentCategories = curr.categoryGroup || [];
      const existingCategories = acc[dateKey] || [];

      // 중복 제거 후 카테고리 병합
      acc[dateKey] = Array.from(
        new Set([...existingCategories, ...currentCategories])
      );
      return acc;
    }, {});
  }, [historyData]);

  // 운동 추가 페이지 이동
  const handleAddExerciseClick = () => navigateToPanel("?panel=exercise-form");

  // 달력 날짜별 하단 점(dot) 렌더링
  const renderDayContents = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const categories = monthlyDots[dateKey] || [];
    if (!categories.length) return null;

    return (
      <div className={styles.workoutDotsContainer}>
        {categories.map((part, index) => (
          <span
            key={`${dateKey}-${index}`}
            className={styles.workoutDot}
            style={{ backgroundColor: BODY_PART_COLORS[part] || "#ccc" }}
            title={part}
          />
        ))}
      </div>
    );
  };

  // 기록 삭제 처리
  const handleDeleteRecord = async (recordId: string | number) => {
    const success = await deleteHistory(String(recordId));
    if (success) {
      alert("✅ 운동 기록이 삭제되었습니다!");
    } else {
      alert("❌ 운동 기록 삭제에 실패했습니다.");
    }
  };

  // 기록 수정 페이지 이동
  const handleEditRecord = (recordData: HistoryRecord) => {
    navigateToPanel(`?panel=exercise-edit&recordId=${recordData.id}`);
  };

  return (
    <div className={styles.exerciseListPage}>
      <div className={styles.header}>
        <h2>운동 활동</h2>
        <Button text={"+ 운동 추가"} onClick={handleAddExerciseClick} />
      </div>

      <Calendar
        startDate={new Date("2020-01-01")}
        activeDays={ALL_DAYS}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        currentMonth={currentMonthDate}
        onMonthChange={setCurrentMonthDate}
        renderDayContents={renderDayContents}
      />

      <div className={styles.calendarLegend}>
        {Object.entries(BODY_PART_COLORS).map(([part, color]) => (
          <span key={part} className={styles.legendItem}>
            <span
              className={`${styles.workoutDot} ${styles.legendDot}`}
              style={{ backgroundColor: color }}
            />
            {part}
          </span>
        ))}
      </div>

      <TabNavigation
        tabs={TABS as unknown as string[]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      <div className={styles.exerciseListBox}>
        {isLoading || isProcessing ? (
          <Spinner
            text={isProcessing ? "처리 중..." : "데이터를 불러오는 중입니다..."}
          />
        ) : error ? (
          <ErrorMessage message="데이터 로딩 실패" />
        ) : (
          <ExerciseList
            activeTab={activeTab}
            selectedDate={selectedDate}
            monthlyData={historyData as any}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseListPage;

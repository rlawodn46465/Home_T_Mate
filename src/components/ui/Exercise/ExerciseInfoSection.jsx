import "./ExerciseInfoSection.css";
import InstructionList from "./InstructionList";
import MemoArea from "./MemoArea";

const ExerciseInfoSection = ({ initialMemo, onMemoSave }) => {
  const exerciseDetailInfo = [
    {
      title: "준비",
      items: [
        "양손에 덤벨을 들고, 어깨 너비로 발을 벌립니다.",
        "허리를 곧게 세우고, 시선은 정면을 바라봅니다.",
      ],
    },
    {
      title: "움직임",
      items: [
        "한 쪽 다리를 앞으로 내디딥니다.",
        "양쪽 무릎은 90도 정도 굽히고, 뒷다리 무릎이 바닥에 닿을 정도로 내려갑니다.",
        "다시 서서히 원래 위치로 돌아옵니다.",
        "동일한 동작을 반대쪽 다리로 다시 합니다.",
      ],
    },
    {
      title: "호흡법",
      items: ["내려갈 때 숨을 들이쉬고, 올라올 때 숨을 내쉽니다."],
    },
  ];

  return (
    <div className="exercise-info-section">
      {exerciseDetailInfo.map((section, index) => (
        <InstructionList
          key={index}
          title={section.title}
          items={section.items}
        />
      ))}
      <MemoArea initialMemo={initialMemo} onSave={onMemoSave} />
    </div>
  );
};

export default ExerciseInfoSection;

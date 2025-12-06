const RECORD_TYPE_MAPPING = {
  ROUTINE: "루틴",
  CHALLENGE: "챌린지",
  PERSONAL: "개별운동",
};

// 운동 타입 한글로 변경
const mapRecordTypeToKorean = (type) => {
  const upperCaseType = type ? type.toUpperCase() : "";
  return RECORD_TYPE_MAPPING[upperCaseType] || type;
};

module.exports = {
  mapRecordTypeToKorean,
};

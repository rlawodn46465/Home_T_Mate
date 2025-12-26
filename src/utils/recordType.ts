export type RecordType = (typeof RECORD_TYPE)[keyof typeof RECORD_TYPE];

export const RECORD_TYPE = {
  PERSONAL: "PERSONAL",
  ROUTINE: "ROUTINE",
  CHALLENGE: "CHALLENGE",
};

export const RECORD_TYPE_LABEL = {
  PERSONAL: "개별운동",
  ROUTINE: "루틴",
  CHALLENGE: "챌린지",
};

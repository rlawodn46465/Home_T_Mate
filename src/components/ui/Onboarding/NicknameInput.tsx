import { useState, memo } from "react";
import type { ChangeEvent } from "react";
import styles from "./NicknameInput.module.css";

interface NicknameInputProps {
  onCheckDuplicate?: (nickname: string) => void;
}

const NicknameInput = ({ onCheckDuplicate }: NicknameInputProps) => {
  const [nickname, setNickname] = useState<string>("");

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h4 className="section-title">닉네임을 입력해주세요.</h4>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임 입력"
        />
        <button
          className={styles.button}
          onClick={() => onCheckDuplicate?.(nickname)}
          disabled={!nickname.trim()}
        >
          확인
        </button>
      </div>
      <p className={styles.message}>닉네임이 존재합니다.</p>
    </div>
  );
};

export default memo(NicknameInput);

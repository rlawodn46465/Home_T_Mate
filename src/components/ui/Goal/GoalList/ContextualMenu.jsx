import styles from "./ContextualMenu.module.css";

const ContextualMenu = ({ onSelect }) => (
  <div className={styles.contextualMenu}>
    <button onClick={() => onSelect("시작")}>시작</button>
    <button onClick={() => onSelect("수정")}>수정</button>
    <button onClick={() => onSelect("삭제")}>삭제</button>
  </div>
);

export default ContextualMenu;

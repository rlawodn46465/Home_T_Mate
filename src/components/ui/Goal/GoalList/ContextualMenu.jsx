import './ContextualMenu.css'

const ContextualMenu = ({ onSelect }) => (
  <div className="contextual-menu">
    <button onClick={() => onSelect('시작')}>시작</button>
    <button onClick={() => onSelect('수정')}>수정</button>
    <button onClick={() => onSelect('삭제')}>삭제</button>
  </div>
);

export default ContextualMenu;
import './RoutineHeader.css'
import Button from '../../../components/common/Button';

const RoutineHeader = () => {
  return (
    <div className='routine-header'>
      <h2>루틴</h2>
      <Button text={"+ 루틴 추가"}/>
    </div>
  );
};

export default RoutineHeader;

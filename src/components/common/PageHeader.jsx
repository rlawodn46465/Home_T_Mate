import { useNavigate } from "react-router-dom";
import "./PageHeader.css";

const PageHeader = ({ title, onGoBack }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="page-header">
      <h2>{title}</h2>
      <p onClick={handleGoBack}>뒤로가기</p>
    </div>
  );
};

export default PageHeader;

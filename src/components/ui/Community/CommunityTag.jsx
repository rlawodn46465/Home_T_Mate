const CommunityTag = ({ text, isActive, onClick }) => {
  const tagClassName = `community-tag ${isActive ? "active" : ""}`;

  return (
    <div className={tagClassName} onClick={onClick}>
      {text}
    </div>
  );
};

export default CommunityTag;

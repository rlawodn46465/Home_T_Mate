interface CommunityTagProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const CommunityTag = ({ text, isActive, onClick }: CommunityTagProps) => {
  const tagClassName = `community-tag ${isActive ? "active" : ""}`;

  return (
    <div
      className={tagClassName}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {text}
    </div>
  );
};

export default CommunityTag;
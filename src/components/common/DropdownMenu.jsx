import './DropdownMenu.css';

const DropdownMenu = ({ position = "right", children }) => {
  const munuClassName = `dropdown-menu ${position}`;
  return (
    <div className={munuClassName}>
      <div className="menu-items">{children}</div>
    </div>
  );
};

export default DropdownMenu;

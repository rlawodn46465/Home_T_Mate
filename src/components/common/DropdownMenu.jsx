import styles from "./DropdownMenu.module.css";

const DropdownMenu = ({ position = "right", children }) => {
  const containerClassName = `${styles.container} ${styles[position]}`;

  return (
    <nav className={containerClassName}>
      <ul className={styles.menuList}>{children}</ul>
    </nav>
  );
};

export default DropdownMenu;

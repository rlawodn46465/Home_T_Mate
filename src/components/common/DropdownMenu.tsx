import styles from "./DropdownMenu.module.css";

interface DropdownMenuProps {
  position?: "left" | "right";
  children: React.ReactNode;
}

const DropdownMenu = ({ position = "right", children }: DropdownMenuProps) => {
  const containerClassName = `${styles.container} ${styles[position]}`;

  return (
    <nav className={containerClassName}>
      <ul className={styles.menuList}>{children}</ul>
    </nav>
  );
};

export default DropdownMenu;

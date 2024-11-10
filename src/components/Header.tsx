import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1>Point Collab</h1>
      </div>
      <div className={styles.bar1}></div>
      <div className={styles.bar2}></div>
    </header>
  );
}

import { Link } from 'react-router-dom';

import useClientStore from '../hooks/UseClientStore';
import styles from './Header.module.css';

export default function Header() {
  const name = useClientStore((store) => store.name);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1>Point Collab</h1>
        {name && (
          <div className={styles.controls}>
            <span>Hello, {name}!</span>
            <Link to="/teams">Teams</Link>
          </div>
        )}
      </div>
      <div className={styles.bar1}></div>
      <div className={styles.bar2}></div>
    </header>
  );
}

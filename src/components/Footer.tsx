import { Link } from 'react-router-dom';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>Made with ❤ by Greyson Richey and Anne Nichols</span>
      <Link to="/privacy">Privacy Policy</Link>
    </footer>
  );
}

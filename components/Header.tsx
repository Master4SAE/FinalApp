// components/Header.tsx
import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Logo" />
        <span>My Story App</span>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/about" style={{ marginLeft: '1rem' }}>About Us</Link>
      </nav>
    </header>
  );
};

export default Header;

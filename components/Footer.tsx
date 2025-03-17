// components/Footer.tsx
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} My Story App</p>
    </footer>
  );
};

export default Footer;

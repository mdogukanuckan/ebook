import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.content}>
        <p>&copy; {currentYear} eBookLib - Mehmet Doğukan Uçkan. Tüm hakları saklıdır.</p>
        <nav className={styles.footerLinks}>
          <a href="/privacy">Gizlilik Politikası</a>
          <a href="/terms">Kullanım Koşulları</a>
          <a href="/contact">İletişim</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
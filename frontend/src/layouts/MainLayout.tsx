import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton/WhatsAppFloatingButton';
import StickyMobileContactBar from '../components/StickyMobileContactBar/StickyMobileContactBar';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import styles from './MainLayout.module.scss';

/** Shared chrome for every route: navbar, page outlet, footer, contact CTAs. */
export default function MainLayout() {
  return (
    <div className={styles.shell}>
      <ScrollToTop />
      <a className="skipLink" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <StickyMobileContactBar />
    </div>
  );
}

import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/navigation';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { displayName } from '../../utils/company';
import { resolveMediaUrl } from '../../utils/media';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useCompanySettings();
  const location = useLocation();
  const menuId = useId();

  const name = displayName(settings);
  const logo = resolveMediaUrl(settings?.logo ?? null);

  // Close the drawer on navigation.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <div className={`container ${styles.mainInner}`}>
          <Link to="/" className={styles.brand} aria-label={`${name} — home`}>
            {logo ? (
              <img className={styles.logo} src={logo} alt={`${name} logo`} />
            ) : (
              <span className={styles.logoMark} aria-hidden="true">
                PB
              </span>
            )}
            <span className={styles.brandText}>
              <span className={styles.brandName}>{name}</span>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary">
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link className={`btn btnPrimary ${styles.navCta}`} to="/request-manpower">
              Request Manpower
            </Link>

            <button
              type="button"
              className={styles.hamburger}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={`${styles.bar} ${open ? styles.barTop : ''}`} />
              <span className={`${styles.bar} ${open ? styles.barMid : ''}`} />
              <span className={`${styles.bar} ${open ? styles.barBottom : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div
        id={menuId}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile primary">
          <ul className={styles.drawerList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="btn btnPrimary btnBlock" to="/request-manpower">
          Request Manpower
        </Link>
      </div>

      {open ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}

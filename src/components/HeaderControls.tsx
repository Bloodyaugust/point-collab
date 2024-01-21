import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { TeamContext } from '@contexts/TeamContext';

import styles from './HeaderControls.module.css';

export default function HeaderControls() {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const { clientName } = useContext(TeamContext);

  // TODO: Fetch teams this user is an admin of, present them as options to switch to

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleSignOutClick = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('teamID');
    location.reload();
  };

  useEffect(() => {
    const headerPortal = document.getElementById('headerPortal');

    if (headerPortal) {
      setPortalElement(headerPortal);
    }
  }, []);

  if (!portalElement) {
    return undefined;
  }

  return (
    <>
      {createPortal(
        <div className={styles.container}>
          <span className={styles.clientName}>Hello, {clientName}!</span>
          <span
            className={clsx('material-icons', styles.accountIcon)}
            onClick={() => {
              setShowMenu((curShowMenu) => !curShowMenu);
            }}
          >
            account_circle
          </span>
          {showMenu && (
            <div className={styles.menuContainer}>
              <div className={styles.menuArrow} />
              <span onClick={handleSignOutClick}>Sign Out</span>
            </div>
          )}
        </div>,
        portalElement,
      )}
    </>
  );
}

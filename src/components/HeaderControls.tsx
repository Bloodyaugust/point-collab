import clsx from 'clsx';
import { useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { TeamContext } from '@contexts/TeamContext';
import useTeams from '@hooks/UseTeams';

import styles from './HeaderControls.module.css';

export default function HeaderControls() {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const { clientName, setTeamID } = useContext(TeamContext);
  const { teams } = useTeams();

  // TODO: Fetch teams this user is an admin of, present them as options to switch to

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleSignOutClick = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('teamID');
    location.reload();
  };

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (
        portalElement &&
        showMenu &&
        event.target &&
        !portalElement.contains(event.target as unknown as Node)
      ) {
        setShowMenu(false);
      }
    },
    [portalElement, showMenu],
  );

  useEffect(() => {
    const headerPortal = document.getElementById('headerPortal');

    if (headerPortal) {
      setPortalElement(headerPortal);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleClick);
    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, [handleClick]);

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
              <hr />
              <span className={styles.sectionHeader}>Switch to team:</span>
              {teams.map((team) => (
                <span
                  key={team.id}
                  onClick={() => {
                    setTeamID(team.id);
                    setShowMenu(false);
                  }}
                >
                  {team.name}
                </span>
              ))}
            </div>
          )}
        </div>,
        portalElement,
      )}
    </>
  );
}

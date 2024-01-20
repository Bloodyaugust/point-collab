import { useCallback, useContext, useMemo } from 'react';

import { TeamContext } from '@contexts/TeamContext';

import styles from './TeamID.module.css';

export default function TeamID() {
  const { team } = useContext(TeamContext);

  const inviteLink = useMemo<string | null>(() => {
    if (!team) {
      return null;
    }

    return `https://point-collab-production.up.railway.app/?team=${team.id}`;
  }, [team]);

  const handleCopyInviteLinkClick = useCallback(() => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  }, [inviteLink]);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <div className={styles.teamIDContainer}>
        <span className={styles.teamIDHeader}>Team ID:</span>
        <span className={styles.teamIDValue}>{team.id}</span>
      </div>
      <div
        className={styles.teamLinkContainer}
        onClick={handleCopyInviteLinkClick}
      >
        <span className="material-icons">link</span>
        <span className={styles.teamIDLink}>Copy link to invite</span>
      </div>
    </div>
  );
}

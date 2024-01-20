import { useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';

import styles from './TeamID.module.css';

export default function TeamID() {
  const { team } = useContext(TeamContext);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <div className={styles.teamIDContainer}>
        <span className={styles.teamIDHeader}>Team ID:</span>
        <span className={styles.teamIDValue}>{team.id}</span>
      </div>
      <div className={styles.teamLinkContainer}>
        <span className="material-icons">link</span>
        <span className={styles.teamIDLink}>Copy link to invite</span>
      </div>
    </div>
  );
}

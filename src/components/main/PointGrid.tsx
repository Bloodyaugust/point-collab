import { useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';

import styles from './PointGrid.module.css';

const points = [0, 1, 2, 3, 5, 8, 13, 21];

export default function PointGrid() {
  const { team, clientUserState } = useContext(TeamContext);

  if (!team) {
    return undefined;
  }

  if (!clientUserState || clientUserState.clientID === team.adminClientID) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      {points.map((point) => (
        <button className={styles.pointButton} key={point}>
          {point}
        </button>
      ))}
      <button className={styles.pointButton}>☕️</button>
    </div>
  );
}

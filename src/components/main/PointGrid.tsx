import clsx from 'clsx';
import { useCallback, useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';
import pocketBase from '@lib/pocketbase';

import styles from './PointGrid.module.css';

const points = [0, 1, 2, 3, 5, 8, 13, 21];

export default function PointGrid() {
  const { team, clientUserState } = useContext(TeamContext);

  const handlePointClicked = useCallback(
    async (point: number) => {
      if (team && clientUserState) {
        await pocketBase.collection('user_states').update(clientUserState.id, {
          hasPointed: true,
          pointSelected: point,
        });
      }
    },
    [team, clientUserState],
  );

  if (!team) {
    return undefined;
  }

  if (!clientUserState || clientUserState.clientID === team.adminClientID) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pointingMessageContainer}>
        <span className={styles.pointingMessage}>Currently Pointing:</span>
        <span className={styles.pointingStory}>{team.storyID}</span>
      </div>
      <div className={styles.pointsContainer}>
        {points.map((point) => (
          <button
            className={clsx(
              styles.pointButton,
              point === clientUserState.pointSelected && styles.selected,
            )}
            key={point}
            onClick={() => {
              handlePointClicked(point);
            }}
          >
            {point}
          </button>
        ))}
        <button
          className={clsx(
            styles.pointButton,
            clientUserState.pointSelected === -1 && styles.selected,
          )}
          onClick={() => {
            handlePointClicked(-1);
          }}
        >
          <span className="material-icons">coffee</span>
        </button>
      </div>
    </div>
  );
}

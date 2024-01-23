import clsx from 'clsx';
import { useCallback, useContext } from 'react';

import CurrentlyPointing from '@components/main/CurrentlyPointing';
import { TeamContext } from '@contexts/TeamContext';
import pocketBase from '@lib/pocketbase';

import styles from './PointGrid.module.css';

const points = [0, 1, 2, 3, 5, 8, 13, 21];

type PointButtonProps = {
  handlePointClicked: (point: number) => Promise<void>;
  point: number;
  selected: boolean;
};

function PointButton({
  handlePointClicked,
  point,
  selected,
}: PointButtonProps) {
  return (
    <button
      className={clsx(
        styles.pointButton,
        selected && styles.pointButtonSelected,
      )}
      onClick={() => {
        handlePointClicked(point);
      }}
    >
      <div className={styles.pointButtonInner}>
        <span
          className={clsx(
            styles.pointButtonContent,
            point === -1 && 'material-icons',
          )}
        >
          {point === -1 ? 'coffee' : point}
        </span>
        <span
          className={clsx(
            styles.pointButtonSelectedContent,
            point === -1 && 'material-icons',
          )}
        >
          {point === -1 ? 'coffee' : point}
        </span>
      </div>
    </button>
  );
}

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
      <CurrentlyPointing />
      <div className={styles.pointsContainer}>
        {points.map((point) => (
          <PointButton
            handlePointClicked={handlePointClicked}
            point={point}
            selected={point === clientUserState.pointSelected}
            key={point}
          />
        ))}
        <PointButton
          handlePointClicked={handlePointClicked}
          point={-1}
          selected={clientUserState.pointSelected === -1}
        />
      </div>
    </div>
  );
}

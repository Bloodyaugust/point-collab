import clsx from 'clsx';

import { TeamState } from '../types/team';
import { UserState } from '../types/userState';
import styles from './UserStatus.module.css';
import HourglassSpinner from './doodads/HourglassSpinner';

type Props = {
  teamState: TeamState;
  user: UserState;
};

export default function UserStatus({ teamState, user }: Props) {
  return (
    <div className={styles.container}>
      {teamState === TeamState.POINTING ? (
        <>
          {user.hasPointed ? (
            <span className={clsx('material-symbols-outlined', styles.icon)}>
              check_circle
            </span>
          ) : (
            <HourglassSpinner />
          )}
        </>
      ) : (
        <>
          {user.pointSelected === -1 ? (
            <span className={clsx('material-symbols-outlined', styles.icon)}>
              coffee
            </span>
          ) : (
            <span className={styles.pointSelected}>{user.pointSelected}</span>
          )}
        </>
      )}
      <span>{user.name}</span>
    </div>
  );
}

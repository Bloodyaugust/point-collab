import clsx from 'clsx';
import { useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';
import type { Team } from '@projectTypes/team';
import { TeamState } from '@projectTypes/teamState';
import type { UserState } from '@projectTypes/userState';

import styles from './Users.module.css';

function evaluateShownPoint(team: Team, userState: UserState) {
  if (team.state === TeamState.POINTING) {
    if (!userState.hasPointed) {
      return (
        <span className={clsx(styles.userIconDark, 'material-icons')}>
          hourglass_bottom
        </span>
      );
    }

    return (
      <span className={clsx(styles.userIconLight, 'material-icons')}>
        check_circle
      </span>
    );
  }

  if (userState.pointSelected === -1) {
    return (
      <span className={clsx(styles.userIconLight, 'material-icons')}>
        coffee
      </span>
    );
  }

  return (
    <span className={styles.pointSelected}>{userState.pointSelected}</span>
  );
}

export default function Users() {
  const { userStates, team } = useContext(TeamContext);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      {userStates.map((userState) => (
        <div className={styles.userContainer} key={userState.id}>
          {evaluateShownPoint(team, userState)}
          <span className={styles.user}>{userState.name}</span>
        </div>
      ))}
    </div>
  );
}

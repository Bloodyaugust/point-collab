import { useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';
import type { Team } from '@projectTypes/team';
import { TeamState } from '@projectTypes/teamState';
import type { UserState } from '@projectTypes/userState';

import styles from './Users.module.css';

function evaluateShownPoint(team: Team, userState: UserState) {
  if (team.state === TeamState.POINTING) {
    if (!userState.hasPointed) {
      return '⏳';
    }

    return '✅';
  }

  return userState.pointSelected;
}

export default function Users() {
  const { userStates, team } = useContext(TeamContext);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <h3>Users</h3>
      {userStates.map((userState) => (
        <span key={userState.id}>
          {userState.name}: {evaluateShownPoint(team, userState)}
        </span>
      ))}
    </div>
  );
}

import clsx from 'clsx';
import { useContext } from 'react';

import HourglassSpinner from '@components/doodads/HourglassSpinner';
import { TeamContext } from '@contexts/TeamContext';
import type { Team } from '@projectTypes/team';
import { TeamState } from '@projectTypes/teamState';
import type { UserState } from '@projectTypes/userState';

import styles from './Users.module.css';

export enum UserDisplayLocations {
  ADMIN,
  SIDEBAR,
}

function evaluateShownPoint(
  team: Team,
  userState: UserState,
  location: UserDisplayLocations,
) {
  if (team.state === TeamState.POINTING) {
    if (!userState.hasPointed) {
      return (
        <HourglassSpinner
          color={location === UserDisplayLocations.ADMIN ? 'white' : '#fff5e5'}
        />
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

type Props = {
  location: UserDisplayLocations;
};

export default function Users({ location }: Props) {
  const { userStates, team } = useContext(TeamContext);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      {userStates.map((userState) => (
        <div className={styles.userContainer} key={userState.id}>
          {evaluateShownPoint(team, userState, location)}
          <span className={styles.user}>{userState.name}</span>
        </div>
      ))}
    </div>
  );
}

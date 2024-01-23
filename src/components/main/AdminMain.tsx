import clsx from 'clsx';
import { useContext, useMemo } from 'react';

import sharedStyles from '@components/SharedStyles.module.css';
import CurrentlyPointing from '@components/main/CurrentlyPointing';
import Users, { UserDisplayLocations } from '@components/sidebar/Users';
import { TeamContext } from '@contexts/TeamContext';
import { TeamState } from '@projectTypes/teamState';

import styles from './AdminMain.module.css';

const COFFEE = 'coffee';
const COFFEE_KEY = '-1';

type Props = {
  clientID: string;
};

export default function AdminMain({ clientID }: Props) {
  const { team, userStates, startPointing, showPoints } =
    useContext(TeamContext);

  const votingStatus: string | null = useMemo(() => {
    if (!team) {
      return null;
    }

    if (userStates.length === 0) {
      return 'Waiting for users to join...';
    }

    const stillVoting: number = userStates.filter(
      (userState) => !userState.hasPointed,
    ).length;

    if (stillVoting > 0) {
      return `${stillVoting} user${stillVoting > 1 ? 's' : ''} still voting`;
    }

    return 'All users ready!';
  }, [team, userStates]);
  const mostVoted: string | null = useMemo(() => {
    if (!team) {
      return null;
    }

    if (team.state === TeamState.POINTING) {
      return null;
    }

    const votes = userStates.reduce(
      (acc, userState) => {
        const pointSelected = `${userState.pointSelected}`;

        if (!acc[pointSelected]) {
          acc[pointSelected] = 1;
        } else {
          acc[pointSelected] = acc[pointSelected] + 1;
        }

        return acc;
      },
      {} as Record<string, number>,
    );

    const voteKeys = Object.keys(votes);

    if (voteKeys.length === 0) {
      return COFFEE;
    }

    let mostVotedKey = voteKeys[0];
    for (const voteKey of voteKeys) {
      if (votes[voteKey] > votes[mostVotedKey]) {
        mostVotedKey = voteKey;
      }
    }

    if (mostVotedKey === COFFEE_KEY) {
      return COFFEE;
    }

    let numMostVoted = 0;
    for (const voteKey of voteKeys) {
      if (votes[voteKey] === votes[mostVotedKey]) {
        numMostVoted++;
      }
    }

    if (numMostVoted > 1) {
      return 'TIE';
    }

    return mostVotedKey;
  }, [team, userStates]);

  if (!team) {
    return undefined;
  }

  if (clientID !== team.adminClientID) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <CurrentlyPointing />
      {team.state === TeamState.POINTING ? (
        <h2>Status: {votingStatus}</h2>
      ) : (
        <div className={styles.mostVotedContainer}>
          <span className={styles.mostVotedHeader}>Most people voted for:</span>
          <span
            className={clsx(
              styles.mostVoted,
              mostVoted === COFFEE && 'material-icons',
              mostVoted === COFFEE && styles.pointIcon,
            )}
          >
            {mostVoted}
          </span>
        </div>
      )}
      <div className={styles.userContainer}>
        <Users location={UserDisplayLocations.ADMIN} />
      </div>
      {team.state === TeamState.POINTING ? (
        <button className={sharedStyles.button} onClick={showPoints}>
          Show Points
        </button>
      ) : (
        <button className={sharedStyles.button} onClick={startPointing}>
          Point Next Story
        </button>
      )}
    </div>
  );
}

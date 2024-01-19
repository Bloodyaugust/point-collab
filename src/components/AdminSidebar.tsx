import { useCallback, useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';
import pocketBase from '@lib/pocketbase';
import { TeamState } from '@projectTypes/teamState';

import styles from './AdminSidebar.module.css';

type Props = {
  clientID: string;
};

function mapTeamStateToMessage(teamState: TeamState) {
  switch (teamState) {
    case TeamState.POINTING:
      return 'Click the "Show Points" button to reveal points!';

    default:
      return 'Pointing complete! Click "Start Pointing" to begin the next story.';
  }
}

export default function AdminSidebar({ clientID }: Props) {
  const { team, userStates } = useContext(TeamContext);

  const handleShowPoints = useCallback(async () => {
    if (team) {
      await pocketBase.collection('teams').update(team.id, {
        state: TeamState.REVEALED,
      });
    }
  }, [team]);

  const handleStartPointing = useCallback(async () => {
    if (team) {
      await pocketBase.collection('teams').update(team.id, {
        state: TeamState.POINTING,
      });
    }
  }, [team]);

  if (!team || team.adminClientID !== clientID) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <h2>{team.name}</h2>
      <span>Team ID: {team.id}</span>
      <span>Team state: {mapTeamStateToMessage(team.state)}</span>
      {team.state === TeamState.POINTING ? (
        <button onClick={handleShowPoints}>Show Points</button>
      ) : (
        <button onClick={handleStartPointing}>Start Pointing</button>
      )}
      <hr />
      <h3>Users</h3>
      <div className={styles.userStates}>
        {userStates.map((userState) => (
          <span key={userState.id}>
            {userState.name}: {userState.pointSelected} - (hasPointed:{' '}
            {userState.hasPointed ? 'true' : 'false'})
          </span>
        ))}
      </div>
    </div>
  );
}

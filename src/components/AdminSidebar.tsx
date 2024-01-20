import { useCallback, useContext } from 'react';

import Users from '@components/sidebar/Users';
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
  const { team, startPointing } = useContext(TeamContext);

  const handleShowPoints = useCallback(async () => {
    if (team) {
      await pocketBase.collection('teams').update(team.id, {
        state: TeamState.REVEALED,
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
      <span>{mapTeamStateToMessage(team.state)}</span>
      {team.state === TeamState.POINTING ? (
        <button onClick={handleShowPoints}>Show Points</button>
      ) : (
        <button onClick={startPointing}>Start Pointing</button>
      )}
      <hr />
      <Users />
    </div>
  );
}

import { useCallback, useEffect } from 'react';

import PointButton from '../components/PointButton';
import TeamInfo from '../components/TeamInfo';
import UserStatus from '../components/UserStatus';
import useGetOrCreateUserState from '../hooks/UseGetOrCreateUserState';
import useRealtimeTeam from '../hooks/UseRealtimeTeam';
import useRealtimeUserStates from '../hooks/UseRealtimeUserStates';
import pocketBase from '../lib/pocketbase';
import { Team } from '../types/team';
import styles from './Participant.module.css';

const points = [0, 1, 2, 3, 5, 8, 13, 21, -1];

type Props = {
  team: Team;
};

export default function Participant({ team: initialTeam }: Props) {
  const userStates = useRealtimeUserStates({ teamID: initialTeam.id });
  const team = useRealtimeTeam({ initialTeam });
  const user = useGetOrCreateUserState({ teamID: initialTeam.id, userStates });
  const handleSetPoint = useCallback(
    (point: number) => {
      if (user) {
        pocketBase
          .collection('user_states')
          .update(user.id, {
            hasPointed: true,
            pointSelected: point,
          })
          .catch((e) =>
            console.error('Error setting point for user: ', user, e),
          );
      }
    },
    [user],
  );

  useEffect(() => {
    if (user?.id) {
      pocketBase
        .collection('user_states')
        .update(user.id, {
          hasPointed: false,
          pointSelected: -1,
        })
        .catch((e) =>
          console.error(
            'Error setting inital user_state properties after joining team: ',
            e,
          ),
        );
    }
  }, [user?.id]);

  if (!user || !team) {
    return <span>Joining team...</span>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pointGridContainer}>
        <span className={styles.currentlyPointing}>
          Currently Pointing: {team.storyID}
        </span>
        <div className={styles.pointGrid}>
          {points.map((point) => (
            <PointButton
              key={point}
              handlePointClicked={handleSetPoint}
              point={point}
              selected={user.pointSelected === point}
            />
          ))}
        </div>
      </div>
      <div className={styles.teamStatusContainer}>
        <div className={styles.teamStatus}>
          <h2>{team.name}</h2>
          <hr />
          {userStates.map((userState) => (
            <UserStatus
              key={userState.id}
              teamState={team.state}
              user={userState}
            />
          ))}
        </div>
        <TeamInfo team={team} />
      </div>
    </div>
  );
}

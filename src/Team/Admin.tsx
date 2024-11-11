import { useCallback, useEffect, useState } from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import TeamInfo from '../components/TeamInfo';
import UserStatus from '../components/UserStatus';
import useRealtimeUserStates from '../hooks/UseRealtimeUserStates';
import queryClient from '../lib/QueryClient';
import pocketBase from '../lib/pocketbase';
import { Team, TeamState } from '../types/team';
import styles from './Admin.module.css';

type Props = {
  team: Team;
};

export default function Admin({ team }: Props) {
  const [newStoryID, setNewStoryId] = useState<string>('');
  const userStates = useRealtimeUserStates({ teamID: team.id });
  const toggleTeamState = useCallback(async () => {
    if (team.state === TeamState.REVEALED) {
      const updates = userStates.map((userState) =>
        pocketBase.collection('user_states').update(userState.id, {
          hasPointed: false,
          pointSelected: -1,
        }),
      );

      await Promise.all(updates);
    }

    await pocketBase.collection('teams').update(team.id, {
      state:
        team.state === TeamState.POINTING
          ? TeamState.REVEALED
          : TeamState.POINTING,
    });

    await queryClient.invalidateQueries({ queryKey: ['team', team.id] });
  }, [team.id, team.state, userStates]);
  const setTeamStoryID = useCallback(async () => {
    await pocketBase.collection('teams').update(team.id, {
      storyID: newStoryID,
    });

    await queryClient.invalidateQueries({ queryKey: ['team', team.id] });
  }, [team.id, newStoryID]);

  useEffect(() => {
    setNewStoryId(team.storyID);
  }, [team.storyID]);

  return (
    <div className={styles.container}>
      <div className={styles.statusBoard}>
        <span className={styles.currentlyPointing}>
          Currently Pointing: {team.storyID}
        </span>
        <div>
          <h2>Status</h2>
          <div className={styles.statusWindow}>
            {userStates.length === 0 && (
              <span className={styles.waitingUsers}>Waiting for users...</span>
            )}
            {userStates.map((userState) => (
              <UserStatus
                key={userState.id}
                teamState={team.state}
                user={userState}
              />
            ))}
          </div>
        </div>
        <Button
          text={
            team.state === TeamState.POINTING
              ? 'Show Points'
              : 'Point Next Story'
          }
          onClick={toggleTeamState}
        />
      </div>
      <div className={styles.controlBoard}>
        <div className={styles.controls}>
          <div className={styles.controlsHeader}>
            <h2>{team.name}</h2>
            <hr />
          </div>
          <div className={styles.controlsContent}>
            <label className={styles.label}>What are you pointing?</label>
            <Input
              placeholder="Paste link or ticket/story ID"
              onChange={setNewStoryId}
              value={newStoryID}
            />
            <Button text="Save" onClick={setTeamStoryID} />
          </div>
        </div>
        <TeamInfo team={team} />
      </div>
    </div>
  );
}

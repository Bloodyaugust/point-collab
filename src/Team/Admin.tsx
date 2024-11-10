import { useCallback, useEffect, useState } from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import UserStatus from '../components/UserStatus';
import queryClient from '../lib/QueryClient';
import pocketBase from '../lib/pocketbase';
import { Team, TeamState } from '../types/team';
import styles from './Admin.module.css';

type Props = {
  team: Team;
};

export default function Admin({ team }: Props) {
  const [newStoryID, setNewStoryId] = useState<string>('');
  const toggleTeamState = useCallback(async () => {
    await pocketBase.collection('teams').update(team.id, {
      state:
        team.state === TeamState.POINTING
          ? TeamState.REVEALED
          : TeamState.POINTING,
    });

    await queryClient.invalidateQueries({ queryKey: ['team', team.id] });
  }, [team.id, team.state]);
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
            <UserStatus
              teamState={team.state}
              user={{
                id: '123',
                clientID: '123',
                pointSelected: 0,
                hasPointed: false,
                name: 'Greyson Richey',
                team: '123',
                updated: '123',
              }}
            />
            <UserStatus
              teamState={team.state}
              user={{
                id: '123',
                clientID: '123',
                pointSelected: 3,
                hasPointed: true,
                name: 'Anne Nichols',
                team: '123',
                updated: '123',
              }}
            />
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
        <div className={styles.teamInfo}>
          <span className={styles.teamID}>Team ID: {team.id}</span>
          <span className={styles.teamLink}>Copy link to invite</span>
        </div>
      </div>
    </div>
  );
}

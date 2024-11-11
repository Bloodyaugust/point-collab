import { useCallback } from 'react';

import Button from '../components/Button';
import UserStatus from '../components/UserStatus';
import useGetOrCreateUserState from '../hooks/UseGetOrCreateUserState';
import useRealtimeUserStates from '../hooks/UseRealtimeUserStates';
import pocketBase from '../lib/pocketbase';
import { Team } from '../types/team';
import styles from './Participant.module.css';

type Props = {
  team: Team;
};

export default function Participant({ team }: Props) {
  const userStates = useRealtimeUserStates({ teamID: team.id });
  const user = useGetOrCreateUserState({ teamID: team.id, userStates });
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

  if (!user) {
    return <span>Joining team...</span>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pointGridContainer}>
        <span className={styles.currentlyPointing}>
          Currently Pointing: {team.storyID}
        </span>
        <div className={styles.pointGrid}>
          <Button
            text="0"
            onClick={() => {
              handleSetPoint(0);
            }}
            active={user.pointSelected === 0}
          />
          <Button
            text="1"
            onClick={() => {
              handleSetPoint(1);
            }}
            active={user.pointSelected === 1}
          />
          <Button
            text="2"
            onClick={() => {
              handleSetPoint(2);
            }}
            active={user.pointSelected === 2}
          />
          <Button
            text="3"
            onClick={() => {
              handleSetPoint(3);
            }}
            active={user.pointSelected === 3}
          />
          <Button
            text="5"
            onClick={() => {
              handleSetPoint(5);
            }}
            active={user.pointSelected === 5}
          />
          <Button
            text="8"
            onClick={() => {
              handleSetPoint(8);
            }}
            active={user.pointSelected === 8}
          />
          <Button
            text="13"
            onClick={() => {
              handleSetPoint(13);
            }}
            active={user.pointSelected === 13}
          />
          <Button
            text="21"
            onClick={() => {
              handleSetPoint(21);
            }}
            active={user.pointSelected === 21}
          />
          <Button
            text="☕"
            onClick={() => {
              handleSetPoint(-1);
            }}
            active={user.pointSelected === -1}
          />
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
      </div>
    </div>
  );
}

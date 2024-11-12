import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import useClientStore from '../hooks/UseClientStore';
import pocketBase from '../lib/pocketbase';
import styles from './Welcome.module.css';

export default function Welcome() {
  const navigate = useNavigate();
  const name = useClientStore((state) => state.name);
  const setName = useClientStore((state) => state.setName);
  const clientID = useClientStore((state) => state.clientID);
  const currentTeamID = useClientStore((state) => state.currentTeamID);
  const [newName, setNewName] = useState<string>(name || '');
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [teamAction, setTeamAction] = useState<null | 'join' | 'start'>(null);
  const [teamID, setTeamID] = useState<string>('');

  const handleTeamAction = useCallback(async () => {
    setName(newName);

    if (teamAction === 'join') {
      navigate(`/team/${teamID}`);
      return;
    }

    let newTeam;
    try {
      newTeam = await pocketBase.collection('teams').create({
        adminClientID: clientID,
        name: newTeamName,
      });

      navigate(`/team/${newTeam.id}`);
    } catch {
      console.error('There was an error creating the team.');
    }
  }, [clientID, navigate, newTeamName, teamAction, teamID, newName, setName]);

  useEffect(() => {
    if (name) {
      setNewName(name);
    }
  }, [name]);

  useEffect(() => {
    if (currentTeamID) {
      setTeamID(currentTeamID);
      setTeamAction('join');
    }
  }, [currentTeamID]);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.block}>
          <h2>Welcome!</h2>
          <hr />
        </div>
        <div className={styles.block}>
          <label className={styles.label} htmlFor="newName">
            What is your name?
          </label>
          <Input
            id="newName"
            placeholder="Enter name you'd like displayed to the room"
            onChange={(v) => setNewName(v)}
            value={newName}
          />
        </div>
        {newName && (
          <div className={styles.block}>
            <label className={styles.label}>What would you like to do?</label>
            <div className={styles.buttonContainer}>
              <Button
                active={teamAction === 'join'}
                text="Join an existing team"
                onClick={() => setTeamAction('join')}
              />
              <Button
                active={teamAction === 'start'}
                text="Start a new team"
                onClick={() => setTeamAction('start')}
              />
            </div>
          </div>
        )}
        {teamAction === 'join' && newName && (
          <div className={styles.block}>
            <label className={styles.label} htmlFor="newTeamID">
              Enter your Team ID
            </label>
            <Input
              id="newTeamID"
              placeholder="Team ID"
              onChange={(v) => setTeamID(v)}
              value={teamID}
            />
          </div>
        )}
        {teamAction === 'start' && newName && (
          <div className={styles.block}>
            <label className={styles.label} htmlFor="newTeamName">
              Enter your Team Name
            </label>
            <Input
              id="newTeamName"
              placeholder="Team Name"
              onChange={(v) => setNewTeamName(v)}
              value={newTeamName}
            />
          </div>
        )}
        {(teamID || newTeamName) && (
          <Button
            text={teamAction === 'join' ? 'Join Team!' : 'Start Team!'}
            onClick={handleTeamAction}
          />
        )}
      </div>
    </div>
  );
}

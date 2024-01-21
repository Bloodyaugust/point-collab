import clsx from 'clsx';
import { useEffect, useState } from 'react';

import sharedStyles from '@components/SharedStyles.module.css';
import pocketBase from '@lib/pocketbase';
import type { Team } from '@projectTypes/team';
import { TeamState } from '@projectTypes/teamState';

import styles from './Welcome.module.css';

enum TeamMode {
  NONE,
  JOIN,
  START,
}

type Props = {
  clientID: string;
  onOnboarded: (clientName: string) => void;
};

export default function Welcome({ clientID, onOnboarded }: Props) {
  const [clientName, setClientName] = useState<string | null>(null);
  const [teamID, setTeamID] = useState<string | null>(null);
  const [teamMode, setTeamMode] = useState<TeamMode>(TeamMode.NONE);
  const [teamName, setTeamName] = useState('');
  const [joinTeamID, setJoinTeamID] = useState('');
  const [joinTeamError, setJoinTeamError] = useState<string | null>(null);
  const [loadParams, setLoadParams] = useState<Record<string, string>>({});

  const storeTeamID = () => {
    if (teamID) {
      localStorage.setItem('teamID', teamID);
    }
  };

  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const handleJoinTeamIDChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setJoinTeamID(event.target.value);
  };

  const handleCreateTeam = async () => {
    const newTeam = (await pocketBase.collection('teams').create({
      name: teamName,
      state: TeamState.POINTING,
      adminClientID: clientID,
      points: [],
      history: [],
    })) as Team;

    setTeamID(newTeam.id);
  };

  const handleJoinTeam = async (deepLinkID: string | undefined) => {
    const joiningTeam: string = deepLinkID || joinTeamID;

    try {
      const team = (await pocketBase
        .collection('teams')
        .getOne(joiningTeam)) as Team;

      console.log('joining team: ', team.id);
      setTeamID(team.id);
      setJoinTeamError(null);
    } catch {
      setJoinTeamError('Team does not exist');
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    setLoadParams(Object.fromEntries(urlSearchParams.entries()));
  }, []);

  useEffect(() => {
    const { team } = loadParams;

    if (team) {
      handleJoinTeam(team);
    }
  }, [loadParams]);

  useEffect(() => {
    if (clientName && teamID) {
      storeTeamID();
      onOnboarded(clientName);
    }
  }, [clientName, teamID]);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h2>Welcome!</h2>
        <hr />
      </div>
      <div className={styles.nameContainer}>
        <label className={sharedStyles.label}>What is your name?</label>
        <input
          className={sharedStyles.inputText}
          type="text"
          onChange={(e) => {
            setClientName(e.currentTarget.value);
          }}
          placeholder="Enter name you'd like displayed to the room"
        />
      </div>
      <div className={styles.buttonsContainer}>
        <label className={sharedStyles.label}>What would you like to do?</label>
        <div className={styles.buttonsInnerContainer}>
          <button
            className={clsx(
              sharedStyles.button,
              teamMode === TeamMode.JOIN && styles.active,
            )}
            disabled={!clientName}
            onClick={() => {
              setTeamMode(
                teamMode === TeamMode.JOIN ? TeamMode.NONE : TeamMode.JOIN,
              );
            }}
          >
            Join an existing team
          </button>
          <button
            className={clsx(
              sharedStyles.button,
              teamMode === TeamMode.START && styles.active,
            )}
            disabled={!clientName}
            onClick={() => {
              setTeamMode(
                teamMode === TeamMode.START ? TeamMode.NONE : TeamMode.START,
              );
            }}
          >
            Start a new team
          </button>
        </div>
      </div>
      {teamMode === TeamMode.JOIN && (
        <div className={styles.teamIDContainer}>
          <label className={sharedStyles.label}>Enter your Team ID</label>
          <input
            className={sharedStyles.inputText}
            type="text"
            onChange={handleJoinTeamIDChange}
            placeholder="Team ID"
          />
          {joinTeamError && (
            <span className={sharedStyles.error}>{joinTeamError}</span>
          )}
          <button
            className={sharedStyles.button}
            onClick={() => {
              handleJoinTeam(undefined);
            }}
          >
            Join Team!
          </button>
        </div>
      )}
      {teamMode === TeamMode.START && (
        <div className={styles.teamNameContainer}>
          <label className={sharedStyles.label}>
            What is the name of your team?
          </label>
          <input
            className={sharedStyles.inputText}
            type="text"
            onChange={handleTeamNameChange}
            placeholder="Team Awesome"
          />
          <button className={sharedStyles.button} onClick={handleCreateTeam}>
            Start Team!
          </button>
        </div>
      )}
    </div>
  );
}

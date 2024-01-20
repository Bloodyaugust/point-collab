import { useContext, useEffect, useState } from 'react';

import { TeamContext } from '../contexts/TeamContext';
import pocketBase from '../lib/pocketbase';
import type { Team } from '../types/team';
import { TeamState } from '../types/teamState';
import styles from './TeamChooser.module.css';

type Props = {
  clientID: string;
};

export default function TeamChooser({ clientID }: Props) {
  const { teamID, setTeamID } = useContext(TeamContext);

  const [teamName, setTeamName] = useState('');
  const [joinTeamID, setJoinTeamID] = useState('');
  const [joinTeamError, setJoinTeamError] = useState<string | null>(null);
  const [loadParams, setLoadParams] = useState<Record<string, string>>({});

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

      setTeamID(team.id);
      setJoinTeamError(null);
    } catch {
      setJoinTeamError('Team does not exist');
    }
  };

  useEffect(() => {
    if (clientID) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      setLoadParams(Object.fromEntries(urlSearchParams.entries()));
    }
  }, [clientID]);

  useEffect(() => {
    if (clientID) {
      const { team } = loadParams;

      if (team) {
        handleJoinTeam(team);
      }
    }
  }, [loadParams]);

  if (teamID) {
    return undefined;
  }

  return (
    <div>
      <span>Create a new team, or join an existing one</span>
      <hr />
      <label>Team Name:</label>
      <input onChange={handleTeamNameChange} />
      <button onClick={handleCreateTeam}>Create Team</button>
      <hr />
      <label>Team ID:</label>
      <input onChange={handleJoinTeamIDChange} />
      {joinTeamError && <span className={styles.error}>{joinTeamError}</span>}
      <button
        onClick={() => {
          handleJoinTeam(undefined);
        }}
      >
        Join Team
      </button>
    </div>
  );
}

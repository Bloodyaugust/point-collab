import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import useClientStore from '../hooks/UseClientStore';
import pocketBase from '../lib/pocketbase';
import { Team } from '../types/team';
import styles from './Teams.module.css';

export default function Teams() {
  const navigate = useNavigate();
  const clientID = useClientStore((store) => store.clientID);
  const storedTeams = useClientStore((store) => store.storedTeams);
  const [adminTeams, setAdminTeams] = useState<Team[]>([]);
  const [joiningTeamID, setJoiningTeamID] = useState<string>('');

  useEffect(() => {
    if (clientID) {
      pocketBase
        .collection('teams')
        .getList(0, 20, {
          filter: `adminClientID="${clientID}"`,
        })
        .then((resp) => setAdminTeams(resp.items))
        .catch((e) => console.error('Error fetching admin teams: ', e));
    }
  }, [clientID]);

  return (
    <div className={styles.container}>
      <div className={styles.joinTeam}>
        <div className={styles.heading}>
          <h2>Join a new Team</h2>
          <hr />
        </div>
        <div className={styles.joinTeamControls}>
          <div className={styles.joinTeamID}>
            <label>Team ID</label>
            <Input
              placeholder="Team ID"
              onChange={setJoiningTeamID}
              value={joiningTeamID}
            />
          </div>
          <Button
            text="Join Team"
            onClick={() => {
              if (joiningTeamID) {
                navigate(`/team/${joiningTeamID}`);
              }
            }}
          />
        </div>
      </div>
      <div className={styles.previousTeams}>
        <div className={styles.heading}>
          <h2>Previously Joined Teams</h2>
          <hr />
        </div>
        {storedTeams.map((storedTeam) => (
          <div key={storedTeam.id} className={styles.storedTeam}>
            <Link to={`/team/${storedTeam.id}`}>{storedTeam.name}</Link>
            <span>-</span>
            <span>
              {adminTeams.find((team) => team.id === storedTeam.id)
                ? 'Admin'
                : 'Participant'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

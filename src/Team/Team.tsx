import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import useClientStore from '../hooks/UseClientStore';
import pocketBase from '../lib/pocketbase';
import Admin from './Admin';
import Participant from './Participant';

export default function Team() {
  const { teamID = '' } = useParams();
  const addTeam = useClientStore((store) => store.addTeam);
  const clientID = useClientStore((store) => store.clientID);
  const setCurrentTeamID = useClientStore((store) => store.setCurrentTeamID);
  const {
    isPending,
    error,
    data: team,
  } = useQuery({
    queryKey: ['team', teamID],
    queryFn: async () => {
      return await pocketBase.collection('teams').getOne(teamID);
    },
  });

  useEffect(() => {
    if (teamID) {
      setCurrentTeamID(teamID);
    }
  }, [teamID, setCurrentTeamID]);

  useEffect(() => {
    if (team) {
      addTeam({
        id: team.id,
        name: team.name,
      });
    }
  }, [team, addTeam]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Team not found!</span>;
  }

  if (!team) {
    return <span>Something went horribly wrong!</span>;
  }

  if (team.adminClientID === clientID) {
    return <Admin team={team} />;
  }

  return <Participant team={team} />;
}

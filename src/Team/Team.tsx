import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import useClientStore from '../hooks/UseClientStore';
import pocketBase from '../lib/pocketbase';
import Admin from './Admin';

export default function Team() {
  const { teamID = '' } = useParams();
  const clientID = useClientStore((store) => store.clientID);
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

  return <span>Team ID: {team.id}</span>;
}

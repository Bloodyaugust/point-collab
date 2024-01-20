import { useContext } from 'react';

import Users from '@components/sidebar/Users';

import { TeamContext } from '../contexts/TeamContext';

type Props = {
  clientID: string;
};

export default function UserSidebar({ clientID }: Props) {
  const { team } = useContext(TeamContext);

  if (!team || team.adminClientID === clientID) {
    return undefined;
  }

  return (
    <div>
      <h2>{team.name}</h2>
      <hr />
      <Users />
    </div>
  );
}

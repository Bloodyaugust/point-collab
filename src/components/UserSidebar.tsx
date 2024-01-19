import { useContext } from 'react';

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
      <span>
        Team: {team.name}({team.id})
      </span>
      <span>Team State: {team.state}</span>
    </div>
  );
}

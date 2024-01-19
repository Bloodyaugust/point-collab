import { useContext } from 'react';

import { TeamContext } from '../contexts/TeamContext';

export default function UserSidebar() {
  const { team } = useContext(TeamContext);

  if (!team) {
    return <span>Waiting for a team to be joined...</span>;
  }

  return (
    <span>
      Team: {team.name}({team.id})
    </span>
  );
}

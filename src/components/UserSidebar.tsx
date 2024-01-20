import { useCallback, useContext } from 'react';

import Users from '@components/sidebar/Users';
import pocketBase from '@lib/pocketbase';

import { TeamContext } from '../contexts/TeamContext';

type Props = {
  clientID: string;
};

export default function UserSidebar({ clientID }: Props) {
  const { team, clientUserState } = useContext(TeamContext);

  const handlePointClicked = useCallback(async () => {
    if (team && clientUserState) {
      await pocketBase.collection('user_states').update(clientUserState.id, {
        hasPointed: true,
      });
    }
  }, [team, clientUserState]);

  if (!team || team.adminClientID === clientID) {
    return undefined;
  }

  return (
    <div>
      <span>
        Team: {team.name}({team.id})
      </span>
      <span>Team State: {team.state}</span>
      <hr />
      <button onClick={handlePointClicked}>Point!</button>
      <Users />
    </div>
  );
}

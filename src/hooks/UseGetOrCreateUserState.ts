import { ClientResponseError } from 'pocketbase';
import { useEffect, useState } from 'react';

import pocketBase from '../lib/pocketbase';
import { UserState } from '../types/userState';
import useClientStore from './UseClientStore';

type Props = {
  teamID: string;
  userStates: UserState[];
};

export default function useGetOrCreateUserState({ teamID, userStates }: Props) {
  const clientID = useClientStore((store) => store.clientID);
  const name = useClientStore((store) => store.name);
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    async function getOrCreateUserState() {
      try {
        const existingUser = await pocketBase
          .collection('user_states')
          .getFirstListItem(`clientID="${clientID}" && team="${teamID}"`);

        setUser(existingUser);
      } catch (e) {
        if (e instanceof ClientResponseError && e.isAbort) {
          return;
        }

        const newUser = await pocketBase.collection('user_states').create({
          clientID,
          team: teamID,
          name: name,
        });

        setUser(newUser);
      }
    }

    if (clientID && name && teamID) {
      if (!user) {
        void getOrCreateUserState();
      } else if (userStates.length) {
        const updatedUser = userStates.find(
          (userState) => userState.id === user.id,
        );

        if (updatedUser) {
          setUser(updatedUser);
        }
      }
    }
  }, [clientID, name, teamID, user, userStates]);

  return user;
}

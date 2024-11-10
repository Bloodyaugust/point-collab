import { RecordSubscription } from 'pocketbase';
import { useCallback, useEffect, useState } from 'react';

import pocketBase from '../lib/pocketbase';
import { UserState } from '../types/userState';

type Props = {
  teamID: string;
};

const useRealtimeUserStates = ({ teamID }: Props) => {
  const [userStates, setUserStates] = useState<UserState[]>([]);
  const handleUserStateUpdate = useCallback(
    (updatedUserState: RecordSubscription<UserState>) => {
      if (
        updatedUserState.action === 'create' ||
        updatedUserState.action === 'update'
      ) {
        if (updatedUserState.record.team === teamID) {
          setUserStates((s) => {
            const filteredUserStates = s.filter(
              (userState) =>
                userState.clientID !== updatedUserState.record.clientID,
            );

            return [...filteredUserStates, updatedUserState.record];
          });
        }
      }
    },
    [teamID],
  );

  useEffect(() => {
    pocketBase
      .collection('user_states')
      .unsubscribe()
      .catch((e) =>
        console.error('Could not unsubscribe from user_states: ', e),
      );
    pocketBase
      .collection('user_states')
      .subscribe('*', handleUserStateUpdate)
      .catch((e) =>
        console.error(
          'Could not establish a realtime subscription to user_states: ',
          e,
        ),
      );

    return () => {
      pocketBase
        .collection('user_states')
        .unsubscribe()
        .catch((e) =>
          console.error('Could not unsubscribe from user_states: ', e),
        );
    };
  }, [handleUserStateUpdate]);

  return userStates;
};

export default useRealtimeUserStates;

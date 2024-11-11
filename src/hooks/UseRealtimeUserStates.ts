import { ClientResponseError, RecordSubscription } from 'pocketbase';
import { useCallback, useEffect, useState } from 'react';

import pocketBase from '../lib/pocketbase';
import { UserState } from '../types/userState';

const USER_INACTIVE_INTERVAL = 1000 * 60 * 30; // 30 minutes

type Props = {
  teamID: string;
};

const useRealtimeUserStates = ({ teamID }: Props) => {
  const [initialized, setInitialized] = useState<boolean>(false);
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

      if (
        updatedUserState.action === 'delete' &&
        updatedUserState.record.team === teamID
      ) {
        setUserStates((s) => {
          return s.filter(
            (userState) => userState.id !== updatedUserState.record.id,
          );
        });
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

  useEffect(() => {
    if (!initialized && teamID) {
      const userInactiveDate = new Date(
        new Date().getTime() - USER_INACTIVE_INTERVAL,
      )
        .toISOString()
        .replace('T', ' ');

      pocketBase
        .collection('user_states')
        .getList(0, 20, {
          filter: `team="${teamID}" && updated>="${userInactiveDate}"`,
        })
        .then((initialUserStates) => {
          setUserStates(initialUserStates.items);
          setInitialized(true);
        })
        .catch((e) => {
          if (e instanceof ClientResponseError && e.isAbort) {
            return;
          }

          console.error('Error getting initial user_states: ', e);
        });
    }
  }, [initialized, teamID]);

  return userStates;
};

export default useRealtimeUserStates;

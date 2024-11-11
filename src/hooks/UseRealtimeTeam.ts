import { ClientResponseError, RecordSubscription } from 'pocketbase';
import { useCallback, useEffect, useState } from 'react';

import pocketBase from '../lib/pocketbase';
import { Team } from '../types/team';

type Props = {
  teamID: string;
};

const useRealtimeTeam = ({ teamID }: Props) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [team, setTeam] = useState<Team | null>(null);
  const handleTeamUpdate = useCallback(
    (updatedTeam: RecordSubscription<Team>) => {
      if (updatedTeam.action === 'update') {
        setTeam({ ...updatedTeam.record });
      }
    },
    [],
  );

  useEffect(() => {
    pocketBase
      .collection('teams')
      .unsubscribe()
      .catch((e) => console.error('Could not unsubscribe from teams: ', e));

    if (teamID) {
      pocketBase
        .collection('teams')
        .subscribe(teamID, handleTeamUpdate)
        .catch((e) =>
          console.error(
            'Could not establish a realtime subscription to teams: ',
            e,
          ),
        );
    }

    return () => {
      pocketBase
        .collection('teams')
        .unsubscribe()
        .catch((e) => console.error('Could not unsubscribe from teams: ', e));
    };
  }, [teamID, handleTeamUpdate]);

  useEffect(() => {
    if (!initialized && teamID) {
      pocketBase
        .collection('teams')
        .getOne(teamID)
        .then((initialTeam) => {
          setTeam(initialTeam);
          setInitialized(true);
        })
        .catch((e) => {
          if (e instanceof ClientResponseError && e.isAbort) {
            return;
          }

          console.error('Error getting initial team: ', e);
        });
    }
  }, [initialized, teamID]);

  return team;
};

export default useRealtimeTeam;

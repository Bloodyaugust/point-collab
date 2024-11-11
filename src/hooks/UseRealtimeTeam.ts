import { RecordSubscription } from 'pocketbase';
import { useCallback, useEffect, useState } from 'react';

import pocketBase from '../lib/pocketbase';
import { Team } from '../types/team';

type Props = {
  initialTeam: Team;
};

const useRealtimeTeam = ({ initialTeam }: Props) => {
  const [team, setTeam] = useState<Team>(initialTeam);
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

    pocketBase
      .collection('teams')
      .subscribe(initialTeam.id, handleTeamUpdate)
      .catch((e) =>
        console.error(
          'Could not establish a realtime subscription to teams: ',
          e,
        ),
      );

    return () => {
      pocketBase
        .collection('teams')
        .unsubscribe()
        .catch((e) => console.error('Could not unsubscribe from teams: ', e));
    };
  }, [initialTeam.id, handleTeamUpdate]);

  return team;
};

export default useRealtimeTeam;

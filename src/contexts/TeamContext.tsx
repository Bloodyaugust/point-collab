import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import useTeamID from '@hooks/UseTeamID';
import pocketBase from '@lib/pocketbase';
import { type Message, MessageTypes } from '@projectTypes/message';
import { type Team } from '@projectTypes/team';

type ContextType = {
  setTeamID: (teamID: string) => void;
  teamID: string | null;
  team: Team | null;
};

const TeamContext = createContext<ContextType>({
  setTeamID: () => {},
  teamID: null,
  team: null,
});

type Props = {
  children: ReactNode;
  clientID: string;
  clientName: string;
};

export default function TeamContextComponent({
  children,
  clientID,
  clientName,
}: Props) {
  const { teamID, setTeamID } = useTeamID();
  const [team, setTeam] = useState<Team | null>(null);

  const fetchTeam = useCallback(async () => {
    if (teamID) {
      try {
        const newTeam = (await pocketBase
          .collection('teams')
          .getOne(teamID)) as Team;

        const joinMessage: Message = {
          team: newTeam.id,
          type: MessageTypes.JOIN,
          message: { name: clientName },
          clientID,
        };
        await pocketBase.collection('messages').create(joinMessage);

        setTeam(newTeam);
      } catch {
        setTeamID(null);
        setTeam(null);
      }
    } else {
      setTeam(null);
    }
  }, [teamID]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return (
    <TeamContext.Provider value={{ team, teamID, setTeamID }}>
      {children}
    </TeamContext.Provider>
  );
}

export { TeamContext };

import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import useTeamID from '@hooks/UseTeamID';
import pocketBase from '@lib/pocketbase';
import { type Team } from '@projectTypes/team';
import { TeamState } from '@projectTypes/teamState';
import type { UserState } from '@projectTypes/userState';

type ContextType = {
  clientUserState: UserState | null;
  setTeamID: (teamID: string) => void;
  startPointing: () => void;
  teamID: string | null;
  team: Team | null;
  userStates: UserState[];
};

const TeamContext = createContext<ContextType>({
  clientUserState: null,
  setTeamID: () => {},
  startPointing: () => {},
  teamID: null,
  team: null,
  userStates: [],
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
  const [clientUserState, setClientUserState] = useState<UserState | null>(
    null,
  );
  const [userStates, setUserStates] = useState<UserState[]>([]);

  const sortedUserStates = useMemo(() => {
    return userStates.sort((a, b) => a.name.localeCompare(b.name));
  }, [userStates]);

  const fetchTeam = useCallback(async () => {
    if (teamID) {
      try {
        const newTeam = (await pocketBase
          .collection('teams')
          .getOne(teamID)) as Team;

        pocketBase.collection('teams').subscribe(newTeam.id, (data) => {
          setTeam(data.record as unknown as Team);
        });

        let hydratedUserStates: UserState[] = [];
        if (newTeam.adminClientID !== clientID) {
          let newUserState: UserState | null = null;

          try {
            newUserState = (await pocketBase
              .collection('user_states')
              .getFirstListItem(`clientID="${clientID}"`)) as UserState;

            newUserState = (await pocketBase
              .collection('user_states')
              .update(newUserState.id, {
                hasPointed: false,
                pointSelected: 0,
                name: clientName,
              })) as UserState;
          } catch {
            newUserState = (await pocketBase.collection('user_states').create({
              clientID,
              name: clientName,
              team: teamID,
            })) as UserState;
          }

          hydratedUserStates.push(newUserState);
          setClientUserState(newUserState);
        }

        const fetchedUserStates = (await pocketBase
          .collection('user_states')
          .getFullList({
            filter: `team = '${teamID}'`,
          })) as UserState[];
        hydratedUserStates = [
          ...hydratedUserStates,
          ...fetchedUserStates.filter((userState) =>
            hydratedUserStates.length
              ? userState.clientID !== hydratedUserStates[0].clientID
              : true,
          ),
        ];

        setUserStates(hydratedUserStates);

        pocketBase.collection('user_states').subscribe(
          '*',
          (data) => {
            const dataUserState: UserState =
              data.record as unknown as UserState;

            setUserStates((currentUserStates) => [
              ...currentUserStates.filter(
                (state) => state.clientID !== dataUserState.clientID,
              ),
              dataUserState,
            ]);
          },
          {
            filter: `team = '${teamID}'`,
          },
        );

        setTeam(newTeam);
      } catch (error) {
        console.error(error);
        pocketBase.collection('teams').unsubscribe();
        pocketBase.collection('user_states').unsubscribe();
        setClientUserState(null);
        setUserStates([]);
        setTeamID(null);
        setTeam(null);
      }
    } else {
      pocketBase.collection('teams').unsubscribe();
      pocketBase.collection('user_states').unsubscribe();
      setClientUserState(null);
      setUserStates([]);
      setTeam(null);
    }
  }, [teamID]);

  const startPointing = useCallback(async () => {
    if (team) {
      await pocketBase.collection('teams').update(team.id, {
        state: TeamState.POINTING,
      });

      await Promise.all(
        userStates.map(async (userState) => {
          await pocketBase.collection('user_states').update(userState.id, {
            hasPointed: false,
          });
        }),
      );
    }
  }, [team, userStates]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return (
    <TeamContext.Provider
      value={{
        clientUserState,
        team,
        teamID,
        setTeamID,
        startPointing,
        userStates: sortedUserStates,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export { TeamContext };

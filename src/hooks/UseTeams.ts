import { useCallback, useEffect, useMemo, useState } from 'react';

type StoredTeam = {
  id: string;
  name: string;
};

export default function useTeams() {
  const [teamString, setTeamString] = useState<string | null>();

  const teams: StoredTeam[] = useMemo(() => {
    if (!teamString) {
      return [];
    }

    return JSON.parse(teamString);
  }, [teamString]);

  const addTeam = useCallback(
    (addingTeamID: string, addingTeamName: string) => {
      const newTeams = [
        { id: addingTeamID, name: addingTeamName },
        ...teams.filter((team) => team.id !== addingTeamID),
      ];

      setTeamString(JSON.stringify(newTeams));
    },
    [teams],
  );

  useEffect(() => {
    const loadedTeamString: string | null = localStorage.getItem('teams');

    if (loadedTeamString) {
      setTeamString(loadedTeamString);
    }
  }, []);

  useEffect(() => {
    if (teamString) {
      localStorage.setItem('teams', teamString);
    }
  }, [teamString]);

  return { addTeam, teams };
}

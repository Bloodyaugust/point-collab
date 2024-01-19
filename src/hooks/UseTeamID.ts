import { useEffect, useState } from 'react';

export default function useTeamID() {
  const [teamID, internalSetTeamID] = useState<string | null>(null);

  const setTeamID = (id: string | null) => {
    if (id) {
      localStorage.setItem('teamID', id);
    } else {
      localStorage.removeItem('teamID');
    }
    internalSetTeamID(id);
  };

  useEffect(() => {
    const loadedTeamID: string | null = localStorage.getItem('teamID');

    if (loadedTeamID) {
      internalSetTeamID(loadedTeamID);
    }
  }, []);

  return { teamID, setTeamID };
}

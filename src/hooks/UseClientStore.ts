import { create } from 'zustand';

import { StoredTeam } from '../types/team';
import { UserState } from '../types/userState';

interface ClientState {
  clientID: string | null;
  currentTeamID: string | null;
  initialize: () => void;
  name: string | null;
  persist: () => void;
  storedTeams: StoredTeam[];
  userStates: UserState[];
}

const useClientStore = create<ClientState>((set, get) => ({
  clientID: null,
  currentTeamID: null,
  initialize: () => {
    const loadedClientID: string | null = localStorage.getItem('clientID');
    const loadedCurrentTeamID: string | null = localStorage.getItem('teamID');
    const loadedStoredTeams: string | null = localStorage.getItem('teams');
    const loadedName: string | null = localStorage.getItem('name');

    if (!loadedClientID) {
      const newClientID = crypto.randomUUID();

      set({ clientID: newClientID });
      localStorage.setItem('clientID', newClientID);
    } else {
      set({ clientID: loadedClientID });
    }

    if (loadedCurrentTeamID) {
      set({ currentTeamID: loadedCurrentTeamID });
    }

    if (loadedStoredTeams) {
      set({ storedTeams: JSON.parse(loadedStoredTeams) as StoredTeam[] });
    }

    if (loadedName) {
      set({ name: loadedName });
    }
  },
  name: null,
  persist: () => {
    localStorage.setItem('clientID', get().clientID || '');
    localStorage.setItem('teamID', get().currentTeamID || '');
    localStorage.setItem('teams', JSON.stringify(get().storedTeams));
    localStorage.setItem('name', get().name || '');
  },
  storedTeams: [],
  userStates: [],
}));

export default useClientStore;

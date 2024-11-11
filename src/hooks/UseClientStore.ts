import { create } from 'zustand';

import { StoredTeam } from '../types/team';
import { UserState } from '../types/userState';

interface ClientState {
  addTeam: (team: StoredTeam) => void;
  clientID: string | null;
  currentTeamID: string | null;
  initialize: () => void;
  initialized: boolean;
  name: string | null;
  persist: () => void;
  setCurrentTeamID: (currentTeamID: string) => void;
  setName: (name: string) => void;
  storedTeams: StoredTeam[];
  userStates: UserState[];
}

const useClientStore = create<ClientState>((set, get) => ({
  addTeam: (team: StoredTeam) => {
    const storedTeams = get().storedTeams;
    const hasTeam = storedTeams.find((storedTeam) => storedTeam.id === team.id);

    if (!hasTeam) {
      set({ storedTeams: [...storedTeams, team] });
      get().persist();
    }
  },
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

    set({ initialized: true });
  },
  initialized: false,
  name: null,
  persist: () => {
    localStorage.setItem('clientID', get().clientID || '');
    localStorage.setItem('teamID', get().currentTeamID || '');
    localStorage.setItem('teams', JSON.stringify(get().storedTeams));
    localStorage.setItem('name', get().name || '');
  },
  setCurrentTeamID: (currentTeamID: string) => {
    set({ currentTeamID });
    get().persist();
  },
  setName: (name: string) => {
    set({ name });
    get().persist();
  },
  storedTeams: [],
  userStates: [],
}));

export default useClientStore;

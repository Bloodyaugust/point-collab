export enum TeamState {
  POINTING,
  REVEALED,
}

export type StoredTeam = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  state: TeamState;
  storyID: string;
  points: object[];
  history: object;
  adminClientID: string;
};

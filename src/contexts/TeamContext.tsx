import { createContext, useState, type ReactNode } from "react";

type ContextType = {
  setTeamID: (teamID: string) => void;
  teamID: string | null;
};

const TeamContext = createContext<ContextType>({
  setTeamID: () => {},
  teamID: null,
});

type Props = {
  children: ReactNode;
};

export default function TeamContextComponent({ children }: Props) {
  const [teamID, setTeamID] = useState<string | null>(null);

  return (
    <TeamContext.Provider value={{ teamID, setTeamID }}>
      {children}
    </TeamContext.Provider>
  );
}

export { TeamContext };

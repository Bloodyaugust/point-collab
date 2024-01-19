import { useContext, useState } from "react";
import { TeamContext } from "../contexts/TeamContext";
import pocketBase from "../lib/pocketbase";
import type { Team } from "../types/team";
import styles from "./TeamChooser.module.css";
import { TeamState } from "../types/teamState";

type Props = {
  clientID: string;
};

export default function TeamChooser({ clientID }: Props) {
  const { teamID, setTeamID } = useContext(TeamContext);

  const [teamName, setTeamName] = useState("");
  const [joinTeamID, setJoinTeamID] = useState("");
  const [joinTeamError, setJoinTeamError] = useState<string | null>(null);

  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const handleJoinTeamIDChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJoinTeamID(event.target.value);
  };

  const handleCreateTeam = async () => {
    const newTeam = (await pocketBase.collection("teams").create({
      name: teamName,
      state: TeamState.POINTING,
      adminClientID: clientID,
      points: [],
      history: [],
    })) as Team;

    setTeamID(newTeam.id);
  };

  const handleJoinTeam = async () => {
    try {
      const team = (await pocketBase
        .collection("teams")
        .getOne(joinTeamID)) as Team;

      setTeamID(team.id);
      setJoinTeamError(null);
    } catch {
      setJoinTeamError("Team does not exist");
    }
  };

  if (teamID) {
    return undefined;
  }

  return (
    <div>
      <span>Create a new team, or join an existing one</span>
      <hr />
      <label>Team Name:</label>
      <input onChange={handleTeamNameChange} />
      <button onClick={handleCreateTeam}>Create Team</button>
      <hr />
      <label>Team ID:</label>
      <input onChange={handleJoinTeamIDChange} />
      {joinTeamError && <span className={styles.error}>{joinTeamError}</span>}
      <button onClick={handleJoinTeam}>Join Team</button>
    </div>
  );
}

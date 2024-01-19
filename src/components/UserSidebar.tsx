import { useContext } from "react";
import { TeamContext } from "../contexts/TeamContext";

export default function UserSidebar() {
  const { teamID } = useContext(TeamContext);

  if (!teamID) {
    return <span>Waiting for a team to be joined...</span>;
  }

  return <span>Team ID: {teamID}</span>;
}

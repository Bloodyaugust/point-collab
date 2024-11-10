import { useParams } from 'react-router-dom';

export default function Team() {
  const { teamID = '' } = useParams();

  return <span>Team ID: {teamID}</span>;
}

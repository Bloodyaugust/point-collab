import { TeamState } from '../types/team';
import { UserState } from '../types/userState';
import styles from './UserStatus.module.css';

type Props = {
  teamState: TeamState;
  user: UserState;
};

export default function UserStatus({ teamState, user }: Props) {
  return (
    <div className={styles.container}>
      {teamState === TeamState.POINTING ? (
        <span>Hidden</span>
      ) : (
        <span>{user.hasPointed ? 'Pointed' : 'Waiting'}</span>
      )}
      <span>{user.name}</span>
    </div>
  );
}

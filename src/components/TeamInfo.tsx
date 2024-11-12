import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

import { Team } from '../types/team';
import styles from './TeamInfo.module.css';

type Props = {
  team: Team;
};

export default function TeamInfo({ team }: Props) {
  const inviteLink = useMemo<string | null>(() => {
    if (!team) {
      return null;
    }

    return `${window.location.origin}/team/${team.id}`;
  }, [team]);
  const handleCopyInviteLinkClick = useCallback(() => {
    if (inviteLink) {
      void navigator.clipboard.writeText(inviteLink);
    }
  }, [inviteLink]);

  return (
    <div className={styles.teamInfo}>
      <div>
        <span className={styles.teamID}>Team ID: </span>
        <span data-testid="teamID">{team.id}</span>
      </div>
      <div className={styles.link} onClick={handleCopyInviteLinkClick}>
        <span className={clsx('material-symbols-outlined', styles.icon)}>
          link
        </span>
        <span>Copy link to invite</span>
      </div>
    </div>
  );
}

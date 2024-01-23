import { useContext, useMemo } from 'react';

import { TeamContext } from '@contexts/TeamContext';

import styles from './CurrentlyPointing.module.css';

const urlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

export default function CurrentlyPointing() {
  const { team } = useContext(TeamContext);

  const storyIsLink = useMemo<boolean>(() => {
    if (!team || !team.storyID) {
      return false;
    }

    return urlRegex.test(team.storyID);
  }, [team]);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <span className={styles.pointingMessage}>Currently Pointing:</span>
      {storyIsLink ? (
        <a className={styles.pointingStory} href={team.storyID}>
          {team.storyID}
        </a>
      ) : (
        <span className={styles.pointingStory}>{team.storyID}</span>
      )}
    </div>
  );
}

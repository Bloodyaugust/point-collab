import { useContext } from 'react';

import { TeamContext } from '@contexts/TeamContext';

import styles from './CurrentlyPointing.module.css';

export default function CurrentlyPointing() {
  const { team } = useContext(TeamContext);

  if (!team) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <span className={styles.pointingMessage}>Currently Pointing:</span>
      <span className={styles.pointingStory}>{team.storyID}</span>
    </div>
  );
}

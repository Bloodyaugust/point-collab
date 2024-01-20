import clsx from 'clsx';
import { useContext, useRef, useState } from 'react';

import sharedStyles from '@components/SharedStyles.module.css';
import { TeamContext } from '@contexts/TeamContext';

import styles from './AdminSidebar.module.css';

type Props = {
  clientID: string;
};

export default function AdminSidebar({ clientID }: Props) {
  const { team, setStoryID } = useContext(TeamContext);

  const [newStoryId, setNewStoryID] = useState<string | null>(null);
  const storyIDRef = useRef<HTMLInputElement>(null);

  if (!team || team.adminClientID !== clientID) {
    return undefined;
  }

  return (
    <div className={styles.container}>
      <h2>{team.name}</h2>
      <hr />
      <div className={styles.storyIDContainer}>
        <label className={styles.inputLabel}>What are you pointing?</label>
        <input
          className={sharedStyles.inputText}
          type="text"
          onChange={(e) => {
            setNewStoryID(e.currentTarget.value);
          }}
          placeholder="Paste a link or Story ID"
          ref={storyIDRef}
        />
        <button
          className={clsx(sharedStyles.button, sharedStyles.buttonSmall)}
          onClick={() => {
            if (newStoryId) {
              setStoryID(newStoryId);
              setNewStoryID(null);

              if (storyIDRef.current) {
                storyIDRef.current.value = '';
              }
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

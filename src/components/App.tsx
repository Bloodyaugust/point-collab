import type React from 'react';
import { useState } from 'react';

import AdminSidebar from '@components/AdminSidebar';
import UserSidebar from '@components/UserSidebar';
import AdminMain from '@components/main/AdminMain';
import PointGrid from '@components/main/PointGrid';
import Welcome from '@components/main/Welcome';
import TeamID from '@components/sidebar/TeamID';
import TeamContextComponent from '@contexts/TeamContext';
import useClientID from '@hooks/UseClientID';
import useName from '@hooks/UseName';

import styles from './App.module.css';

export default function App() {
  const { name, setName } = useName();
  const clientID = useClientID();
  const [newName, setNewName] = useState<string>('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleNameSubmit = () => {
    setName(newName);
    setNewName('');
  };

  const handleOnboarded = (newClientName: string) => {
    setName(newClientName);
  };

  if (!clientID) {
    return <span>Loading...</span>;
  }

  if (!name) {
    return (
      <div className={styles.container}>
        <Welcome clientID={clientID} onOnboarded={handleOnboarded} />
      </div>
    );
  }

  return (
    <TeamContextComponent clientID={clientID} clientName={name}>
      <div className={styles.container}>
        <div className={styles.content}>
          {!name && (
            <>
              <label>Name: </label>
              <input onChange={handleNameChange} />
              <button onClick={handleNameSubmit}>Submit</button>
            </>
          )}
          <PointGrid />
          <AdminMain clientID={clientID} />
        </div>
        <div className={styles.sidebar}>
          <UserSidebar clientID={clientID} />
          <AdminSidebar clientID={clientID} />
          <TeamID />
        </div>
      </div>
    </TeamContextComponent>
  );
}

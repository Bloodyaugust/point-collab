import type React from "react";
import useName from "../hooks/UseName";
import styles from "./App.module.css";
import { useState } from "react";
import useClientID from "../hooks/UseClientID";
import TeamContextComponent from "../contexts/TeamContext";
import TeamChooser from "./TeamChooser";
import UserSidebar from "./UserSidebar";

export default function App() {
  const { name, setName } = useName();
  const clientID = useClientID();
  const [newName, setNewName] = useState<string>("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleNameSubmit = () => {
    setName(newName);
    setNewName("");
  };

  if (!clientID) {
    return <span>Loading...</span>;
  }

  return (
    <TeamContextComponent>
      <div className={styles.container}>
        <div className={styles.content}>
          {name ? (
            <span>Hello {name}!</span>
          ) : (
            <>
              <label>Name: </label>
              <input onChange={handleNameChange} />
              <button onClick={handleNameSubmit}>Submit</button>
            </>
          )}
          <TeamChooser clientID={clientID} />
        </div>
        <div className={styles.sidebar}>
          <UserSidebar />
        </div>
      </div>
    </TeamContextComponent>
  );
}

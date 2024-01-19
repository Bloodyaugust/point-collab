import type React from "react";
import useName from "../hooks/UseName";
import styles from "./App.module.css";
import { useState } from "react";
import useClientID from "../hooks/UseClientID";

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

  return (
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
      </div>
      <div className={styles.sidebar}>
        <span>Hello Sidebar!</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function useClientID() {
  const [clientID, setClientID] = useState<string | null>(null);

  useEffect(() => {
    const loadedClientID: string | null = localStorage.getItem("clientID");

    if (!loadedClientID) {
      const newClientID = crypto.randomUUID();
      setClientID(newClientID);
      localStorage.setItem("clientID", newClientID);
    } else {
      setClientID(loadedClientID);
    }
  }, []);

  return clientID;
}

import { useEffect, useState } from "react";

export default function useClientID() {
  const [clientID, setClientID] = useState<string | null>(null);

  useEffect(() => {
    const clientID: string | null = localStorage.getItem("clientID");

    if (!clientID) {
      const newClientID = crypto.randomUUID();
      setClientID(newClientID);
      localStorage.setItem("clientID", newClientID);
    }
  }, []);

  return clientID;
}

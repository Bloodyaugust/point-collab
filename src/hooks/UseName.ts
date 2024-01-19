import { useEffect, useState } from "react";

export default function useName() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedName: string | null = localStorage.getItem("name");

    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    if (name) {
      localStorage.setItem("name", name);
    }
  }, [name]);

  return {
    name,
    setName,
  };
}

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import useClientStore from './hooks/UseClientStore';
import styles from './root.module.css';

export default function Root() {
  const navigate = useNavigate();
  const initializeClientStore = useClientStore((state) => state.initialize);
  const name = useClientStore((state) => state.name);
  const currentTeamID = useClientStore((state) => state.currentTeamID);
  const [clientStoreInitialized, setClientStoreInitialized] =
    useState<boolean>(false);

  useEffect(() => {
    initializeClientStore();
    setClientStoreInitialized(true);
  }, [initializeClientStore]);

  useEffect(() => {
    if (clientStoreInitialized && !name && !currentTeamID) {
      navigate('/welcome');
    }
  }, [clientStoreInitialized, currentTeamID, name, navigate]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

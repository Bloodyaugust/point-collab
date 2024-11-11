import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import useClientStore from './hooks/UseClientStore';
import styles from './root.module.css';

export default function Root() {
  const navigate = useNavigate();
  const initialized = useClientStore((state) => state.initialized);
  const initializeClientStore = useClientStore((state) => state.initialize);
  const name = useClientStore((state) => state.name);
  const currentTeamID = useClientStore((state) => state.currentTeamID);
  const clientStoreInitialized = useClientStore((state) => state.initialized);

  useEffect(() => {
    initializeClientStore();
  }, [initializeClientStore]);

  useEffect(() => {
    if (clientStoreInitialized && !name && !currentTeamID) {
      navigate('/welcome');
    }
  }, [clientStoreInitialized, currentTeamID, name, navigate]);

  if (!initialized) {
    return <span>Initializing...</span>
  }

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

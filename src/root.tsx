import { useEffect } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import useClientStore from './hooks/UseClientStore';
import styles from './root.module.css';

export default function Root() {
  const navigate = useNavigate();
  const navToTeam = useMatch('/team/:id');
  const navToTeams = useMatch('/teams');
  const initialized = useClientStore((state) => state.initialized);
  const initializeClientStore = useClientStore((state) => state.initialize);
  const name = useClientStore((state) => state.name);
  const currentTeamID = useClientStore((state) => state.currentTeamID);
  const clientStoreInitialized = useClientStore((state) => state.initialized);

  useEffect(() => {
    initializeClientStore();
  }, [initializeClientStore]);

  useEffect(() => {
    if (clientStoreInitialized && !name) {
      navigate('/welcome');
    } else if (!navToTeam && !navToTeams) {
      if (currentTeamID) {
        navigate(`/team/${currentTeamID}`);
      } else {
        navigate(`/teams`);
      }
    }
  }, [
    clientStoreInitialized,
    currentTeamID,
    name,
    navigate,
    navToTeam,
    navToTeams,
  ]);

  if (!initialized) {
    return <span>Initializing...</span>;
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

import styles from './Privacy.module.css';

export default function Privacy() {
  return (
    <article className={styles.container}>
      <h2>Privacy Policy</h2>
      <p>
        We don&apos;t collect any data from you. There are no ads or trackers
        present in this app, and there never will be. Only enter information,
        such as names and story ids or links, that you are comfortable with
        being seen by others. If you would like to have a team deleted, please
        email the team ID to greysonrichey (at) gmail.com with the subject
        &quot;Please Delete My Team&quot;.
      </p>
    </article>
  );
}

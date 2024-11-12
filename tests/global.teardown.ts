import PocketBase, { ClientResponseError, RecordService } from 'pocketbase';

import { test as setup } from '@playwright/test';

import { Team } from '../src/types/team';
import { UserState } from '../src/types/userState';

interface TypedPocketBase extends PocketBase {
  collection(idOrName: 'teams'): RecordService<Team>;
  collection(idOrName: 'user_states'): RecordService<UserState>;
}

const pocketBase = new PocketBase(
  process.env.VITE_POCKETBASE_URL as string,
) as TypedPocketBase;

setup('delete playwright teams', async () => {
  const playwrightTeams = await pocketBase.collection('teams').getList(0, 100, {
    filter: "name='Playwright Test'",
  });

  const deletePromises = playwrightTeams.items.map((team) => {
    pocketBase
      .collection('teams')
      .delete(team.id)
      .catch((e) => {
        if (e instanceof ClientResponseError && e.isAbort) {
          return;
        }

        console.error('Error deleting playwright test team: ', e);
      });
  });

  await Promise.all(deletePromises);

  await pocketBase
    .collection('teams')
    .delete(process.env.PLAYWRIGHT_TEST_TEAM_ID || '');
});

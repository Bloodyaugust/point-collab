import PocketBase, { RecordService } from 'pocketbase';

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

setup('create playwright team', async () => {
  const team = await pocketBase.collection('teams').create({
    name: 'Playwright Test',
    adminClientID: 'playwright-test',
  });

  process.env.PLAYWRIGHT_TEST_TEAM_ID = team.id;
});

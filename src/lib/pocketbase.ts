import PocketBase, { RecordService } from 'pocketbase';

import { Team } from '../types/team';
import { UserState } from '../types/userState';

interface TypedPocketBase extends PocketBase {
  collection(idOrName: 'teams'): RecordService<Team>;
  collection(idOrName: 'user_states'): RecordService<UserState>;
}

const pocketBase = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL as string,
) as TypedPocketBase;

export default pocketBase;

import type User from './User';
import type Pick from './Pick';

type UserWithPicks = User & {
  Picks?: Pick[];
};

export default UserWithPicks;

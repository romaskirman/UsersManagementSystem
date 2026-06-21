import { MESSAGES } from '../constants/messages';

export type UserStatus = 'unverified' | 'active' | 'blocked';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLoginAt: string | null;
};

export type UserAction = 'block' | 'unblock' | 'delete' | 'delete-unverified';

export const USER_ACTION_ENDPOINTS: Record<UserAction, string> = {
  block: '/users/block',
  unblock: '/users/unblock',
  delete: '/users/delete',
  'delete-unverified': '/users/delete-unverified',
};

export function isRightsLostError(status?: number, message?: string) {
  return (status === 401 || status === 403) && message === MESSAGES.rightsLost;
}

export function toggleSelectedId(selected: string[], id: string) {
  return selected.includes(id)
    ? selected.filter((value) => value !== id)
    : [...selected, id];
}

export function getNextSelectedIds(users: UserRow[], allChecked: boolean) {
  return allChecked ? [] : users.map((user) => user.id);
}

export function doesActionAffectCurrentUser(
  action: UserAction,
  currentUserId: string | null,
  selected: string[],
  currentUser: UserRow | null
) {
  const selectedIncludesSelf = Boolean(currentUserId && selected.includes(currentUserId));

  if (!selectedIncludesSelf) {
    return false;
  }

  if (action === 'block' || action === 'delete') {
    return true;
  }

  return action === 'delete-unverified' && currentUser?.status === 'unverified';
}

export function updateUsersAfterSelfAction(
  users: UserRow[],
  selected: string[],
  action: UserAction
) {
  if (action === 'delete') {
    return users.filter((user) => !selected.includes(user.id));
  }

  if (action === 'delete-unverified') {
    return users.filter(
      (user) => !(selected.includes(user.id) && user.status === 'unverified')
    );
  }

    if (action === 'block') {
      return users.map((user): UserRow =>
        selected.includes(user.id)
          ? { ...user, status: 'blocked' }
          : user
      );
    }

  return users;
}

export function getSelectedEmails(users: UserRow[], selected: string[]) {
  return users
    .filter((user) => selected.includes(user.id))
    .map((user) => user.email)
    .join(', ');
}
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import UsersHeader from '../components/users/UsersHeader';
import UsersTable from '../components/users/UsersTable';
import UsersToolbar from '../components/users/UsersToolbar';
import { IconBroom, IconLockClosed, IconLockOpen, IconTrash } from '../components/users/icons';
import { MESSAGES } from '../constants/messages';
import { clearToken, getCurrentUserId, getLoginPathWithRightsReason } from '../utils/auth';
import { getErrorMessage, getErrorStatus } from '../utils/errors';
import { doesActionAffectCurrentUser, getNextSelectedIds, getSelectedEmails, isRightsLostError, toggleSelectedId, updateUsersAfterSelfAction, USER_ACTION_ENDPOINTS, UserAction, UserRow } from '../utils/users';

type LoadOptions = {
  suppressRightsError?: boolean;
};

export default function UsersPage() {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [selfChanged, setSelfChanged] = useState(false);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) || null,
    [users, currentUserId]
  );

  const allChecked = users.length > 0 && selected.length === users.length;
  const canRunActions = selected.length > 0;
  const selectedEmails = useMemo(
    () => getSelectedEmails(users, selected),
    [users, selected]
  );

  const logout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  const goRightsLost = () => {
    clearToken();
    navigate(getLoginPathWithRightsReason(), { replace: true });
  };

  const loadUsers = async (options?: LoadOptions) => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setSelected([]);
      setMessage('');
      return true;
    } catch (error: any) {
      const status = getErrorStatus(error);
      const apiMessage = error?.response?.data?.message;

      if (options?.suppressRightsError && isRightsLostError(status, apiMessage)) {
        return false;
      }

      throw error;
    }
  };

  useEffect(() => {
    loadUsers().catch((error: any) => {
      setMessage(getErrorMessage(error, MESSAGES.usersLoadFailed));
    });
  }, []);

  const toggleOne = (id: string) => {
    setSelected((prev) => toggleSelectedId(prev, id));
  };

  const toggleAll = () => {
    setSelected(getNextSelectedIds(users, allChecked));
  };

  const applySelfActionFallback = (action: UserAction) => {
    setUsers((prev) => updateUsersAfterSelfAction(prev, selected, action));
    setSelected([]);
    setMessage('');
  };

  const runAction = async (action: UserAction) => {
    if (!canRunActions || isBusy) return;

    setIsBusy(true);
    setMessage('');

    try {
      if (selfChanged) {
        goRightsLost();
        return;
      }

      await api.post(USER_ACTION_ENDPOINTS[action], { ids: selected });

      const affectsCurrentUser = doesActionAffectCurrentUser(
        action,
        currentUserId,
        selected,
        currentUser
      );

      if (affectsCurrentUser) {
        setSelfChanged(true);

        const refreshed = await loadUsers({ suppressRightsError: true });

        if (!refreshed) {
          applySelfActionFallback(action);
        }

        return;
      }

      await loadUsers();
    } catch (error: any) {
      const status = getErrorStatus(error);
      const apiMessage = error?.response?.data?.message;

      if (isRightsLostError(status, apiMessage)) {
        goRightsLost();
        return;
      }

      setMessage(getErrorMessage(error, MESSAGES.actionFailed));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="container py-4">
      <UsersHeader selectedCount={selected.length} onLogout={logout} />

      {message ? <div className="alert alert-info">{message}</div> : null}

      <UsersToolbar
        canRunActions={canRunActions}
        isBusy={isBusy}
        onBlock={() => runAction('block')}
        onUnblock={() => runAction('unblock')}
        onDelete={() => runAction('delete')}
        onDeleteUnverified={() => runAction('delete-unverified')}
        blockIcon={<IconLockClosed />}
        unblockIcon={<IconLockOpen />}
        deleteIcon={<IconTrash />}
        broomIcon={<IconBroom />}
      />

      <UsersTable
        users={users}
        selected={selected}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
      />

      {selectedEmails ? (
        <div className="users-selected-summary mt-3 text-muted small">
          Selected emails: {selectedEmails}
        </div>
      ) : null}
    </div>
  );
}
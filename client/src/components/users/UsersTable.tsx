import { UserRow } from '../../utils/users';

type UsersTableProps = {
  users: UserRow[];
  selected: string[];
  allChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
};

function getStatusClass(status: UserRow['status']) {
  if (status === 'active') return 'status-badge status-active';
  if (status === 'blocked') return 'status-badge status-blocked';
  return 'status-badge status-unverified';
}

export default function UsersTable({
  users,
  selected,
  allChecked,
  onToggleAll,
  onToggleOne,
}: UsersTableProps) {
  return (
    <div className="table-responsive">
      <table className="users-table">
        <thead>
          <tr>
            <th className="users-table-check">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onToggleAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Last login</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="users-table-check">
                <input
                  type="checkbox"
                  checked={selected.includes(user.id)}
                  onChange={() => onToggleOne(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={getStatusClass(user.status)}>
                  {user.status}
                </span>
              </td>
              <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}</td>
            </tr>
          ))}

          {!users.length && (
            <tr>
              <td colSpan={5} className="users-table-empty">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
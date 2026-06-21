type UsersHeaderProps = {
  selectedCount: number;
  onLogout: () => void;
};

export default function UsersHeader({ selectedCount, onLogout }: UsersHeaderProps) {
  return (
    <div className="users-header mb-3">
      <h1 className="users-title mb-0">Users Management System</h1>

      <div className="users-header-actions">
        <div className="users-selected-count">Selected: {selectedCount}</div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
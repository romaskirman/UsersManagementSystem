import { ReactNode } from 'react';

type ActionButtonProps = {
  title: string;
  onClick: () => void;
  disabled: boolean;
  className: string;
  icon: ReactNode;
  label?: string;
  ariaLabel?: string;
};

function ActionButton({
  title,
  onClick,
  disabled,
  className,
  icon,
  label,
  ariaLabel,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      {icon}
      {label ? <span>{label}</span> : null}
    </button>
  );
}

type UsersToolbarProps = {
  canRunActions: boolean;
  isBusy: boolean;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
  onDeleteUnverified: () => void;
  blockIcon: ReactNode;
  unblockIcon: ReactNode;
  deleteIcon: ReactNode;
  broomIcon: ReactNode;
};

export default function UsersToolbar({
  canRunActions,
  isBusy,
  onBlock,
  onUnblock,
  onDelete,
  onDeleteUnverified,
  blockIcon,
  unblockIcon,
  deleteIcon,
  broomIcon,
}: UsersToolbarProps) {
  const disabled = !canRunActions || isBusy;

  return (
    <div className="users-toolbar mb-4">
      <ActionButton
        title="Block"
        onClick={onBlock}
        disabled={disabled}
        className="action-btn action-btn-blue action-btn-wide"
        icon={blockIcon}
        label="Block"
      />

      <ActionButton
        title="Unblock"
        onClick={onUnblock}
        disabled={disabled}
        className="action-btn action-btn-blue action-btn-icon"
        icon={unblockIcon}
        ariaLabel="Unblock"
      />

      <ActionButton
        title="Delete"
        onClick={onDelete}
        disabled={disabled}
        className="action-btn action-btn-red action-btn-icon"
        icon={deleteIcon}
        ariaLabel="Delete"
      />

      <ActionButton
        title="Delete unverified"
        onClick={onDeleteUnverified}
        disabled={disabled}
        className="action-btn action-btn-red action-btn-icon"
        icon={broomIcon}
        ariaLabel="Delete unverified"
      />
    </div>
  );
}
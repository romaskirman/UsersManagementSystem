export const MESSAGES = {
  unauthorized: 'Unauthorized',
  rightsLost: 'You no longer have rights to manage users',

  registrationFailed: 'Registration failed',
  loginFailed: 'Login failed',
  verificationFailed: 'Verification failed',

  invalidToken: 'Invalid token',
  invalidCredentials: 'Invalid credentials',
  blockedAccount: 'Your account is blocked',

  registerFieldsRequired: 'Name, email and password are required',
  loginFieldsRequired: 'Email and password are required',
  emailExists: 'Email already exists',

  usersLoadFailed: 'Failed to load users',
  actionFailed: 'Action failed',
  noUsersSelected: 'No users selected',

  registrationSuccess: 'Registration successful. Check email for verification.',
  usersBlocked: 'Users blocked',
  usersUnblocked: 'Users unblocked',
  usersDeleted: 'Users deleted',
  unverifiedUsersDeleted: 'Unverified users deleted',
} as const;
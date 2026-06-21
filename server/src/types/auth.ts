export type JwtPayload = {
  sub?: string;
  email?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  status: string;
};
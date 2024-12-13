export interface IAuthContextType {
  user: User | null;
  token: string | null;
  login: (cccd_id: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface IUser {
  name: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
  role: UserRole;
  phone: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  pictureUrl: string | null;
  providers: string[];
  createdAt: string;
  lastLoginAt: string;
}

export type UserRole = 'user' | 'admin';

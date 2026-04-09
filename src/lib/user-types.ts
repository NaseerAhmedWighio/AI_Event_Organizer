export interface StoredUser {
  _id?: string; // Sanity document ID
  id: string;
  userId?: string; // Custom user ID
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImageUrl?: string;
  role?: 'admin' | 'subadmin' | 'user'; // User role for access control
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserPublic {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role?: 'admin' | 'subadmin' | 'user';
  createdAt: string;
}

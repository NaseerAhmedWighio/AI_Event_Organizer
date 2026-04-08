export interface StoredUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface UserPublic {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  createdAt: string;
}

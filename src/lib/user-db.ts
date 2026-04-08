import { client } from '@/lib/sanityClient';
import { StoredUser } from './user-types';

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const query = `*[_type == "user" && email == $email][0] {
    "_id": userId,
    email,
    password,
    firstName,
    lastName,
    profileImageUrl,
    "createdAt": coalesce(createdAt, "1970-01-01T00:00:00.000Z")
  }`;
  
  const user = await client.fetch(query, { email });
  return user || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<StoredUser | null> {
  const query = `*[_type == "user" && userId == $id][0] {
    "_id": userId,
    email,
    password,
    firstName,
    lastName,
    profileImageUrl,
    "createdAt": coalesce(createdAt, "1970-01-01T00:00:00.000Z")
  }`;
  
  const user = await client.fetch(query, { id });
  return user || null;
}

/**
 * Create a new user
 */
export async function createUser(user: StoredUser): Promise<void> {
  await client.create({
    _type: 'user',
    userId: user.id,
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
  });
}

/**
 * Update user
 */
export async function updateUser(id: string, updates: Partial<Omit<StoredUser, 'password'>>): Promise<StoredUser | null> {
  const updateFields: Record<string, any> = {};
  
  if (updates.firstName !== undefined) updateFields.firstName = updates.firstName;
  if (updates.lastName !== undefined) updateFields.lastName = updates.lastName;
  if (updates.profileImageUrl !== undefined) updateFields.profileImageUrl = updates.profileImageUrl;
  
  if (Object.keys(updateFields).length === 0) {
    return findUserById(id);
  }

  await client
    .patch(id)
    .set(updateFields)
    .commit();
  
  return findUserById(id);
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await client
    .patch(userId)
    .set({ lastLoginAt: new Date().toISOString() })
    .commit();
}

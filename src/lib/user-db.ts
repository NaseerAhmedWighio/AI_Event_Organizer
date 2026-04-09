import { client } from '@/lib/sanityClient';
import { StoredUser } from './user-types';

export type { StoredUser };

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const query = `*[_type == "user" && email == $email][0] {
    "_id": _id,
    "id": userId,
    userId,
    email,
    password,
    firstName,
    lastName,
    profileImageUrl,
    role,
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
    "_id": _id,
    "id": userId,
    userId,
    email,
    password,
    firstName,
    lastName,
    profileImageUrl,
    role,
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
    role: user.role || 'user', // Default role is 'user'
    createdAt: user.createdAt,
  });
}

/**
 * Update user
 */
export async function updateUser(id: string, updates: Partial<Omit<StoredUser, 'password'>>): Promise<StoredUser | null> {
  // First find the user's Sanity _id
  const user = await findUserById(id);
  if (!user || !user._id) {
    return null;
  }

  const updateFields: Record<string, any> = {};

  if (updates.firstName !== undefined) updateFields.firstName = updates.firstName;
  if (updates.lastName !== undefined) updateFields.lastName = updates.lastName;
  if (updates.profileImageUrl !== undefined) updateFields.profileImageUrl = updates.profileImageUrl;
  if (updates.role !== undefined) updateFields.role = updates.role;

  if (Object.keys(updateFields).length === 0) {
    return findUserById(id);
  }

  await client
    .patch(user._id)
    .set(updateFields)
    .commit();

  return findUserById(id);
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: string): Promise<void> {
  // First find the user's Sanity _id
  const user = await findUserById(userId);
  if (user && user._id) {
    await client
      .patch(user._id)
      .set({ lastLoginAt: new Date().toISOString() })
      .commit();
  }
}

/**
 * Get all users (for debugging/admin purposes)
 * WARNING: This returns password hashes - use with caution!
 */
export async function getAllUsers(): Promise<StoredUser[]> {
  const query = `*[_type == "user"] | order(createdAt desc) {
    "_id": _id,
    "id": userId,
    userId,
    email,
    password,
    firstName,
    lastName,
    profileImageUrl,
    role,
    "createdAt": coalesce(createdAt, "1970-01-01T00:00:00.000Z"),
    "lastLoginAt": coalesce(lastLoginAt, "Never")
  }`;

  const users = await client.fetch(query);
  return users || [];
}

/**
 * Check if user is admin or sub-admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await findUserById(userId);
  return user?.role === 'admin' || user?.role === 'subadmin';
}

/**
 * Check if user is main admin (naseerahmedwighio@gmail.com)
 */
export async function isMainAdmin(userId: string): Promise<boolean> {
  const user = await findUserById(userId);
  return user?.role === 'admin';
}

/**
 * Grant sub-admin access to a user by email
 */
export async function grantSubAdminAccess(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.role === 'admin') {
      return { success: false, error: 'User is already an admin' };
    }

    await updateUser(user.id, { role: 'subadmin' });
    return { success: true };
  } catch (error) {
    console.error('Error granting sub-admin access:', error);
    return { success: false, error: 'Failed to grant access' };
  }
}

/**
 * Remove sub-admin access from a user
 */
export async function removeSubAdminAccess(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.role === 'admin') {
      return { success: false, error: 'Cannot remove main admin access' };
    }

    await updateUser(user.id, { role: 'user' });
    return { success: true };
  } catch (error) {
    console.error('Error removing sub-admin access:', error);
    return { success: false, error: 'Failed to remove access' };
  }
}

/**
 * Get all sub-admins
 */
export async function getSubAdmins(): Promise<StoredUser[]> {
  const query = `*[_type == "user" && role in ["admin", "subadmin"]] | order(createdAt desc) {
    "_id": _id,
    "id": userId,
    userId,
    email,
    firstName,
    lastName,
    profileImageUrl,
    role,
    "createdAt": coalesce(createdAt, "1970-01-01T00:00:00.000Z"),
    "lastLoginAt": coalesce(lastLoginAt, "Never")
  }`;

  const users = await client.fetch(query);
  return users || [];
}

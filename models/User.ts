import bcrypt from 'bcryptjs';

export interface IDevice {
  id: string;
  user_id: string;
  userAgent: string;
  ip: string;
  lastLogin: Date;
  deviceFingerprint: string;
  created_at: string;
}

export interface IUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  isDemo: boolean;
  created_at: string;
  updated_at: string;
}

// Utility functions for password handling
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

// Database table types for Supabase
export type UserInsert = {
  email: string;
  password_hash: string;
  name: string;
  isDemo?: boolean;
};

export type UserUpdate = {
  email?: string;
  password_hash?: string;
  name?: string;
  isDemo?: boolean;
};

export type DeviceInsert = {
  user_id: string;
  userAgent: string;
  ip: string;
  deviceFingerprint: string;
  lastLogin?: string;
};

export type DeviceUpdate = {
  userAgent?: string;
  ip?: string;
  deviceFingerprint?: string;
  lastLogin?: string;
};

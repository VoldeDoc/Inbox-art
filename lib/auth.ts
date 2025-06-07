import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends NextApiRequest {
  user?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  is_demo: boolean;
  created_at: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const createUser = async (email: string, password: string, name: string) => {
  const passwordHash = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: email.toLowerCase(),
      name,
      password_hash: passwordHash,
      is_demo: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const findUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const findUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const requireAuth = async (req: AuthRequest, res: NextApiResponse) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    return true;
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const getDeviceInfo = (userAgent: string) => {
  const browser = userAgent.includes('Chrome') ? 'Chrome' :
                  userAgent.includes('Firefox') ? 'Firefox' :
                  userAgent.includes('Safari') ? 'Safari' : 'Unknown';
  
  const os = userAgent.includes('Windows') ? 'Windows' :
             userAgent.includes('Mac') ? 'macOS' :
             userAgent.includes('Linux') ? 'Linux' : 'Unknown';
  
  return { browser, os };
};

export const createDemoAccount = async () => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'demo@example.com')
      .single();

    if (!existingUser) {
      const passwordHash = await hashPassword('password');
      await supabase
        .from('users')
        .insert({
          email: 'demo@example.com',
          name: 'Demo User',
          password_hash: passwordHash,
          is_demo: true
        });
    }
  } catch (error) {
    console.error('Error creating demo account:', error);
  }
};





export const addUserDevice = async (userId: string, deviceInfo: {
  userAgent: string
  ip: string
  deviceFingerprint: string
}) => {
  const { error } = await supabase
    .from('user_devices')
    .insert({
      user_id: userId,
      user_agent: deviceInfo.userAgent,
      ip_address: deviceInfo.ip,
      device_fingerprint: deviceInfo.deviceFingerprint,
      last_login: new Date().toISOString()
    })

  if (error) throw error
}

export const updateDeviceLastLogin = async (userId: string, deviceFingerprint: string) => {
  const { error } = await supabase
    .from('user_devices')
    .update({ last_login: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('device_fingerprint', deviceFingerprint)

  if (error) throw error
}

export const findUserDevice = async (userId: string, deviceFingerprint: string) => {
  const { data, error } = await supabase
    .from('user_devices')
    .select('*')
    .eq('user_id', userId)
    .eq('device_fingerprint', deviceFingerprint)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}




export async function createDemoUser(): Promise<void> {
  try {
    const existingUser = await findUserByEmail('demo@example.com')
    if (!existingUser) {
      const passwordHash = await bcrypt.hash('password', 12)
      await supabase
        .from('users')
        .insert({
          email: 'demo@example.com',
          name: 'Demo User',
          password_hash: passwordHash,
          is_demo: true
        })
      console.log('Demo user created')
    }
  } catch (error) {
    console.error('Error creating demo user:', error)
  }
}

export const loginUser = async (email: string, password: string, deviceInfo: string) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return null; 
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return null; // Invalid password
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};
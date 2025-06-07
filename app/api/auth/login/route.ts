import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendSecurityAlert } from '@/lib/email';
import { comparePassword, findUserByEmail, generateToken, getDeviceInfo } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt:', { email, password }); // Debug log
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Auto-create demo user if logging in with demo credentials and user doesn't exist
    if (email.toLowerCase() === 'demo@example.com' && password === 'password') {
      console.log('Demo user login detected, checking if user exists...'); // Debug log
      
      const existingUser = await findUserByEmail(email);
      if (!existingUser) {
        console.log('Demo user not found, creating...'); // Debug log
        const { data, error } = await supabase
          .from('users')
          .insert({
            email: 'demo@example.com',
            name: 'Demo User',
            password_hash: 'password', // Plain text for demo
            is_demo: true
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating demo user:', error);
        } else {
          console.log('Demo user auto-created:', data);
        }
      } else {
        console.log('Demo user found:', existingUser); // Debug log
      }
    }

    const user = await findUserByEmail(email);
    console.log('Found user:', user ? { id: user.id, email: user.email, is_demo: user.is_demo } : 'No user found'); // Debug log
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

  
    let passwordMatch = false;
    if (user.is_demo) {
      // For demo user, compare plain text
      passwordMatch = password === user.password_hash;
      console.log('Demo user password comparison (plain text):', passwordMatch);
    } else {
      // For regular users, use bcrypt comparison
      passwordMatch = await comparePassword(password, user.password_hash);
      console.log('Regular user password comparison (bcrypt):', passwordMatch);
    }
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const deviceFingerprint = userAgent + ip;
    
    // Skip device tracking for demo user to avoid complications
    if (!user.is_demo) {
      try {
        const { data: existingDevice } = await supabase
          .from('user_devices')
          .select('*')
          .eq('user_id', user.id)
          .eq('device_fingerprint', deviceFingerprint)
          .single();
        
        if (!existingDevice) {
          const deviceInfo = { ...getDeviceInfo(userAgent), ip };
          await sendSecurityAlert(user.email, user.name, deviceInfo);
          
          await supabase
            .from('user_devices')
            .insert({
              user_id: user.id,
              user_agent: userAgent,
              ip_address: ip,
              device_fingerprint: deviceFingerprint
            });
        } else {
          await supabase
            .from('user_devices')
            .update({ last_login: new Date().toISOString() })
            .eq('id', existingDevice.id);
        }
      } catch (deviceError) {
        console.error('Device tracking error:', deviceError);
      }
    }

    const token = generateToken(user.id);

    const response = NextResponse.json({ 
      message: 'Login successful', 
      user: { id: user.id, email: user.email, name: user.name } 
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
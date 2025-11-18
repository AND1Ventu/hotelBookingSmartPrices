import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export async function register(data: any) {
  const { email, password, fullName, hotelId } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      full_name: fullName,
      hotel_id: hotelId,
      role: 'owner', // Default to owner for registration
    },
  });

  const tokens = generateTokens(user);
  return { user: omitPassword(user), tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const tokens = generateTokens(user);
  return { user: omitPassword(user), tokens };
}

export async function refreshToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new Error('User not found');
    }
    return generateTokens(user);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

function generateTokens(user: User) {
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

function omitPassword(user: User) {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

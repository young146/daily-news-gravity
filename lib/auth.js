import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable must be set in production!');
}
const TOKEN_NAME = 'xinchao_auth_token';
const TOKEN_EXPIRY = '7d';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
  const secret = JWT_SECRET || 'dev-secret-not-for-production';
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    secret,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token) {
  const secret = JWT_SECRET || 'dev-secret-not-for-production';
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 6) {
    errors.push('비밀번호는 최소 6자 이상이어야 합니다.');
  }
  if (password && password.length > 100) {
    errors.push('비밀번호는 100자를 초과할 수 없습니다.');
  }
  return errors;
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

export async function createInitialAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@chaovietnam.co.kr';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: '관리자',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log(`Initial admin created: ${adminEmail}`);
    return true;
  }
  return false;
}

export { TOKEN_NAME };

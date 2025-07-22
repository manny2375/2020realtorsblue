// Authentication utilities for user management
import { DatabaseManager } from './database';

export class AuthManager {
  private db: DatabaseManager;

  constructor(database: DatabaseManager) {
    this.db = database;
  }

  // Hash password using Web Crypto API (available in Cloudflare Workers)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  // Generate session token
  generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }) {
    const { email, password, firstName, lastName, phone, role } = userData;

    // Check if user already exists
    const existingUser = await this.db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const result = await this.db.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role
    });

    if (!result.success) {
      throw new Error('Failed to create user');
    }

    return { success: true, userId: result.meta.last_row_id };
  }

  // Login user
  async login(email: string, password: string) {
    // Get user by email
    const user = await this.db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password_hash as string);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate session token
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session
    await this.db.createSession(user.id as number, sessionToken, expiresAt);

    return {
      success: true,
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    };
  }

  // Logout user
  async logout(sessionToken: string) {
    await this.db.deleteSession(sessionToken);
    return { success: true };
  }

  // Verify session
  async verifySession(sessionToken: string) {
    const session = await this.db.getSessionByToken(sessionToken);
    if (!session) {
      return null;
    }

    return {
      id: session.user_id,
      email: session.email,
      firstName: session.first_name,
      lastName: session.last_name,
      role: session.role
    };
  }

  // Middleware for protecting routes
  async requireAuth(request: Request): Promise<any> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid authorization header');
    }

    const sessionToken = authHeader.substring(7);
    const user = await this.verifySession(sessionToken);
    if (!user) {
      throw new Error('Invalid or expired session');
    }

    return user;
  }

  // Check if user has specific role
  hasRole(user: any, requiredRole: string): boolean {
    return user.role === requiredRole || user.role === 'admin';
  }
}
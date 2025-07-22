// Authentication manager for Cloudflare D1 database
import { DatabaseManager } from './database';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  sessionToken?: string;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: User;
  userId?: number;
  sessionToken?: string;
  error?: string;
}

export class AuthManager {
  private db: DatabaseManager;
  private jwtSecret: string;

  constructor(database: DatabaseManager, jwtSecret: string = 'default-secret') {
    this.db = database;
    this.jwtSecret = jwtSecret;
  }

  // Hash password using Web Crypto API (available in Cloudflare Workers)
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt'); // Add salt for security
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify password
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const inputHash = await this.hashPassword(password);
    return inputHash === hashedPassword;
  }

  // Generate session token
  private generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Register new user
  async register(userData: RegisterData): Promise<RegisterResult> {
    try {
      console.log('AuthManager: Starting registration for', userData.email);

      // Validate input
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return { success: false, error: 'Missing required fields' };
      }

      // Check if user already exists
      const existingUser = await this.db.getUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password);
      console.log('AuthManager: Password hashed successfully');

      // Create user
      const result = await this.db.createUser({
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: 'client'
      });

      console.log('AuthManager: User creation result:', result);

      if (!result.success) {
        return { success: false, error: 'Failed to create user account' };
      }

      const userId = result.meta?.last_row_id;
      if (!userId) {
        return { success: false, error: 'Failed to get user ID' };
      }

      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await this.db.createSession(userId, sessionToken, expiresAt);

      // Get user data
      const user = await this.db.getUserById(userId);
      if (!user) {
        return { success: false, error: 'Failed to retrieve user data' };
      }

      const userObj: User = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        emailVerified: user.email_verified
      };

      console.log('AuthManager: Registration successful for', userData.email);

      return {
        success: true,
        user: userObj,
        userId: userId,
        sessionToken
      };

    } catch (error) {
      console.error('AuthManager: Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  // Login user
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      console.log('AuthManager: Starting login for', email);

      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Get user by email
      const user = await this.db.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await this.db.createSession(user.id, sessionToken, expiresAt);

      const userObj: User = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        emailVerified: user.email_verified
      };

      console.log('AuthManager: Login successful for', email);

      return {
        success: true,
        user: userObj,
        sessionToken
      };

    } catch (error) {
      console.error('AuthManager: Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  // Logout user
  async logout(sessionToken: string): Promise<void> {
    try {
      await this.db.deleteSession(sessionToken);
    } catch (error) {
      console.error('AuthManager: Logout error:', error);
    }
  }

  // Get user from session token
  async getUserFromSession(sessionToken: string): Promise<User | null> {
    try {
      const session = await this.db.getSessionByToken(sessionToken);
      if (!session) {
        return null;
      }

      return {
        id: session.user_id,
        email: session.email,
        firstName: session.first_name,
        lastName: session.last_name,
        phone: session.phone,
        role: session.role,
        emailVerified: session.email_verified
      };
    } catch (error) {
      console.error('AuthManager: Session lookup error:', error);
      return null;
    }
  }

  // Require authentication (throws if not authenticated)
  async requireAuth(request: Request): Promise<User> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authentication required');
    }

    const sessionToken = authHeader.substring(7);
    const user = await this.getUserFromSession(sessionToken);
    
    if (!user) {
      throw new Error('Invalid or expired session');
    }

    return user;
  }

  // Check if user has specific role
  hasRole(user: User, role: string): boolean {
    return user.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(user: User, roles: string[]): boolean {
    return roles.includes(user.role);
  }
}
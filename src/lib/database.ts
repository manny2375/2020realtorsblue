// Database connection and query utilities for Cloudflare D1
// This module provides a clean interface for database operations

export interface DatabaseConfig {
  database: D1Database;
}

export class DatabaseManager {
  private db: D1Database;

  constructor(database: D1Database) {
    this.db = database;
  }

  // User operations
  async createUser(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }) {
    const { email, passwordHash, firstName, lastName, phone, role = 'client' } = userData;
    
    const result = await this.db.prepare(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(email, passwordHash, firstName, lastName, phone, role).run();

    return result;
  }

  async getUserByEmail(email: string) {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).bind(email).first();

    return result;
  }

  async getUserById(id: number) {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(id).first();

    return result;
  }

  // Agent operations
  async getAllAgents() {
    const result = await this.db.prepare(`
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM agents a
      JOIN users u ON a.user_id = u.id
      WHERE a.is_active = TRUE
      ORDER BY a.homes_sold DESC
    `).all();

    return result.results?.map(agent => ({
      ...agent,
      specialties: agent.specialties ? JSON.parse(agent.specialties as string) : [],
      languages: agent.languages ? JSON.parse(agent.languages as string) : [],
      certifications: agent.certifications ? JSON.parse(agent.certifications as string) : []
    }));
  }

  async getAgentById(id: number) {
    const result = await this.db.prepare(`
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM agents a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ? AND a.is_active = TRUE
    `).bind(id).first();

    if (result) {
      return {
        ...result,
        specialties: result.specialties ? JSON.parse(result.specialties as string) : [],
        languages: result.languages ? JSON.parse(result.languages as string) : [],
        certifications: result.certifications ? JSON.parse(result.certifications as string) : []
      };
    }

    return null;
  }

  // Property operations
  async getAllProperties(filters?: {
    status?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    city?: string;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = `
      SELECT 
        p.*,
        a.initials as agent_initials,
        u.first_name as agent_first_name,
        u.last_name as agent_last_name
      FROM properties p
      LEFT JOIN agents a ON p.agent_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;

    const bindings: any[] = [];

    if (filters?.status) {
      query += ` AND p.status = ?`;
      bindings.push(filters.status);
    }

    if (filters?.propertyType) {
      query += ` AND p.property_type = ?`;
      bindings.push(filters.propertyType);
    }

    if (filters?.minPrice) {
      query += ` AND p.price >= ?`;
      bindings.push(filters.minPrice);
    }

    if (filters?.maxPrice) {
      query += ` AND p.price <= ?`;
      bindings.push(filters.maxPrice);
    }

    if (filters?.minBedrooms) {
      query += ` AND p.bedrooms >= ?`;
      bindings.push(filters.minBedrooms);
    }

    if (filters?.minBathrooms) {
      query += ` AND p.bathrooms >= ?`;
      bindings.push(filters.minBathrooms);
    }

    if (filters?.city) {
      query += ` AND p.city = ?`;
      bindings.push(filters.city);
    }

    if (filters?.isFeatured !== undefined) {
      query += ` AND p.is_featured = ?`;
      bindings.push(filters.isFeatured);
    }

    query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT ?`;
      bindings.push(filters.limit);
    }

    if (filters?.offset) {
      query += ` OFFSET ?`;
      bindings.push(filters.offset);
    }

    const result = await this.db.prepare(query).bind(...bindings).all();

    return result.results?.map(property => ({
      ...property,
      features: property.features ? JSON.parse(property.features as string) : [],
      keywords: property.keywords ? JSON.parse(property.keywords as string) : []
    }));
  }

  async getPropertyById(id: number) {
    const result = await this.db.prepare(`
      SELECT 
        p.*,
        a.initials as agent_initials,
        u.first_name as agent_first_name,
        u.last_name as agent_last_name,
        u.email as agent_email,
        u.phone as agent_phone
      FROM properties p
      LEFT JOIN agents a ON p.agent_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE p.id = ?
    `).bind(id).first();

    if (result) {
      return {
        ...result,
        features: result.features ? JSON.parse(result.features as string) : [],
        keywords: result.keywords ? JSON.parse(result.keywords as string) : []
      };
    }

    return null;
  }

  async searchProperties(searchQuery: string, filters?: any) {
    let query = `
      SELECT 
        p.*,
        a.initials as agent_initials,
        u.first_name as agent_first_name,
        u.last_name as agent_last_name
      FROM properties p
      LEFT JOIN agents a ON p.agent_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE (
        p.title LIKE ? OR
        p.description LIKE ? OR
        p.address LIKE ? OR
        p.city LIKE ? OR
        p.neighborhood LIKE ? OR
        p.mls_number LIKE ?
      )
    `;

    const searchTerm = `%${searchQuery}%`;
    const bindings = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];

    // Add filters similar to getAllProperties
    if (filters?.propertyType) {
      query += ` AND p.property_type = ?`;
      bindings.push(filters.propertyType);
    }

    if (filters?.minBedrooms) {
      query += ` AND p.bedrooms >= ?`;
      bindings.push(filters.minBedrooms);
    }

    if (filters?.minBathrooms) {
      query += ` AND p.bathrooms >= ?`;
      bindings.push(filters.minBathrooms);
    }

    if (filters?.minPrice) {
      query += ` AND p.price >= ?`;
      bindings.push(filters.minPrice);
    }

    if (filters?.maxPrice) {
      query += ` AND p.price <= ?`;
      bindings.push(filters.maxPrice);
    }

    query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

    const result = await this.db.prepare(query).bind(...bindings).all();

    return result.results?.map(property => ({
      ...property,
      features: property.features ? JSON.parse(property.features as string) : [],
      keywords: property.keywords ? JSON.parse(property.keywords as string) : []
    }));
  }

  // Property images
  async getPropertyImages(propertyId: number) {
    const result = await this.db.prepare(`
      SELECT * FROM property_images 
      WHERE property_id = ? 
      ORDER BY display_order ASC
    `).bind(propertyId).all();

    return result.results;
  }

  // User favorites
  async addToFavorites(userId: number, propertyId: number) {
    const result = await this.db.prepare(`
      INSERT OR IGNORE INTO user_favorites (user_id, property_id)
      VALUES (?, ?)
    `).bind(userId, propertyId).run();

    return result;
  }

  async removeFromFavorites(userId: number, propertyId: number) {
    const result = await this.db.prepare(`
      DELETE FROM user_favorites 
      WHERE user_id = ? AND property_id = ?
    `).bind(userId, propertyId).run();

    return result;
  }

  async getUserFavorites(userId: number) {
    const result = await this.db.prepare(`
      SELECT 
        p.*,
        a.initials as agent_initials,
        u.first_name as agent_first_name,
        u.last_name as agent_last_name
      FROM user_favorites uf
      JOIN properties p ON uf.property_id = p.id
      LEFT JOIN agents a ON p.agent_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE uf.user_id = ?
      ORDER BY uf.created_at DESC
    `).bind(userId).all();

    return result.results?.map(property => ({
      ...property,
      features: property.features ? JSON.parse(property.features as string) : [],
      keywords: property.keywords ? JSON.parse(property.keywords as string) : []
    }));
  }

  // Property inquiries
  async createInquiry(inquiryData: {
    propertyId: number;
    userId?: number;
    agentId?: number;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    inquiryType?: string;
    preferredContactMethod?: string;
  }) {
    const {
      propertyId,
      userId,
      agentId,
      name,
      email,
      phone,
      message,
      inquiryType = 'general',
      preferredContactMethod = 'email'
    } = inquiryData;

    const result = await this.db.prepare(`
      INSERT INTO property_inquiries 
      (property_id, user_id, agent_id, name, email, phone, message, inquiry_type, preferred_contact_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      propertyId,
      userId,
      agentId,
      name,
      email,
      phone,
      message,
      inquiryType,
      preferredContactMethod
    ).run();

    return result;
  }

  async getInquiriesByAgent(agentId: number) {
    const result = await this.db.prepare(`
      SELECT 
        pi.*,
        p.title as property_title,
        p.address as property_address,
        p.city as property_city
      FROM property_inquiries pi
      JOIN properties p ON pi.property_id = p.id
      WHERE pi.agent_id = ?
      ORDER BY pi.created_at DESC
    `).bind(agentId).all();

    return result.results;
  }

  // Session management
  async createSession(userId: number, sessionToken: string, expiresAt: Date) {
    const result = await this.db.prepare(`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `).bind(userId, sessionToken, expiresAt.toISOString()).run();

    return result;
  }

  async getSessionByToken(sessionToken: string) {
    const result = await this.db.prepare(`
      SELECT 
        s.*,
        u.email,
        u.first_name,
        u.last_name,
        u.role
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(sessionToken).first();

    return result;
  }

  async deleteSession(sessionToken: string) {
    const result = await this.db.prepare(`
      DELETE FROM user_sessions WHERE session_token = ?
    `).bind(sessionToken).run();

    return result;
  }

  // Search history
  async saveSearchHistory(userId: number, searchQuery: string, filters: any, resultsCount: number) {
    const result = await this.db.prepare(`
      INSERT INTO search_history (user_id, search_query, filters, results_count)
      VALUES (?, ?, ?, ?)
    `).bind(userId, searchQuery, JSON.stringify(filters), resultsCount).run();

    return result;
  }

  async getUserSearchHistory(userId: number, limit = 10) {
    const result = await this.db.prepare(`
      SELECT * FROM search_history 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).bind(userId, limit).all();

    return result.results?.map(search => ({
      ...search,
      filters: search.filters ? JSON.parse(search.filters as string) : {}
    }));
  }

  // Email notification operations
  async createEmailNotification(notification: {
    userId?: number;
    propertyId?: number;
    agentId?: number;
    type: string;
    recipientEmail: string;
    recipientName: string;
    subject: string;
    status: string;
    templateId?: string;
    templateData?: any;
  }) {
    const result = await this.db.prepare(`
      INSERT INTO email_notifications 
      (user_id, property_id, agent_id, type, recipient_email, recipient_name, subject, status, template_id, template_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      notification.userId,
      notification.propertyId,
      notification.agentId,
      notification.type,
      notification.recipientEmail,
      notification.recipientName,
      notification.subject,
      notification.status,
      notification.templateId,
      notification.templateData ? JSON.stringify(notification.templateData) : null
    ).run();

    return result.meta.last_row_id;
  }

  async updateEmailNotificationStatus(notificationId: number, status: string, sentAt?: Date, errorMessage?: string) {
    const result = await this.db.prepare(`
      UPDATE email_notifications 
      SET status = ?, sent_at = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, sentAt?.toISOString(), errorMessage, notificationId).run();

    return result;
  }

  async getEmailNotifications(userId?: number, limit = 50) {
    let query = `
      SELECT * FROM email_notifications 
      WHERE 1=1
    `;
    const bindings: any[] = [];

    if (userId) {
      query += ` AND user_id = ?`;
      bindings.push(userId);
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    bindings.push(limit);

    const result = await this.db.prepare(query).bind(...bindings).all();

    return result.results?.map(notification => ({
      ...notification,
      templateData: notification.template_data ? JSON.parse(notification.template_data as string) : null
    }));
  }

  async getEmailStats(userId?: number) {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        type,
        COUNT(*) as type_count
      FROM email_notifications
      WHERE 1=1
    `;
    const bindings: any[] = [];

    if (userId) {
      query += ` AND user_id = ?`;
      bindings.push(userId);
    }

    query += ` GROUP BY type`;

    const result = await this.db.prepare(query).bind(...bindings).all();

    const stats = {
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
      byType: {} as Record<string, number>
    };

    result.results?.forEach((row: any) => {
      stats.total += row.total;
      stats.sent += row.sent;
      stats.failed += row.failed;
      stats.pending += row.pending;
      stats.byType[row.type] = row.type_count;
    });

    return stats;
  }

  // User preferences for email notifications
  async createUserEmailPreferences(userId: number, preferences: {
    propertyUpdates: boolean;
    priceAlerts: boolean;
    newListings: boolean;
    marketReports: boolean;
    agentCommunications: boolean;
    frequency: string;
  }) {
    const result = await this.db.prepare(`
      INSERT OR REPLACE INTO user_email_preferences 
      (user_id, property_updates, price_alerts, new_listings, market_reports, agent_communications, frequency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      preferences.propertyUpdates,
      preferences.priceAlerts,
      preferences.newListings,
      preferences.marketReports,
      preferences.agentCommunications,
      preferences.frequency
    ).run();

    return result;
  }

  async getUserEmailPreferences(userId: number) {
    const result = await this.db.prepare(`
      SELECT * FROM user_email_preferences WHERE user_id = ?
    `).bind(userId).first();

    return result;
  }

  // Price alerts
  async createPriceAlert(alertData: {
    userId: number;
    propertyId: number;
    targetPrice: number;
    alertType: string;
    isActive: boolean;
  }) {
    const result = await this.db.prepare(`
      INSERT INTO price_alerts (user_id, property_id, target_price, alert_type, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      alertData.userId,
      alertData.propertyId,
      alertData.targetPrice,
      alertData.alertType,
      alertData.isActive
    ).run();

    return result;
  }

  async getUserPriceAlerts(userId: number) {
    const result = await this.db.prepare(`
      SELECT 
        pa.*,
        p.title as property_title,
        p.address as property_address,
        p.price as current_price
      FROM price_alerts pa
      JOIN properties p ON pa.property_id = p.id
      WHERE pa.user_id = ? AND pa.is_active = TRUE
      ORDER BY pa.created_at DESC
    `).bind(userId).all();

    return result.results;
  }

  async getTriggeredPriceAlerts() {
    const result = await this.db.prepare(`
      SELECT 
        pa.*,
        p.title as property_title,
        p.address as property_address,
        p.price as current_price,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name
      FROM price_alerts pa
      JOIN properties p ON pa.property_id = p.id
      JOIN users u ON pa.user_id = u.id
      WHERE pa.is_active = TRUE 
      AND (
        (pa.alert_type = 'below' AND p.price <= pa.target_price) OR
        (pa.alert_type = 'above' AND p.price >= pa.target_price)
      )
    `).all();

    return result.results;
  }
}

// Utility functions for data transformation
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInCents / 100);
}

export function parsePriceToCents(priceString: string): number {
  // Remove currency symbols and convert to cents
  const cleanPrice = priceString.replace(/[$,]/g, '');
  return Math.round(parseFloat(cleanPrice) * 100);
}

// Type definitions for better TypeScript support
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'client' | 'agent' | 'admin';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: number;
  user_id: number;
  license_number: string;
  initials: string;
  title: string;
  bio?: string;
  experience_years: number;
  active_listings: number;
  homes_sold: number;
  avg_days_on_market: number;
  client_satisfaction: number;
  profile_image_url?: string;
  specialties: string[];
  languages: string[];
  certifications: string[];
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface Property {
  id: number;
  mls_number: string;
  agent_id?: number;
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number; // in cents
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size?: string;
  year_built?: number;
  property_type: string;
  status: string;
  is_featured: boolean;
  days_on_market: number;
  neighborhood?: string;
  school_district?: string;
  features: string[];
  keywords: string[];
  main_image_url?: string;
  agent_initials?: string;
  agent_first_name?: string;
  agent_last_name?: string;
  agent_email?: string;
  agent_phone?: string;
}

export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface PropertyInquiry {
  id: number;
  property_id: number;
  user_id?: number;
  agent_id?: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  inquiry_type: string;
  status: string;
  preferred_contact_method: string;
  created_at: string;
  updated_at: string;
}

export interface EmailNotification {
  id: number;
  user_id?: number;
  property_id?: number;
  agent_id?: number;
  type: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  status: string;
  sent_at?: string;
  error_message?: string;
  template_id?: string;
  template_data?: any;
  created_at: string;
  updated_at: string;
}

export interface UserEmailPreferences {
  id: number;
  user_id: number;
  property_updates: boolean;
  price_alerts: boolean;
  new_listings: boolean;
  market_reports: boolean;
  agent_communications: boolean;
  frequency: string;
  created_at: string;
  updated_at: string;
}

export interface PriceAlert {
  id: number;
  user_id: number;
  property_id: number;
  target_price: number;
  alert_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
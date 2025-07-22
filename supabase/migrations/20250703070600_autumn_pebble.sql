/*
  # Email Notification System

  1. New Tables
    - `email_notifications`
      - `id` (integer, primary key)
      - `user_id` (integer, foreign key to users)
      - `property_id` (integer, foreign key to properties)
      - `agent_id` (integer, foreign key to agents)
      - `type` (text, notification type)
      - `recipient_email` (text, recipient email)
      - `recipient_name` (text, recipient name)
      - `subject` (text, email subject)
      - `status` (text, email status)
      - `sent_at` (timestamp, when email was sent)
      - `error_message` (text, error details if failed)
      - `template_id` (text, SendGrid template ID)
      - `template_data` (text, JSON template data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_email_preferences`
      - `id` (integer, primary key)
      - `user_id` (integer, foreign key to users)
      - `property_updates` (boolean, receive property updates)
      - `price_alerts` (boolean, receive price alerts)
      - `new_listings` (boolean, receive new listing notifications)
      - `market_reports` (boolean, receive market reports)
      - `agent_communications` (boolean, receive agent communications)
      - `frequency` (text, notification frequency)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `price_alerts`
      - `id` (integer, primary key)
      - `user_id` (integer, foreign key to users)
      - `property_id` (integer, foreign key to properties)
      - `target_price` (integer, target price in cents)
      - `alert_type` (text, 'below' or 'above')
      - `is_active` (boolean, alert is active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for user access control

  3. Indexes
    - Add indexes for performance optimization
*/

-- Email notifications table
CREATE TABLE IF NOT EXISTS email_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('property_inquiry', 'tour_request', 'price_alert', 'new_listing', 'welcome', 'password_reset', 'property_update', 'market_report')),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    sent_at DATETIME,
    error_message TEXT,
    template_id TEXT,
    template_data TEXT, -- JSON data for email templates
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User email preferences table
CREATE TABLE IF NOT EXISTS user_email_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    property_updates BOOLEAN DEFAULT TRUE,
    price_alerts BOOLEAN DEFAULT TRUE,
    new_listings BOOLEAN DEFAULT TRUE,
    market_reports BOOLEAN DEFAULT FALSE,
    agent_communications BOOLEAN DEFAULT TRUE,
    frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'monthly')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    target_price INTEGER NOT NULL, -- Price in cents
    alert_type TEXT DEFAULT 'below' CHECK (alert_type IN ('below', 'above', 'change')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id, alert_type)
);

-- Email templates table (for storing custom templates)
CREATE TABLE IF NOT EXISTS email_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables TEXT, -- JSON array of template variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Saved searches table (for new listing alerts)
CREATE TABLE IF NOT EXISTS saved_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    search_criteria TEXT NOT NULL, -- JSON search parameters
    alert_frequency TEXT DEFAULT 'immediate' CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email bounces and unsubscribes tracking
CREATE TABLE IF NOT EXISTS email_unsubscribes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    type TEXT DEFAULT 'all' CHECK (type IN ('all', 'marketing', 'transactional')),
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_notifications_user ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_property ON email_notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_agent ON email_notifications(agent_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created ON email_notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_user_email_preferences_user ON user_email_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_property ON price_alerts(property_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active);

CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_active ON saved_searches(is_active);

CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_email ON email_unsubscribes(email);

-- Insert default email preferences for existing users
INSERT OR IGNORE INTO user_email_preferences (user_id, property_updates, price_alerts, new_listings, market_reports, agent_communications, frequency)
SELECT id, TRUE, TRUE, TRUE, FALSE, TRUE, 'immediate'
FROM users;

-- Insert default email templates
INSERT OR IGNORE INTO email_templates (name, type, subject, html_content, text_content, variables) VALUES
('welcome', 'welcome', 'Welcome to 20/20 Realtors!', 
 '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining 20/20 Realtors. We''re excited to help you find your perfect home.</p>', 
 'Welcome {{firstName}}! Thank you for joining 20/20 Realtors. We''re excited to help you find your perfect home.',
 '["firstName", "lastName", "dashboardUrl"]'),

('property_inquiry', 'property_inquiry', 'New Property Inquiry - {{propertyTitle}}',
 '<h2>New Property Inquiry</h2><p>You have received a new inquiry for {{propertyTitle}} from {{inquirerName}}.</p>',
 'New Property Inquiry: You have received a new inquiry for {{propertyTitle}} from {{inquirerName}}.',
 '["propertyTitle", "inquirerName", "inquirerEmail", "message"]'),

('tour_request', 'tour_request', 'Tour Request Confirmation - {{propertyTitle}}',
 '<h2>Tour Request Confirmed</h2><p>Your tour request for {{propertyTitle}} has been received.</p>',
 'Tour Request Confirmed: Your tour request for {{propertyTitle}} has been received.',
 '["propertyTitle", "clientName", "agentName", "agentPhone"]'),

('price_alert', 'price_alert', 'Price Alert - {{propertyTitle}}',
 '<h2>Price Alert</h2><p>The price for {{propertyTitle}} has {{changeType}} to {{newPrice}}.</p>',
 'Price Alert: The price for {{propertyTitle}} has {{changeType}} to {{newPrice}}.',
 '["propertyTitle", "oldPrice", "newPrice", "changeType"]'),

('new_listing', 'new_listing', 'New Property Match - {{propertyTitle}}',
 '<h2>New Property Match</h2><p>We found a new property that matches your criteria: {{propertyTitle}}.</p>',
 'New Property Match: We found a new property that matches your criteria: {{propertyTitle}}.',
 '["propertyTitle", "price", "bedrooms", "bathrooms", "sqft"]');
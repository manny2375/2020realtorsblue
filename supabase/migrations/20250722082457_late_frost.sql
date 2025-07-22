-- Complete D1 Database Setup for 20/20 Realtors Real Estate Application
-- Run these queries in order to create all necessary tables

-- =====================================================
-- CORE TABLES (from 20250703052040_young_haze.sql)
-- =====================================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'agent', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    license_number TEXT UNIQUE NOT NULL,
    initials TEXT NOT NULL,
    title TEXT DEFAULT 'Real Estate Agent',
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    active_listings INTEGER DEFAULT 0,
    homes_sold INTEGER DEFAULT 0,
    avg_days_on_market INTEGER DEFAULT 0,
    client_satisfaction INTEGER DEFAULT 0,
    profile_image_url TEXT,
    specialties TEXT, -- JSON array as text
    languages TEXT, -- JSON array as text
    certifications TEXT, -- JSON array as text
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mls_number TEXT UNIQUE NOT NULL,
    agent_id INTEGER REFERENCES agents(id),
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    price INTEGER NOT NULL, -- Price in cents to avoid floating point issues
    bedrooms INTEGER NOT NULL,
    bathrooms REAL NOT NULL,
    square_feet INTEGER NOT NULL,
    lot_size TEXT,
    year_built INTEGER,
    property_type TEXT NOT NULL CHECK (property_type IN ('Single Family Home', 'Condominium', 'Townhouse', 'Multi-Family', 'Land', 'Commercial')),
    status TEXT DEFAULT 'For Sale' CHECK (status IN ('For Sale', 'Pending', 'Sold', 'Off Market')),
    is_featured BOOLEAN DEFAULT FALSE,
    days_on_market INTEGER DEFAULT 0,
    neighborhood TEXT,
    school_district TEXT,
    features TEXT, -- JSON array as text
    keywords TEXT, -- JSON array as text
    main_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User favorites/saved properties
CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Property inquiries/contact requests
CREATE TABLE IF NOT EXISTS property_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'tour_request', 'price_inquiry', 'more_info')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'closed')),
    preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Property search history
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT,
    filters TEXT, -- JSON object as text
    results_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_agents_license ON agents(license_number);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_mls ON properties(mls_number);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON property_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user ON property_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_agent ON property_inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);

-- =====================================================
-- SAMPLE DATA (from 20250703052100_white_hall.sql)
-- =====================================================

-- Insert sample users (agents)
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified) VALUES
(1, 'rogelio@2020realtors.com', '$2b$10$example_hash_1', 'Rogelio', 'Martinez', '(714) 470-4444', 'agent', TRUE),
(2, 'porfirio@2020realtors.com', '$2b$10$example_hash_2', 'Porfirio Enrique', 'Zapata', '(714) 470-4444', 'agent', TRUE),
(3, 'umberto@2020realtors.com', '$2b$10$example_hash_3', 'Umberto Frank', 'Autore Jr', '(714) 470-4444', 'agent', TRUE),
(4, 'javier@2020realtors.com', '$2b$10$example_hash_4', 'Javier Antonio', 'Sosa', '(714) 470-4444', 'agent', TRUE),
(5, 'lina@2020realtors.com', '$2b$10$example_hash_5', 'Lina', 'Levinthal', '(714) 470-4444', 'agent', TRUE),
(6, 'henry@2020realtors.com', '$2b$10$example_hash_6', 'Henry Humberto', 'Ferrufino', '(714) 470-4444', 'agent', TRUE),
(7, 'america@2020realtors.com', '$2b$10$example_hash_7', 'America', 'Sanchez', '(714) 470-4444', 'agent', TRUE),
(8, 'german@2020realtors.com', '$2b$10$example_hash_8', 'German', 'Guzman', '(714) 470-4444', 'agent', TRUE),
(9, 'rocio@2020realtors.com', '$2b$10$example_hash_9', 'Rocio', 'Medel', '(714) 470-4444', 'agent', TRUE),
(10, 'lisa@2020realtors.com', '$2b$10$example_hash_10', 'Lisa Marie', 'Schilling', '(714) 470-4444', 'agent', TRUE),
(11, 'ernie@2020realtors.com', '$2b$10$example_hash_11', 'Ernie Anthony', 'Hermosillo', '(714) 470-4444', 'agent', TRUE),
(12, 'maribel@2020realtors.com', '$2b$10$example_hash_12', 'Maribel Ruiz', 'Marin', '(714) 470-4444', 'agent', TRUE);

-- Insert agent details
INSERT OR IGNORE INTO agents (id, user_id, license_number, initials, bio, experience_years, active_listings, homes_sold, avg_days_on_market, client_satisfaction, profile_image_url, specialties, languages, certifications) VALUES
(1, 1, '01758480', 'RM', 'Rogelio brings 15 years of dedicated real estate experience to Orange County. His expertise in luxury properties and commitment to client satisfaction has made him a trusted advisor for families seeking their perfect home.', 15, 32, 180, 16, 98, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', '["Luxury Homes", "First-Time Buyers", "Investment Properties"]', '["English", "Spanish"]', '["Certified Residential Specialist (CRS)", "Accredited Buyer''s Representative (ABR)"]'),
(2, 2, '01427100', 'PZ', 'With 25 years of experience, Porfirio is one of our most seasoned agents. His extensive knowledge of the Orange County market and commercial real estate makes him invaluable for complex transactions.', 25, 30, 320, 14, 99, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', '["Commercial Properties", "Investment Analysis", "Property Development"]', '["English", "Spanish"]', '["Certified Commercial Investment Member (CCIM)", "Graduate, REALTOR® Institute (GRI)"]'),
(3, 3, '01436528', 'UJ', 'Umberto specializes in new construction and condominium sales. His attention to detail and multilingual capabilities make him perfect for international clients and those seeking modern properties.', 12, 28, 145, 18, 97, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', '["New Construction", "Condominiums", "Relocation Services"]', '["English", "Italian", "Spanish"]', '["New Home Sales Professional", "Certified International Property Specialist (CIPS)"]'),
(4, 4, '01711103', 'JS', 'Javier''s 20 years of experience and deep knowledge of Orange County school districts make him the go-to agent for families. He understands the importance of finding the right neighborhood for growing families.', 20, 25, 250, 17, 98, 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400', '["Family Homes", "School Districts", "Neighborhood Expert"]', '["English", "Spanish"]', '["Accredited Buyer''s Representative (ABR)", "Military Relocation Professional (MRP)"]'),
(5, 5, '01327698', 'LL', 'Lina specializes in luxury and waterfront properties throughout Orange County. Her 18 years of experience and multilingual skills have made her a favorite among high-end clientele.', 18, 24, 195, 15, 99, 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', '["Luxury Properties", "Waterfront Homes", "High-End Condos"]', '["English", "Russian", "Spanish"]', '["Luxury Home Marketing Specialist", "Certified Residential Specialist (CRS)"]'),
(6, 6, '02086748', 'HF', 'Henry focuses on helping first-time buyers navigate the real estate market. His expertise with FHA and VA loans has helped many families achieve their dream of homeownership.', 8, 22, 95, 20, 96, 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400', '["First-Time Buyers", "FHA/VA Loans", "Affordable Housing"]', '["English", "Spanish"]', '["Accredited Buyer''s Representative (ABR)", "Military Relocation Professional (MRP)"]'),
(7, 7, '01741699', 'AS', 'America brings a unique perspective with her background in property management. She understands both the buying and rental markets, making her invaluable for investment property clients.', 9, 20, 110, 19, 97, 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400', '["Residential Sales", "Property Management", "Rental Properties"]', '["English", "Spanish"]', '["Graduate, REALTOR® Institute (GRI)", "Certified Property Manager (CPM)"]'),
(8, 8, '01449730', 'GG', 'German specializes in investment properties and multi-family homes. His 15 years of experience and analytical approach help investors make informed decisions in the Orange County market.', 15, 19, 165, 16, 98, 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400', '["Investment Properties", "Multi-Family Homes", "Commercial Real Estate"]', '["English", "Spanish"]', '["Certified Commercial Investment Member (CCIM)", "Real Estate Investment Specialist"]'),
(9, 9, '00924553', 'RM', 'Rocio has a special talent for helping families through major life transitions. Whether upsizing for a growing family or downsizing for retirement, she provides compassionate, expert guidance.', 12, 18, 135, 18, 98, 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400', '["Family Homes", "Downsizing", "Senior Housing"]', '["English", "Spanish"]', '["Seniors Real Estate Specialist (SRES)", "Accredited Buyer''s Representative (ABR)"]'),
(10, 10, '01977038', 'LS', 'Lisa specializes in coastal properties and luxury condominiums. Her knowledge of beachfront communities and vacation rental markets makes her perfect for clients seeking coastal lifestyle properties.', 11, 17, 125, 17, 97, 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', '["Coastal Properties", "Luxury Condos", "Vacation Homes"]', '["English"]', '["Resort & Second Home Property Specialist", "Luxury Home Marketing Specialist"]'),
(11, 11, '02159616', 'EH', 'Ernie focuses on new construction and modern homes with the latest technology. His understanding of smart home features and modern amenities appeals to tech-savvy buyers.', 10, 16, 105, 19, 96, 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', '["New Construction", "Modern Homes", "Technology Integration"]', '["English", "Spanish"]', '["New Home Sales Professional", "Smart Home Technology Specialist"]'),
(12, 12, '02143212', 'MM', 'Maribel is passionate about helping first-time buyers achieve homeownership. Her patient approach and expertise in affordable housing programs have helped many young families get started.', 6, 14, 75, 21, 95, 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=400', '["First-Time Buyers", "Condominiums", "Affordable Housing"]', '["English", "Spanish"]', '["Accredited Buyer''s Representative (ABR)", "First-Time Home Buyer Specialist"]');

-- Insert sample properties
INSERT OR IGNORE INTO properties (id, mls_number, agent_id, title, description, address, city, state, zip_code, price, bedrooms, bathrooms, square_feet, lot_size, year_built, property_type, status, is_featured, days_on_market, neighborhood, school_district, features, keywords, main_image_url) VALUES
(1, 'ORA24701', 1, 'Stunning New Construction Home', 'This gorgeous newly built home is nestled in a tranquil residential street within the sought-after Orange neighborhood. Boasting four bedrooms and three and a half baths, this residence exudes character and warmth across its spacious 2,949 square feet of living space, situated on an expansive 5,855 square feet lot.', '420 S Hill St', 'Orange', 'CA', '92869', 159900000, 4, 3.5, 2949, '5,855 sq ft', 2024, 'Single Family Home', 'For Sale', TRUE, 5, 'Orange Hills', 'Orange Unified', '["2-Car Garage", "Open Floor Plan", "Master Suite", "Junior Suite", "Living Room", "Dining Room", "Family Room", "TV Room", "New Construction"]', '["new construction", "luxury", "family home", "orange", "hill street", "modern", "spacious", "garage"]', 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f2c6cb14867f86ed2.jpeg'),
(2, 'COR24801', 2, 'Beautiful Corona Family Home', 'Welcome to this stunning 4-bedroom, 3-bathroom home located in the desirable Corona community. This well-maintained property offers 2,156 square feet of comfortable living space with an open floor plan perfect for modern family living.', '8035 Santa Rita St', 'Corona', 'CA', '92881', 65000000, 4, 3, 2156, '0.059 acres', 2005, 'Single Family Home', 'For Sale', TRUE, 12, 'Corona', 'Corona-Norco Unified', '["2-Car Garage", "Open Floor Plan", "Master Suite", "Updated Kitchen", "Granite Countertops", "Large Backyard", "Central Air Conditioning", "Landscaped Yard", "Quiet Neighborhood", "Near Schools", "Easy Freeway Access", "Shopping Nearby", "Family Friendly", "Move-in Ready"]', '["corona", "santa rita", "family home", "updated kitchen", "granite countertops", "large backyard", "schools", "freeway access"]', 'https://photos.zillowstatic.com/fp/f67e3cbf0f8cb1672f1637920dc4ea16-cc_ft_768.webp');

-- Insert property images
INSERT OR IGNORE INTO property_images (property_id, image_url, alt_text, display_order, is_primary) VALUES
(1, 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f2c6cb14867f86ed2.jpeg', 'Front exterior view', 1, TRUE),
(1, 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9ff90bf927d31a4d4b.jpeg', 'Living room', 2, FALSE),
(1, 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f4669a980ca785e61.jpeg', 'Kitchen', 3, FALSE),
(1, 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9fa392d0bde20f4c4d.jpeg', 'Master bedroom', 4, FALSE),
(1, 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9ef90bf983bf1a4d48.jpeg', 'Bathroom', 5, FALSE),
(1, 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9e25f2726592724f13.jpeg', 'Backyard', 6, FALSE),
(2, 'https://photos.zillowstatic.com/fp/f67e3cbf0f8cb1672f1637920dc4ea16-cc_ft_768.webp', 'Front exterior view', 1, TRUE);

-- =====================================================
-- EMAIL NOTIFICATION SYSTEM (from 20250703070600_autumn_pebble.sql)
-- =====================================================

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

-- =====================================================
-- EMAIL SYSTEM INDEXES
-- =====================================================

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

-- =====================================================
-- DEFAULT EMAIL PREFERENCES AND TEMPLATES
-- =====================================================

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

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- All tables, indexes, sample data, and email system are now created
-- Your 20/20 Realtors application database is ready to use!
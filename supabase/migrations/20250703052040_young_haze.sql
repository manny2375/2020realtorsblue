-- Real Estate Application Database Schema for Cloudflare D1
-- This schema supports user authentication, property management, and agent data

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

-- Create indexes for better performance
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
# Real Estate Application with Cloudflare D1 & SendGrid

A modern real estate application built with React, TypeScript, running entirely on Cloudflare Workers with D1 database and SendGrid email notifications.

## Features

- **User Authentication**: Registration, login, and session management
- **Property Listings**: Browse, search, and filter properties
- **Agent Profiles**: Detailed agent information and contact
- **Favorites**: Save and manage favorite properties
- **Property Inquiries**: Contact agents about properties
- **Search History**: Track user search patterns
- **Email Notifications**: Automated emails via SendGrid
- **Price Alerts**: Get notified when property prices change
- **Tour Requests**: Schedule property viewings
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend & Backend**: Cloudflare Workers (unified deployment)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite 7
- **Backend**: Cloudflare Workers with D1 & KV
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare KV (Caching, Sessions, Analytics, Static Assets)
- **Email**: SendGrid API
- **Authentication**: Custom JWT-based auth
- **Icons**: Lucide React

## Database Setup

### 1. Create D1 Database

```bash
# Create a new D1 database
wrangler d1 create 2020realtors-blue

# Copy the database ID from the output and update wrangler.toml
```

### 2. Initialize Database Schema

```bash
# Run the schema creation
npm run db:init

# Seed with sample data
npm run db:seed

# Add email system tables
npm run db:email

# Or reset everything
npm run db:reset
```

### 3. Update Configuration

Update `wrangler.toml` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "2020realtors-blue"
database_id = "your-actual-database-id-here"
```

## SendGrid Setup

### 1. Create SendGrid Account

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your sender identity (domain or single sender)
3. Create an API key with full access

### 2. Configure SendGrid

```bash
# Set your SendGrid API key as a secret
wrangler secret put SENDGRID_API_KEY

# Update FROM_EMAIL and FROM_NAME in wrangler.toml
```

### 3. Email Templates (Optional)

You can create custom email templates in SendGrid and reference them by ID, or use the built-in HTML templates in the EmailService class.

## Development

### Development Modes

#### Option 1: Frontend Only (for UI development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### Option 2: Full Stack Development (recommended)

```bash
# Build frontend and start worker with static files
npm run dev:full

# Or run worker only (if frontend already built)
npm run dev:worker
```

The full stack development server runs on `http://localhost:8787` and serves both the React frontend and the API backend.

### Database Operations

```bash
# Initialize database schema
npm run db:init

# Seed database with sample data
npm run db:seed

# Add email system tables
npm run db:email

# Reset database (schema + seed + email)
npm run db:reset

# Execute custom SQL
wrangler d1 execute 2020realtors-blue --command "SELECT * FROM properties LIMIT 5"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (sends welcome email)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `GET /api/properties/search` - Search properties

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID

### Favorites (Authenticated)
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites
- `POST /api/favorites/sync` - Sync localStorage favorites

### Inquiries
- `POST /api/inquiries` - Create property inquiry (sends email to agent)
- `GET /api/agent/inquiries` - Get agent inquiries (agent only)
- `POST /api/tour-request` - Request property tour (sends confirmation email)

### Email Notifications
- `GET /api/email/notifications` - Get user email history
- `GET /api/email/stats` - Get email statistics
- `GET /api/email/preferences` - Get user email preferences
- `POST /api/email/preferences` - Update email preferences

### Price Alerts
- `GET /api/price-alerts` - Get user price alerts
- `POST /api/price-alerts` - Create price alert

### Search History (Authenticated)
- `GET /api/search-history` - Get user search history
- `POST /api/search-history` - Save search

### Analytics & Metrics
- `GET /api/analytics/popular-searches` - Get popular search terms
- `GET /api/analytics/metrics` - Get application metrics
- `GET /api/health/kv` - KV service health check

### Webhooks
- `POST /api/webhooks/sendgrid` - SendGrid webhook for email events

### Caching System
- **Property listings** cached for 30 minutes
- **Agent data** cached for 1 hour
- **User sessions** cached for faster authentication
- **Search results** cached based on filters

### Rate Limiting
- **Registration**: 5 attempts per hour per IP
- **Login**: 10 attempts per 15 minutes per IP
- **API endpoints** protected against abuse

### Analytics & Tracking
- **Search analytics** with query tracking
- **Popular searches** trending analysis
- **Application metrics** (views, searches, registrations)
- **User behavior** tracking and insights

### Session Management
- **Fast session lookups** via KV cache
- **Automatic session cleanup** with TTL
- **Fallback to database** for reliability

### Performance Optimization
- **Reduced database queries** through intelligent caching
- **Faster API responses** with cached data
- **Bulk operations** for efficient data management

## Email Notification Types

### Automated Emails

1. **Welcome Email** - Sent when user registers
2. **Property Inquiry** - Sent to agent when someone inquires about a property
3. **Tour Request Confirmation** - Sent to client confirming tour request
4. **Price Alert** - Sent when property price changes
5. **New Listing Alert** - Sent when new properties match saved searches

### Email Features

- **HTML Templates** - Rich email templates with property details
- **Personalization** - Dynamic content based on user and property data
- **Delivery Tracking** - Track email delivery status
- **Bounce Handling** - Handle bounced emails
- **Unsubscribe Management** - Allow users to opt out
- **Email Preferences** - Users can control what emails they receive

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `agents` - Real estate agent profiles
- `properties` - Property listings
- `property_images` - Property photos
- `user_favorites` - User saved properties
- `property_inquiries` - Contact requests
- `user_sessions` - Authentication sessions
- `search_history` - User search tracking

### Email System Tables
- `email_notifications` - Email delivery tracking
- `user_email_preferences` - User notification preferences
- `price_alerts` - Property price monitoring
- `email_templates` - Custom email templates
- `saved_searches` - Saved search criteria for alerts
- `email_unsubscribes` - Unsubscribe tracking

## Environment Variables

### Development (.dev.vars)
```
JWT_SECRET=your-development-secret
CORS_ORIGIN=http://localhost:5173
FROM_EMAIL=info@2020realtors.com
FROM_NAME=20/20 Realtors
```

### Production (Cloudflare Dashboard)
- `JWT_SECRET` - Strong secret for JWT signing
- `CORS_ORIGIN` - Set to "*" for unified deployment
- `SENDGRID_API_KEY` - SendGrid API key (secret)
- `FROM_EMAIL` - Sender email address
- `FROM_NAME` - Sender name

## Development vs Production

### Development
- **Frontend**: `npm run dev` (Vite dev server on :5173)
- **Backend**: `npm run dev:worker` (Worker on :8787)
- **Full Stack**: `npm run dev:full` (Everything on :8787)

### Production
- **Single URL**: Everything served from your Cloudflare Workers domain
- **Global CDN**: Automatic worldwide distribution
- **Edge Computing**: API runs at the edge for low latency
## KV Service Usage

The application uses Cloudflare KV for:

### 1. Caching Layer
```typescript
// Cache property listings
await kv.cacheProperties(filters, properties, 1800);

// Get cached data
const cachedProperties = await kv.getCachedProperties(filters);
```

### 2. Session Management
```typescript
// Store session
await kv.setSession(sessionToken, userData);

// Retrieve session
const user = await kv.getSession(sessionToken);
```

### 3. Static Asset Storage
```typescript
// Static files are automatically stored in KV during deployment
// Worker serves them with appropriate caching headers
```

### 4. Rate Limiting
```typescript
// Check rate limit
const rateLimit = await kv.checkRateLimit(identifier, 10, 3600);
if (!rateLimit.allowed) {
  // Handle rate limit exceeded
}
```

### 5. Analytics
```typescript
// Track metrics
await kv.incrementMetric('property_views');

// Get popular searches
const popular = await kv.getPopularSearches(10);
```

## Email Templates

The system includes built-in email templates for:

- **Welcome emails** with getting started information
- **Property inquiries** with contact details and property info
- **Tour confirmations** with agent contact information
- **Price alerts** with before/after pricing
- **New listings** matching user search criteria

Templates support dynamic variables and can be customized in the EmailService class.

## Deployment

### Single Command Deployment

```bash
# Build frontend and deploy everything to Cloudflare Workers
npm run deploy
```

This single command:
1. **Builds the React frontend** with Vite
2. **Uploads static assets** to Cloudflare KV
3. **Deploys the Worker** with both API and static file serving
4. **Configures routing** for SPA (Single Page Application)

### Manual Deployment Steps

```bash
# 1. Build the frontend
npm run build

# 2. Deploy worker with static assets
wrangler deploy
```

## Architecture Overview

### Unified Cloudflare Workers Deployment

```
┌─────────────────────────────────────────┐
│           Cloudflare Worker             │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Frontend  │  │   Backend API   │   │
│  │   (React)   │  │   (REST API)    │   │
│  │             │  │                 │   │
│  │ Static Files│  │ /api/* routes   │   │
│  │ SPA Routing │  │ Authentication  │   │
│  │             │  │ Database Ops    │   │
│  └─────────────┘  └─────────────────┘   │
├─────────────────────────────────────────┤
│              Services                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │  D1  │ │  KV  │ │Email │ │Cache │   │
│  │ DB   │ │Store │ │ API  │ │Layer │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────┘
```

### Request Routing

1. **API Requests** (`/api/*`) → Backend handlers
2. **Static Assets** (`/assets/*`, `.js`, `.css`, etc.) → Cached static files
3. **SPA Routes** (everything else) → `index.html` for client-side routing

### Benefits of Unified Deployment

- **Single deployment** for entire application
- **Global CDN** distribution automatically
- **Zero cold starts** for static content
- **Integrated caching** with KV storage
- **Cost effective** - no separate hosting needed
- **Simplified DevOps** - one service to manage

## SendGrid Configuration

### Required SendGrid Setup

1. **Domain Authentication** - Verify your sending domain
2. **API Key** - Create with full access permissions
3. **Sender Identity** - Verify your from email address
4. **Webhook** (Optional) - Set up webhook endpoint for delivery tracking

### Email Best Practices

- Use verified sender domains
- Include unsubscribe links
- Monitor bounce rates
- Respect user preferences
- Test email templates across clients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including email functionality)
5. Submit a pull request

## License

This project is licensed under the MIT License.
# Real Estate Application with Cloudflare D1 & SendGrid

A modern real estate application built with React, TypeScript, Cloudflare D1 database, and SendGrid email notifications.

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

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare KV
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

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Worker Development

```bash
# Start Cloudflare Worker locally
npm run worker:dev
```

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

### Webhooks
- `POST /api/webhooks/sendgrid` - SendGrid webhook for email events

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
- `CORS_ORIGIN` - Your frontend domain
- `SENDGRID_API_KEY` - SendGrid API key (secret)
- `FROM_EMAIL` - Sender email address
- `FROM_NAME` - Sender name

## Email Templates

The system includes built-in email templates for:

- **Welcome emails** with getting started information
- **Property inquiries** with contact details and property info
- **Tour confirmations** with agent contact information
- **Price alerts** with before/after pricing
- **New listings** matching user search criteria

Templates support dynamic variables and can be customized in the EmailService class.

## Deployment

### Deploy Worker

```bash
# Deploy to Cloudflare
npm run worker:deploy
```

### Deploy Frontend

The frontend can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

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
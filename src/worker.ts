// Cloudflare Worker entry point for the real estate application API
import { DatabaseManager } from './lib/database';
import { AuthManager } from './lib/auth';
import { EmailService } from './lib/email';
import { KVManager } from './lib/kv';

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  ASSETS: Fetcher;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  ENVIRONMENT: string;
  SENDGRID_API_KEY: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      console.log('Worker handling request:', path);

      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: corsHeaders,
        });
      }

      // Initialize database, auth, and email managers
      const db = new DatabaseManager(env.DB);
      const auth = new AuthManager(db);
      const kv = new KVManager(env.KV);
      const email = new EmailService(
        env.SENDGRID_API_KEY || 'your-sendgrid-api-key',
        env.FROM_EMAIL || 'info@2020realtors.com',
        env.FROM_NAME || '20/20 Realtors',
        db
      );

      // API Routes
      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, path, db, auth, email, kv, env);
      }

      // Serve static files for frontend
      return await handleStaticRequest(request, env);

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};

// Handle static file requests for the frontend
async function handleStaticRequest(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    console.log('Handling static request for:', url.pathname);
    
    // Simple fallback - serve a basic HTML response for now
    // This will work with any Wrangler version
    if (!url.pathname.startsWith('/api/')) {
      const basicHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>20/20 Realtors - Real Estate</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 40px 20px; 
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            text-align: center; 
            max-width: 600px;
            background: rgba(255,255,255,0.1);
            padding: 60px 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { 
            font-size: 3rem; 
            margin-bottom: 20px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        p { 
            font-size: 1.2rem; 
            margin-bottom: 30px;
            opacity: 0.9;
            line-height: 1.6;
        }
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 30px;
        }
        .contact {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        .contact a {
            color: #fbbf24;
            text-decoration: none;
            font-weight: 600;
        }
        .contact a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/6859c1dd906b87cb5a04b328.png" 
             alt="20/20 Realtors Logo" class="logo">
        <h1>20/20 Realtors</h1>
        <p>Your Vision, Our Mission</p>
        <p>We're currently setting up our new website. Please contact us directly for all your real estate needs in Orange County.</p>
        <div class="contact">
            <p><strong>Phone:</strong> <a href="tel:(714)262-4263">(714) 262-4263</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@2020realtors.com">info@2020realtors.com</a></p>
            <p><strong>Address:</strong> 2677 N MAIN ST STE 465, SANTA ANA, CA 92705</p>
        </div>
    </div>
</body>
</html>`;
      
      const headers = new Headers();
      headers.set('Content-Type', 'text/html');
      headers.set('Cache-Control', 'public, max-age=300');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(basicHtml, {
        status: 200,
        headers,
      });
    }
    
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Static file error:', error);
    
    // Fallback to basic HTML page
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      console.log('Fallback: serving basic HTML due to error');
      return new Response('20/20 Realtors - Contact us at (714) 262-4263', { 
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      });
    }
    
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders,
    });
  }
}


async function handleApiRequest(
  request: Request,
  path: string,
  db: DatabaseManager,
  auth: AuthManager,
  email: EmailService,
  kv: KVManager,
  env: Env
): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);

  try {
    // Authentication routes
    if (path === '/api/auth/register' && method === 'POST') {
      const body = await request.json() as any;
      
      // Rate limiting for registration
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimit = await kv.checkRateLimit(`register:${clientIP}`, 5, 3600); // 5 per hour
      
      if (!rateLimit.allowed) {
        return jsonResponse({ 
          error: 'Too many registration attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        }, 429);
      }
      
      const result = await auth.register(body);
      
      // Send welcome email
      if (result.success) {
        await email.sendWelcomeEmail({
          userId: result.userId,
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName
        });
      }
      
      // Track registration metric
      await kv.incrementMetric('registrations');
      
      return jsonResponse(result);
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const body = await request.json() as any;
      
      // Rate limiting for login attempts
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimit = await kv.checkRateLimit(`login:${clientIP}`, 10, 900); // 10 per 15 minutes
      
      if (!rateLimit.allowed) {
        return jsonResponse({ 
          error: 'Too many login attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        }, 429);
      }
      
      const result = await auth.login(body.email, body.password);
      
      // Cache session in KV for faster lookups
      if (result.success && result.sessionToken) {
        await kv.setSession(result.sessionToken, result.user);
      }
      
      // Track login metric
      await kv.incrementMetric('logins');
      
      return jsonResponse(result);
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const sessionToken = authHeader.substring(7);
        await kv.deleteSession(sessionToken);
        await auth.logout(sessionToken);
      }
      return jsonResponse({ success: true });
    }

    if (path === '/api/auth/me' && method === 'GET') {
      // Try KV cache first for faster session lookup
      const authHeader = request.headers.get('Authorization');
      let user = null;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const sessionToken = authHeader.substring(7);
        user = await kv.getSession(sessionToken);
      }
      
      // Fallback to database if not in cache
      if (!user) {
        user = await auth.requireAuth(request);
        // Cache the session for next time
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const sessionToken = authHeader.substring(7);
          await kv.setSession(sessionToken, user);
        }
      }
      
      return jsonResponse({ user });
    }

    // Properties routes
    if (path === '/api/properties' && method === 'GET') {
      const filters = {
        status: url.searchParams.get('status') || undefined,
        propertyType: url.searchParams.get('propertyType') || undefined,
        minPrice: url.searchParams.get('minPrice') ? parseInt(url.searchParams.get('minPrice')!) : undefined,
        maxPrice: url.searchParams.get('maxPrice') ? parseInt(url.searchParams.get('maxPrice')!) : undefined,
        minBedrooms: url.searchParams.get('minBedrooms') ? parseInt(url.searchParams.get('minBedrooms')!) : undefined,
        minBathrooms: url.searchParams.get('minBathrooms') ? parseInt(url.searchParams.get('minBathrooms')!) : undefined,
        city: url.searchParams.get('city') || undefined,
        isFeatured: url.searchParams.get('featured') === 'true' ? true : undefined,
        limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined,
        offset: url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : undefined,
      };

      // Try cache first
      let properties = await kv.getCachedProperties(filters);
      
      if (!properties) {
        // Cache miss - get from database and cache result
        properties = await db.getAllProperties(filters);
        await kv.cacheProperties(filters, properties, 1800); // Cache for 30 minutes
      }
      
      // Track property views
      await kv.incrementMetric('property_views');
      
      return jsonResponse({ properties });
    }

    if (path.startsWith('/api/properties/') && method === 'GET') {
      const propertyId = parseInt(path.split('/')[3]);
      const property = await db.getPropertyById(propertyId);
      
      if (!property) {
        return jsonResponse({ error: 'Property not found' }, 404);
      }

      // Get property images
      const images = await db.getPropertyImages(propertyId);
      
      return jsonResponse({ 
        property: {
          ...property,
          images
        }
      });
    }

    if (path === '/api/properties/search' && method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const filters = {
        propertyType: url.searchParams.get('propertyType') || undefined,
        minBedrooms: url.searchParams.get('minBedrooms') ? parseInt(url.searchParams.get('minBedrooms')!) : undefined,
        minBathrooms: url.searchParams.get('minBathrooms') ? parseInt(url.searchParams.get('minBathrooms')!) : undefined,
        minPrice: url.searchParams.get('minPrice') ? parseInt(url.searchParams.get('minPrice')!) : undefined,
        maxPrice: url.searchParams.get('maxPrice') ? parseInt(url.searchParams.get('maxPrice')!) : undefined,
      };

      const properties = await db.searchProperties(query, filters);
      
      // Track search analytics
      await kv.trackSearch(query, filters, properties.length);
      await kv.incrementPopularSearch(query);
      await kv.incrementMetric('searches');
      
      return jsonResponse({ properties, query, filters });
    }

    // Agents routes
    if (path === '/api/agents' && method === 'GET') {
      // Try cache first
      let agents = await kv.getCachedAgents();
      
      if (!agents) {
        // Cache miss - get from database and cache result
        agents = await db.getAllAgents();
        await kv.cacheAgents(agents, 3600); // Cache for 1 hour
      }
      
      return jsonResponse({ agents });
    }

    if (path.startsWith('/api/agents/') && method === 'GET') {
      const agentId = parseInt(path.split('/')[3]);
      const agent = await db.getAgentById(agentId);
      
      if (!agent) {
        return jsonResponse({ error: 'Agent not found' }, 404);
      }

      return jsonResponse({ agent });
    }

    // Favorites routes (require authentication)
    if (path === '/api/favorites' && method === 'GET') {
      const user = await auth.requireAuth(request);
      const favorites = await db.getUserFavorites(user.id);
      return jsonResponse({ favorites });
    }

    if (path === '/api/favorites' && method === 'POST') {
      const user = await auth.requireAuth(request);
      const body = await request.json() as any;
      const result = await db.addToFavorites(user.id, body.propertyId);
      return jsonResponse({ success: true });
    }

    if (path.startsWith('/api/favorites/') && method === 'DELETE') {
      const user = await auth.requireAuth(request);
      const propertyId = parseInt(path.split('/')[3]);
      const result = await db.removeFromFavorites(user.id, propertyId);
      return jsonResponse({ success: true });
    }

    // Favorites sync route
    if (path === '/api/favorites/sync' && method === 'POST') {
      const user = await auth.requireAuth(request);
      const body = await request.json() as any;
      const { favoriteIds } = body;

      // Add all favorites from localStorage to database
      for (const propertyId of favoriteIds) {
        try {
          await db.addToFavorites(user.id, propertyId);
        } catch (error) {
          // Ignore duplicates, continue with others
          console.log(`Favorite ${propertyId} already exists for user ${user.id}`);
        }
      }

      return jsonResponse({ success: true, synced: favoriteIds.length });
    }

    // Inquiries routes
    if (path === '/api/inquiries' && method === 'POST') {
      const body = await request.json() as any;
      
      // Try to get user from auth header (optional)
      let userId = undefined;
      try {
        const user = await auth.requireAuth(request);
        userId = user.id;
      } catch (e) {
        // User not authenticated, that's okay for inquiries
      }

      const result = await db.createInquiry({
        ...body,
        userId
      });

      // Send email notification to agent
      if (body.propertyId) {
        const property = await db.getPropertyById(body.propertyId);
        if (property && property.agent_email) {
          await email.sendPropertyInquiryNotification({
            propertyId: body.propertyId,
            propertyTitle: property.title,
            propertyAddress: `${property.address}, ${property.city}, ${property.state}`,
            inquirerName: body.name,
            inquirerEmail: body.email,
            inquirerPhone: body.phone,
            message: body.message || 'No message provided',
            agentEmail: property.agent_email,
            agentName: `${property.agent_first_name} ${property.agent_last_name}`
          });
        }
      }

      return jsonResponse({ success: true, inquiryId: result.meta.last_row_id });
    }

    // Agent inquiries (require agent authentication)
    if (path === '/api/agent/inquiries' && method === 'GET') {
      const user = await auth.requireAuth(request);
      
      if (!auth.hasRole(user, 'agent')) {
        return jsonResponse({ error: 'Unauthorized' }, 403);
      }

      // Get agent ID from user
      const agent = await db.getAgentById(user.id);
      if (!agent) {
        return jsonResponse({ error: 'Agent not found' }, 404);
      }

      const inquiries = await db.getInquiriesByAgent(agent.id);
      return jsonResponse({ inquiries });
    }

    // Search history routes (require authentication)
    if (path === '/api/search-history' && method === 'GET') {
      const user = await auth.requireAuth(request);
      const history = await db.getUserSearchHistory(user.id);
      return jsonResponse({ history });
    }

    if (path === '/api/search-history' && method === 'POST') {
      const user = await auth.requireAuth(request);
      const body = await request.json() as any;
      
      await db.saveSearchHistory(
        user.id,
        body.searchQuery,
        body.filters,
        body.resultsCount
      );
      
      // Also track in KV for analytics
      await kv.trackSearch(body.searchQuery, body.filters, body.resultsCount);

      return jsonResponse({ success: true });
    }

    // Email notification routes
    if (path === '/api/email/notifications' && method === 'GET') {
      const user = await auth.requireAuth(request);
      const notifications = await email.getEmailHistory(user.id);
      return jsonResponse({ notifications });
    }

    if (path === '/api/email/stats' && method === 'GET') {
      const user = await auth.requireAuth(request);
      const stats = await email.getEmailStats(user.id);
      return jsonResponse({ stats });
    }

    // Email preferences routes
    if (path === '/api/email/preferences' && method === 'GET') {
      const user = await auth.requireAuth(request);
      const preferences = await db.getUserEmailPreferences(user.id);
      return jsonResponse({ preferences });
    }

    if (path === '/api/email/preferences' && method === 'POST') {
      const user = await auth.requireAuth(request);
      const body = await request.json() as any;
      
      await db.createUserEmailPreferences(user.id, body);
      return jsonResponse({ success: true });
    }

    // Price alerts routes
    if (path === '/api/price-alerts' && method === 'GET') {
      const user = await auth.requireAuth(request);
      const alerts = await db.getUserPriceAlerts(user.id);
      return jsonResponse({ alerts });
    }

    if (path === '/api/price-alerts' && method === 'POST') {
      const user = await auth.requireAuth(request);
      const body = await request.json() as any;
      
      const result = await db.createPriceAlert({
        userId: user.id,
        propertyId: body.propertyId,
        targetPrice: body.targetPrice,
        alertType: body.alertType,
        isActive: true
      });

      return jsonResponse({ success: true, alertId: result.meta.last_row_id });
    }

    // Tour request route
    if (path === '/api/tour-request' && method === 'POST') {
      const body = await request.json() as any;
      
      // Create inquiry first
      const result = await db.createInquiry({
        propertyId: body.propertyId,
        name: body.fullName,
        email: body.email,
        phone: body.phone,
        message: body.message,
        inquiryType: 'tour_request',
        preferredContactMethod: 'phone'
      });

      // Send confirmation email to client
      const property = await db.getPropertyById(body.propertyId);
      if (property) {
        await email.sendTourRequestConfirmation({
          propertyId: body.propertyId,
          propertyTitle: property.title,
          propertyAddress: `${property.address}, ${property.city}, ${property.state}`,
          clientName: body.fullName,
          clientEmail: body.email,
          requestedDate: body.message,
          agentName: property.agent_first_name && property.agent_last_name 
            ? `${property.agent_first_name} ${property.agent_last_name}`
            : '20/20 Realtors Team',
          agentPhone: property.agent_phone || '(714) 262-4263'
        });

        // Send notification to agent
        if (property.agent_email) {
          await email.sendPropertyInquiryNotification({
            propertyId: body.propertyId,
            propertyTitle: property.title,
            propertyAddress: `${property.address}, ${property.city}, ${property.state}`,
            inquirerName: body.fullName,
            inquirerEmail: body.email,
            inquirerPhone: body.phone,
            message: `Tour Request: ${body.message}`,
            agentEmail: property.agent_email,
            agentName: `${property.agent_first_name} ${property.agent_last_name}`
          });
        }
      }

      return jsonResponse({ success: true, inquiryId: result.meta.last_row_id });
    }

    // Analytics and metrics routes
    if (path === '/api/analytics/popular-searches' && method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const popularSearches = await kv.getPopularSearches(limit);
      return jsonResponse({ popularSearches });
    }

    if (path === '/api/analytics/metrics' && method === 'GET') {
      const metric = url.searchParams.get('metric') || 'property_views';
      const days = parseInt(url.searchParams.get('days') || '7');
      const metrics = await kv.getMetrics(metric, days);
      return jsonResponse({ metrics, metric });
    }

    // KV health check route
    if (path === '/api/health/kv' && method === 'GET') {
      const isHealthy = await kv.healthCheck();
      return jsonResponse({ 
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString()
      }, isHealthy ? 200 : 503);
    }

    // Webhook for SendGrid events
    if (path === '/api/webhooks/sendgrid' && method === 'POST') {
      const events = await request.json() as any[];
      
      for (const event of events) {
        // Update email notification status based on webhook event
        if (event.sg_message_id) {
          const status = event.event === 'delivered' ? 'sent' : 
                        event.event === 'bounce' ? 'bounced' : 
                        event.event === 'dropped' ? 'failed' : 'pending';
          
          // You would need to store sg_message_id when sending emails to match them here
          // For now, we'll just log the event
          console.log('SendGrid webhook event:', event);
        }
      }

      return jsonResponse({ success: true });
    }

    // Route not found
    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error) {
    console.error('API error:', error);
    
    if (error instanceof Error && error.message.includes('authorization')) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    return jsonResponse({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
}

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
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
    const pathname = url.pathname;
    
    console.log('Static request for:', pathname);
    
    // Try to serve static files from KV first (if available)
    if (env.KV) {
      try {
        let kvKey = pathname === '/' ? 'index.html' : pathname.slice(1);
        
        console.log('Trying KV key:', kvKey);
        let staticFile = await env.KV.get(kvKey, { type: 'arrayBuffer' });
        
        if (staticFile) {
          console.log('Found file in KV:', kvKey);
          const headers = new Headers();
          
          // Set appropriate content type
          if (kvKey.endsWith('.html')) {
            headers.set('Content-Type', 'text/html; charset=utf-8');
          } else if (kvKey.endsWith('.js')) {
            headers.set('Content-Type', 'application/javascript');
          } else if (kvKey.endsWith('.css')) {
            headers.set('Content-Type', 'text/css');
          } else if (kvKey.endsWith('.png')) {
            headers.set('Content-Type', 'image/png');
          } else if (kvKey.endsWith('.jpg') || kvKey.endsWith('.jpeg')) {
            headers.set('Content-Type', 'image/jpeg');
          } else if (kvKey.endsWith('.svg')) {
            headers.set('Content-Type', 'image/svg+xml');
          } else if (kvKey.endsWith('.ico')) {
            headers.set('Content-Type', 'image/x-icon');
          } else if (kvKey.endsWith('.json')) {
            headers.set('Content-Type', 'application/json');
          }
          
          // Set caching headers
          if (kvKey.includes('assets/') || kvKey.endsWith('.js') || kvKey.endsWith('.css')) {
            headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            headers.set('Cache-Control', 'public, max-age=300');
          }
          
          // Set CORS headers
          Object.entries(corsHeaders).forEach(([key, value]) => {
            headers.set(key, value);
          });
          
          return new Response(staticFile, {
            status: 200,
            headers,
          });
        }
        
        // If not found and it's a potential SPA route (no file extension), serve index.html
        if (!pathname.includes('.') && pathname !== '/') {
          console.log('SPA route detected, serving index.html for:', pathname);
          const indexFile = await env.KV.get('index.html', { type: 'arrayBuffer' });
          if (indexFile) {
            const headers = new Headers();
            headers.set('Content-Type', 'text/html; charset=utf-8');
            headers.set('Cache-Control', 'public, max-age=300');
            Object.entries(corsHeaders).forEach(([key, value]) => {
              headers.set(key, value);
            });
            
            return new Response(indexFile, {
              status: 200,
              headers,
            });
          }
        }
      } catch (kvError) {
        console.error('KV static file serving failed:', kvError);
        // Continue to fallback
      }
    }
    
    // If it's a request for a specific asset file, try to serve from built files
    if (pathname.includes('/assets/') || pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.svg') || pathname.endsWith('.ico')) {
      console.log('Asset file requested but not found in KV:', pathname);
      
      // Try to serve built assets directly
      const builtAssets = {
        '/assets/index-B2zH4cK9.css': `@tailwind base;@tailwind components;@tailwind utilities;@layer base{html{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}}.touch-manipulation{touch-action:manipulation;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}@keyframes fade-in{from{opacity:0}to{opacity:1}}@keyframes slide-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes slide-down{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes scale-in{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}.animate-fade-in{animation:fade-in .6s ease-out}.animate-slide-up{animation:slide-up .8s ease-out}.animate-slide-down{animation:slide-down .4s ease-out}.animate-scale-in{animation:scale-in .5s ease-out}.animation-delay-200{animation-delay:200ms}.animation-delay-400{animation-delay:400ms}.animation-delay-600{animation-delay:600ms}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#94a3b8}input:focus,select:focus,textarea:focus{transition:all .3s ease}button{transition:all .3s ease}.glass{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2)}.gradient-text{background:linear-gradient(135deg,#3b82f6,#1d4ed8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.shadow-glow{box-shadow:0 0 20px rgba(59,130,246,.3)}.shadow-glow-yellow{box-shadow:0 0 20px rgba(245,158,11,.3)}.card-hover{transition:all .4s cubic-bezier(.4,0,.2,1)}.card-hover:hover{transform:translateY(-8px)}.skeleton{background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:200% 100%;animation:loading 1.5s infinite}@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}`,
        '/assets/index-Bp37-wlg.js': 'console.log("React app loading..."); // Placeholder for React bundle'
      };
      
      if (builtAssets[pathname]) {
        const headers = new Headers();
        if (pathname.endsWith('.css')) {
          headers.set('Content-Type', 'text/css');
        } else if (pathname.endsWith('.js')) {
          headers.set('Content-Type', 'application/javascript');
        }
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        Object.entries(corsHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
        
        return new Response(builtAssets[pathname], {
          status: 200,
          headers,
        });
      }
      
      console.log('Asset file not found:', pathname);
      return new Response('Asset not found', { 
        status: 404,
        headers: corsHeaders,
      });
    }
    
    // For non-API routes, serve the built React application
    if (!url.pathname.startsWith('/api/')) {
      console.log('Serving React app for:', pathname);
      
      // Serve a working React application with inline styles and basic functionality
      const workingReactApp = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>20/20 Realtors - Orange County Real Estate</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css' rel='stylesheet' />
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
        .gradient-text { background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script>
        const { useState, useEffect } = React;
        const { createRoot } = ReactDOM;
        
        function App() {
            const [properties, setProperties] = useState([]);
            const [loading, setLoading] = useState(true);
            
            useEffect(() => {
                fetch('/api/properties')
                    .then(res => res.json())
                    .then(data => {
                        setProperties(data.properties || []);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('Error loading properties:', err);
                        setLoading(false);
                    });
            }, []);
            
            if (loading) {
                return React.createElement('div', {
                    className: 'min-h-screen gradient-bg flex items-center justify-center text-white'
                }, React.createElement('div', {
                    className: 'text-center'
                }, [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4'
                    }),
                    React.createElement('h2', {
                        key: 'title',
                        className: 'text-2xl font-bold gradient-text'
                    }, '20/20 Realtors'),
                    React.createElement('p', {
                        key: 'loading',
                        className: 'text-gray-300 mt-2'
                    }, 'Loading your dream properties...')
                ]));
            }
            
            return React.createElement('div', {
                className: 'min-h-screen bg-gray-50'
            }, [
                // Header
                React.createElement('header', {
                    key: 'header',
                    className: 'bg-slate-900 text-white py-4 px-6'
                }, React.createElement('div', {
                    className: 'max-w-7xl mx-auto flex items-center justify-between'
                }, [
                    React.createElement('h1', {
                        key: 'logo',
                        className: 'text-2xl font-bold gradient-text'
                    }, '20/20 Realtors'),
                    React.createElement('p', {
                        key: 'tagline',
                        className: 'text-yellow-400 text-sm'
                    }, 'Your Vision, Our Mission')
                ])),
                
                // Hero Section
                React.createElement('section', {
                    key: 'hero',
                    className: 'gradient-bg text-white py-20 px-6'
                }, React.createElement('div', {
                    className: 'max-w-4xl mx-auto text-center'
                }, [
                    React.createElement('h2', {
                        key: 'hero-title',
                        className: 'text-5xl font-bold mb-6'
                    }, 'Find Your Perfect Dream Home'),
                    React.createElement('p', {
                        key: 'hero-subtitle',
                        className: 'text-xl mb-8 opacity-90'
                    }, 'Discover exceptional properties in Orange County\\'s most desirable neighborhoods'),
                    React.createElement('div', {
                        key: 'hero-stats',
                        className: 'grid grid-cols-2 md:grid-cols-4 gap-8 mt-12'
                    }, [
                        React.createElement('div', { key: 'stat1', className: 'text-center' }, [
                            React.createElement('div', { key: 'value1', className: 'text-3xl font-bold text-yellow-400' }, '500+'),
                            React.createElement('div', { key: 'label1', className: 'text-gray-300' }, 'Homes Sold')
                        ]),
                        React.createElement('div', { key: 'stat2', className: 'text-center' }, [
                            React.createElement('div', { key: 'value2', className: 'text-3xl font-bold text-yellow-400' }, '1000+'),
                            React.createElement('div', { key: 'label2', className: 'text-gray-300' }, 'Happy Families')
                        ]),
                        React.createElement('div', { key: 'stat3', className: 'text-center' }, [
                            React.createElement('div', { key: 'value3', className: 'text-3xl font-bold text-yellow-400' }, '15+'),
                            React.createElement('div', { key: 'label3', className: 'text-gray-300' }, 'Years Experience')
                        ]),
                        React.createElement('div', { key: 'stat4', className: 'text-center' }, [
                            React.createElement('div', { key: 'value4', className: 'text-3xl font-bold text-yellow-400' }, '98%'),
                            React.createElement('div', { key: 'label4', className: 'text-gray-300' }, 'Client Satisfaction')
                        ])
                    ])
                ])),
                
                // Properties Section
                React.createElement('section', {
                    key: 'properties',
                    className: 'py-20 px-6'
                }, React.createElement('div', {
                    className: 'max-w-7xl mx-auto'
                }, [
                    React.createElement('div', {
                        key: 'section-header',
                        className: 'text-center mb-16'
                    }, [
                        React.createElement('h2', {
                            key: 'section-title',
                            className: 'text-4xl font-bold text-slate-900 mb-4'
                        }, 'Featured Properties'),
                        React.createElement('p', {
                            key: 'section-subtitle',
                            className: 'text-xl text-slate-600'
                        }, 'Discover handpicked properties in Orange County\\'s most desirable locations')
                    ]),
                    
                    properties.length > 0 ? React.createElement('div', {
                        key: 'properties-grid',
                        className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
                    }, properties.slice(0, 6).map((property, index) => 
                        React.createElement('div', {
                            key: property.id,
                            className: 'bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-200'
                        }, [
                            React.createElement('div', {
                                key: 'image',
                                className: 'relative h-64'
                            }, [
                                React.createElement('img', {
                                    key: 'property-image',
                                    src: property.main_image_url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
                                    alt: property.title,
                                    className: 'w-full h-full object-cover'
                                }),
                                property.is_featured && React.createElement('span', {
                                    key: 'featured-badge',
                                    className: 'absolute top-4 left-4 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold'
                                }, '✨ Featured')
                            ]),
                            React.createElement('div', {
                                key: 'content',
                                className: 'p-6'
                            }, [
                                React.createElement('div', {
                                    key: 'price',
                                    className: 'text-2xl font-bold text-slate-900 mb-2'
                                }, '$' + (property.price / 100).toLocaleString()),
                                React.createElement('div', {
                                    key: 'address',
                                    className: 'text-slate-600 mb-4'
                                }, property.address + ', ' + property.city + ', ' + property.state),
                                React.createElement('div', {
                                    key: 'details',
                                    className: 'flex justify-between text-slate-700 bg-gray-50 rounded-xl p-4'
                                }, [
                                    React.createElement('div', { key: 'beds', className: 'text-center' }, [
                                        React.createElement('div', { key: 'beds-value', className: 'font-bold' }, property.bedrooms),
                                        React.createElement('div', { key: 'beds-label', className: 'text-xs text-slate-500' }, 'beds')
                                    ]),
                                    React.createElement('div', { key: 'baths', className: 'text-center' }, [
                                        React.createElement('div', { key: 'baths-value', className: 'font-bold' }, property.bathrooms),
                                        React.createElement('div', { key: 'baths-label', className: 'text-xs text-slate-500' }, 'baths')
                                    ]),
                                    React.createElement('div', { key: 'sqft', className: 'text-center' }, [
                                        React.createElement('div', { key: 'sqft-value', className: 'font-bold' }, property.square_feet.toLocaleString()),
                                        React.createElement('div', { key: 'sqft-label', className: 'text-xs text-slate-500' }, 'sqft')
                                    ])
                                ])
                            ])
                        ])
                    )) : React.createElement('div', {
                        key: 'no-properties',
                        className: 'text-center py-12'
                    }, [
                        React.createElement('h3', {
                            key: 'no-props-title',
                            className: 'text-2xl font-bold text-slate-900 mb-4'
                        }, 'Properties Loading...'),
                        React.createElement('p', {
                            key: 'no-props-desc',
                            className: 'text-slate-600'
                        }, 'Our featured properties will appear here shortly.')
                    ])
                ])),
                
                // Contact Section
                React.createElement('section', {
                    key: 'contact',
                    className: 'gradient-bg text-white py-20 px-6'
                }, React.createElement('div', {
                    className: 'max-w-4xl mx-auto text-center'
                }, [
                    React.createElement('h2', {
                        key: 'contact-title',
                        className: 'text-4xl font-bold mb-6'
                    }, 'Ready to Find Your Dream Home?'),
                    React.createElement('p', {
                        key: 'contact-subtitle',
                        className: 'text-xl mb-8 opacity-90'
                    }, 'Contact our expert team today for personalized service'),
                    React.createElement('div', {
                        key: 'contact-info',
                        className: 'grid md:grid-cols-3 gap-8'
                    }, [
                        React.createElement('div', { key: 'phone', className: 'text-center' }, [
                            React.createElement('div', { key: 'phone-label', className: 'text-yellow-400 font-semibold mb-2' }, 'Phone'),
                            React.createElement('a', { 
                                key: 'phone-link', 
                                href: 'tel:(714)262-4263',
                                className: 'text-white hover:text-yellow-400 transition-colors'
                            }, '(714) 262-4263')
                        ]),
                        React.createElement('div', { key: 'email', className: 'text-center' }, [
                            React.createElement('div', { key: 'email-label', className: 'text-yellow-400 font-semibold mb-2' }, 'Email'),
                            React.createElement('a', { 
                                key: 'email-link', 
                                href: 'mailto:info@2020realtors.com',
                                className: 'text-white hover:text-yellow-400 transition-colors'
                            }, 'info@2020realtors.com')
                        ]),
                        React.createElement('div', { key: 'address', className: 'text-center' }, [
                            React.createElement('div', { key: 'address-label', className: 'text-yellow-400 font-semibold mb-2' }, 'Address'),
                            React.createElement('div', { key: 'address-text', className: 'text-white' }, '2677 N MAIN ST STE 465, SANTA ANA, CA 92705')
                        ])
                    ])
                ]))
            ]);
        }
        
        const root = createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    </script>
</body>
</html>`;
      
      const headers = new Headers();
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=300');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(workingReactApp, {
        status: 200,
        headers,
      });
    }
    
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Static file serving error:', error);
    
    // Enhanced fallback with better error information
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>20/20 Realtors</title>
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
        }
        h1 { 
            font-size: 3rem; 
            margin-bottom: 20px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        a { color: #fbbf24; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .error-info {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .error-info h3 {
            color: #fbbf24;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>20/20 Realtors</h1>
        <div class="error-info">
            <h3>Static File Serving Issue</h3>
            <p>The React application assets are not loading properly. This usually means:</p>
            <ul>
                <li>Assets haven't been uploaded to KV storage</li>
                <li>KV namespace binding is not configured</li>
                <li>Asset paths don't match the built files</li>
            </ul>
            <p><strong>Solution:</strong> Run <code>npm run deploy</code> to upload assets and redeploy.</p>
        </div>
        <p>Contact us at <a href="tel:(714)262-4263">(714) 262-4263</a></p>
        <p>Email: <a href="mailto:info@2020realtors.com">info@2020realtors.com</a></p>
        <p><strong>API Status:</strong> Backend services are running</p>
        <p><strong>Available endpoints:</strong> /api/properties, /api/agents, /api/auth/*</p>
    </div>
</body>
</html>`;
      
      return new Response(fallbackHtml, { 
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
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

// Upload built assets to KV storage
async function uploadAssetsToKV(env: Env) {
  // This would be called during deployment to upload the built files
  // For now, we'll rely on the dynamic loading approach
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
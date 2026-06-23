import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import routes
import complaintsRoutes from './routes/complaints.js'
import projectsRoutes from './routes/projects.js'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import emailRoutes from './routes/email.js'
import newsletterRoutes from './routes/newsletter.js'
import newsRoutes from './routes/news.js'
import usersRoutes from './routes/users.js'
import activityLogRoutes from './routes/activityLog.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// CORS configuration - Allow Cloudflare Pages and localhost
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc)
    if (!origin) return callback(null, true);
    
    // Allow any *.pages.dev domain (Cloudflare Pages)
    if (origin.endsWith('.pages.dev')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Explicit allowed origins
    const allowedOrigins = [
      'https://litein-municipal.pages.dev',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn('❌ CORS rejected origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Request logging for debugging CORS and API calls
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// Test dashboard stats endpoint (no auth required for debugging)
app.get('/api/test-stats', async (req, res) => {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('🧪 Testing database connection...')
    
    const { count: usersCount, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    console.log('Test - Users count:', usersCount, 'Error:', usersError)

    res.json({
      success: true,
      dbConnected: !usersError,
      usersCount: usersCount || 0,
      error: usersError ? usersError.message : null
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// API routes
app.use('/api/complaints', complaintsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/activity-logs', activityLogRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Litein Municipal Board API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Environment: ${process.env.NODE_ENV || 'development'}
✓ Port: ${PORT}
✓ URL: http://localhost:${PORT}
✓ Health: http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

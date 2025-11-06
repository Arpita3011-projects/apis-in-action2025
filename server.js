require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const videoRoutes = require('./routes/videos');
const authRoutes = require('./routes/auth');
const fallbackVideoRoutes = require('./routes/fallbackVideos');
const fallbackAuthRoutes = require('./routes/fallbackAuth');
const { errorHandler } = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const mockData = require('./data/mockData');

const app = express();
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Make sure port is free
const net = require('net');
const testPort = new Promise((resolve, reject) => {
  const tester = net.createServer()
    .once('error', err => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy - attempting to free it...`);
        require('child_process').exec('taskkill /F /IM node.exe', () => {
          setTimeout(resolve, 1000);
        });
      } else reject(err);
    })
    .once('listening', () => {
      tester.once('close', () => resolve()).close();
    })
    .listen(PORT);
});

// Health check route (before DB connection)
app.get('/', (req, res) => res.json({ 
  success: true, 
  message: 'APIs in Action — Upgraded',
  dbStatus: global.dbConnected ? 'connected' : 'running without database'
}));

// connect db and start server
const startServer = async () => {
  try {
    // Make sure port is free before starting
    await testPort;
  } catch (err) {
    console.error('Failed to secure port:', err);
    process.exit(1);
  }

  // Set up graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    if (global.server) {
      global.server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    if (MONGO_URI) {
      try {
        await connectDB(MONGO_URI);
        global.dbConnected = true;
      } catch (dbError) {
        console.warn('Failed to connect to MongoDB:', dbError.message);
        console.warn('Starting server without database connection...');
        global.dbConnected = false;
      }
    } else {
      console.warn('MONGO_URI not provided — starting without DB connection');
      global.dbConnected = false;
    }
    
    return new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
        global.server = server;
        resolve(server);
      });
      
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use`);
          console.error('Try: taskkill /F /IM node.exe to free the port');
        }
        reject(error);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// routes - will use fallback routes if DB is not connected
app.use('/api/videos', (req, res, next) => {
  if (global.dbConnected) {
    return videoRoutes(req, res, next);
  }
  return fallbackVideoRoutes(req, res, next);
});

app.use('/api/auth', (req, res, next) => {
  if (global.dbConnected) {
    return authRoutes(req, res, next);
  }
  return fallbackAuthRoutes(req, res, next);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

// Start server
startServer().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
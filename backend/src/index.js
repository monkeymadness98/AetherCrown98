require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const logger = require('./utils/logger');
const apiRoutes = require('./api');
const { initScheduledJobs } = require('./services/scheduler');
const { initSecurityMonitoring } = require('./services/security-monitor-init');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize i18next for multi-language support
i18next.init({
  fallbackLng: 'en',
  preload: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
  backend: {
    loadPath: './locales/{{lng}}/translation.json'
  }
});

app.use(i18nextMiddleware.handle(i18next));

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
  logger.info(`AetherCrown98 Backend running on port ${PORT}`);
  
  // Initialize scheduled jobs
  await initScheduledJobs();
  
  // Initialize security monitoring
  if (process.env.ENABLE_SECURITY_MONITORING === 'true') {
    await initSecurityMonitoring();
  }
});

module.exports = app;

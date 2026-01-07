// Simple Node.js server to serve static files for Azure App Service
// This handles SPA routing by serving index.html for all routes

const express = require('express');
const path = require('path');

const app = express();
// Azure App Service provides PORT via environment variable
const PORT = process.env.PORT || 8080;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname)));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server - Azure App Service will manage the process
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle errors gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. This may happen during deployment.`);
    console.error('Azure App Service will restart the server automatically.');
    // Don't exit - let Azure handle the restart
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});


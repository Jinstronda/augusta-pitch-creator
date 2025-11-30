/**
 * Express Server for Pitch.com Automation
 * Spawns Playwright scripts as child processes when triggered from frontend
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { SLIDE_CONFIG } from './config/slides.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Track SSE clients waiting for presentation completion
const statusClients = [];

app.use(express.json());

// Serve static files (index.html, config/slides.js, etc.)
app.use(express.static('.'));

// Enable CORS for localhost
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * POST /api/trigger/:slideType
 * Triggers Playwright automation for the specified slide type
 */
app.post('/api/trigger/:slideType', (req, res) => {
  const { slideType } = req.params;

  // Validate slide type
  if (!SLIDE_CONFIG[slideType]) {
    return res.status(400).json({
      error: 'Invalid slide type',
      validTypes: Object.keys(SLIDE_CONFIG)
    });
  }

  const config = SLIDE_CONFIG[slideType];
  const dataFilePath = config.dataFile;

  console.log('━'.repeat(60));
  console.log(`🚀 Triggering automation for: ${config.displayName}`);
  console.log(`📋 Data file: ${dataFilePath}`);
  console.log('━'.repeat(60));

  // Spawn Playwright process
  const playwrightScript = path.join(__dirname, 'tests', 'run-pitch-existing-browser.js');
  const playwright = spawn('node', [playwrightScript, dataFilePath], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Send immediate response
  res.json({
    status: 'started',
    slideType,
    displayName: config.displayName,
    dataFile: dataFilePath,
    message: 'Playwright automation started. Check server logs for progress.'
  });

  // Stream Playwright output to server console
  playwright.stdout.on('data', (data) => {
    process.stdout.write(`[Playwright] ${data}`);
  });

  playwright.stderr.on('data', (data) => {
    process.stderr.write(`[Playwright Error] ${data}`);
  });

  playwright.on('close', (code) => {
    console.log('━'.repeat(60));
    console.log(`✅ Playwright process exited with code ${code}`);
    console.log('━'.repeat(60));
  });
});

/**
 * POST /api/create-new/:slideType
 * Creates a NEW presentation from dashboard and pastes slide data
 */
app.post('/api/create-new/:slideType', (req, res) => {
  const { slideType } = req.params;

  // Validate slide type
  if (!SLIDE_CONFIG[slideType]) {
    return res.status(400).json({
      error: 'Invalid slide type',
      validTypes: Object.keys(SLIDE_CONFIG)
    });
  }

  const config = SLIDE_CONFIG[slideType];
  const dataFilePath = config.dataFile;

  console.log('━'.repeat(60));
  console.log(`🆕 Creating NEW presentation for: ${config.displayName}`);
  console.log(`📋 Data file: ${dataFilePath}`);
  console.log('━'.repeat(60));

  // Spawn Playwright process with new presentation script
  const playwrightScript = path.join(__dirname, 'tests', 'run-pitch-new-presentation.js');
  const playwright = spawn('node', [playwrightScript, dataFilePath], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Send immediate response
  res.json({
    status: 'started',
    slideType,
    displayName: config.displayName,
    dataFile: dataFilePath,
    message: 'Creating new presentation. Check server logs for progress.'
  });

  // Stream Playwright output to server console
  playwright.stdout.on('data', (data) => {
    process.stdout.write(`[Playwright] ${data}`);
  });

  playwright.stderr.on('data', (data) => {
    process.stderr.write(`[Playwright Error] ${data}`);
  });

  playwright.on('close', (code) => {
    console.log('━'.repeat(60));
    console.log(`✅ Playwright process exited with code ${code}`);
    console.log('━'.repeat(60));
  });
});

/**
 * GET /api/presentation-events
 * Server-Sent Events stream for presentation status
 */
app.get('/api/presentation-events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Add client to list
  statusClients.push(res);
  console.log(`📡 SSE client connected (${statusClients.length} total)`);

  // Send initial connection message
  res.write('data: connected\n\n');

  // Remove client on disconnect
  req.on('close', () => {
    const index = statusClients.indexOf(res);
    if (index !== -1) {
      statusClients.splice(index, 1);
      console.log(`📡 SSE client disconnected (${statusClients.length} remaining)`);
    }
  });
});

/**
 * POST /api/create-all-parallel
 * Creates ALL 3 presentations in parallel (headless)
 */
app.post('/api/create-all-parallel', (req, res) => {
  console.log('━'.repeat(60));
  console.log('🚀 Creating ALL 3 presentations in parallel (headless)');
  console.log('━'.repeat(60));

  // Spawn Playwright batch process
  const playwrightScript = path.join(__dirname, 'tests', 'create-all-presentations-parallel.js');
  const playwright = spawn('node', [playwrightScript], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Send immediate response
  res.json({
    status: 'started',
    message: 'Creating all 3 presentations in parallel. Frontend will be notified when ready.',
    presentations: ['Case Studies', 'PnL', 'Angles']
  });

  // Stream Playwright output to server console
  playwright.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  playwright.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  playwright.on('close', (code) => {
    console.log('━'.repeat(60));
    console.log(`✅ Batch process exited with code ${code}`);
    console.log('━'.repeat(60));

    // Notify all connected clients that presentations are ready
    if (code === 0) {
      console.log(`📡 Notifying ${statusClients.length} SSE clients that presentations are ready`);
      statusClients.forEach(client => {
        client.write('data: ready\n\n');
      });
    }
  });
});

/**
 * POST /api/create-combined-presentation
 * Creates ONE presentation with all 3 slides combined
 */
app.post('/api/create-combined-presentation', (req, res) => {
  console.log('━'.repeat(60));
  console.log('🎯 Creating combined presentation (all 3 slides in one)');
  console.log('━'.repeat(60));

  // Spawn Playwright process
  const playwrightScript = path.join(__dirname, 'tests', 'create-combined-presentation.js');
  const playwright = spawn('node', [playwrightScript], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Send immediate response
  res.json({
    status: 'started',
    message: 'Creating combined presentation. Check server logs for progress.',
    slides: ['Case Studies', 'PnL', 'Angles']
  });

  // Stream Playwright output to server console
  playwright.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  playwright.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  playwright.on('close', (code) => {
    console.log('━'.repeat(60));
    console.log(`✅ Combined presentation process exited with code ${code}`);
    console.log('━'.repeat(60));
  });
});

/**
 * POST /api/create-combined-with-variants
 * Creates ONE presentation with selected slide variants
 */
app.post('/api/create-combined-with-variants', (req, res) => {
  const { variants } = req.body;

  console.log('━'.repeat(60));
  console.log('🎯 Creating combined presentation with selected variants');
  console.log('━'.repeat(60));
  console.log('📋 Variants:', JSON.stringify(variants, null, 2));

  // Map variant IDs to data file paths
  const variantToFile = {
    case_studies: {
      '1slide': 'slides/case_studies1.txt',
      '2slides': 'slides/case_studies2.txt',
      '4slides': 'slides/case_studies4.txt'
    },
    pnl: {
      'default': 'slides/pnl.txt'
    },
    angles: {
      'default': 'slides/angles.txt'
    }
  };

  const dataFiles = {
    caseStudies: variantToFile.case_studies[variants.case_studies] || 'slides/case_studies4.txt',
    pnl: variantToFile.pnl[variants.pnl] || 'slides/pnl.txt',
    angles: variantToFile.angles[variants.angles] || 'slides/angles.txt'
  };

  console.log('📂 Data files:', JSON.stringify(dataFiles, null, 2));

  // Spawn Playwright process with variant files as arguments
  const playwrightScript = path.join(__dirname, 'tests', 'create-combined-with-variants.js');
  const playwright = spawn('node', [
    playwrightScript,
    dataFiles.caseStudies,
    dataFiles.pnl,
    dataFiles.angles
  ], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Send immediate response
  res.json({
    status: 'started',
    message: 'Creating combined presentation with selected variants.',
    variants: dataFiles
  });

  // Stream Playwright output to server console
  playwright.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  playwright.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  playwright.on('close', (code) => {
    console.log('━'.repeat(60));
    console.log(`✅ Combined presentation with variants exited with code ${code}`);
    console.log('━'.repeat(60));
  });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

/**
 * GET /
 * Redirect root to index.html
 */
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.listen(PORT, () => {
  console.log('━'.repeat(60));
  console.log('🚀 Pitch Automation Server Running');
  console.log('━'.repeat(60));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔧 Available endpoints:`);
  console.log(`   POST /api/trigger/:slideType`);
  console.log(`   GET  /health`);
  console.log('');
  console.log(`📋 Valid slide types:`);
  Object.entries(SLIDE_CONFIG).forEach(([key, config]) => {
    console.log(`   - ${key} → ${config.displayName}`);
  });
  console.log('━'.repeat(60));
});

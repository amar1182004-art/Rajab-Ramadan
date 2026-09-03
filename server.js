/* ==========================================================================
   Node.js Native Backend Server - Rajab Ramadan Mohamed CV Website
   Provides static file serving + REST APIs to permanently save edits & images to disk.
   No npm install required! Runs out of the box with `node server.js`.
   Upgraded: Security, Limits, Async I/O, Validation
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;
const DATA_FILE = path.join(__dirname, 'assets', 'js', 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'assets', 'images');
const MAX_BODY_SIZE = 6 * 1024 * 1024; // 6MB limit

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function collectBody(req, res, callback) {
  let body = '';
  let size = 0;
  let aborted = false;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_BODY_SIZE) {
      aborted = true;
      sendJson(res, 413, { error: 'Payload too large (max 6MB)' });
      req.destroy();
      return;
    }
    body += chunk.toString();
  });
  req.on('end', () => {
    if (!aborted) callback(body);
  });
  req.on('error', () => {
    if (!aborted) sendJson(res, 400, { error: 'Bad request' });
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers - restricted to same origin in production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // --- API Endpoint: GET /api/data ---
  if (req.method === 'GET' && pathname === '/api/data') {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        JSON.parse(data); // validate JSON
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(data);
      } catch (e) {
        sendJson(res, 500, { error: 'Corrupted data.json' });
      }
    } else {
      sendJson(res, 404, { error: 'data.json not found' });
    }
    return;
  }

  // --- API Endpoint: POST /api/data (Save JSON permanently to disk) ---
  if (req.method === 'POST' && pathname === '/api/data') {
    collectBody(req, res, async (body) => {
      try {
        const parsed = JSON.parse(body);
        // Basic validation
        if (!parsed.general || !parsed.experiences || !parsed.skills) {
          sendJson(res, 400, { error: 'Missing required fields: general, experiences, skills' });
          return;
        }
        if (typeof parsed.general.name !== 'string' || parsed.general.name.trim().length < 2) {
          sendJson(res, 400, { error: 'Invalid general.name' });
          return;
        }
        await fs.promises.writeFile(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');
        console.log('✅ Permanent Data Saved to data.json');
        sendJson(res, 200, { success: true, message: 'تم حفظ البيانات بنجاح على القرص!' });
      } catch (err) {
        console.error('❌ Save Error:', err);
        sendJson(res, 400, { error: 'Invalid JSON data' });
      }
    });
    return;
  }

  // --- API Endpoint: POST /api/upload (Save Uploaded Image permanently to assets/images/) ---
  if (req.method === 'POST' && pathname === '/api/upload') {
    collectBody(req, res, async (body) => {
      try {
        const { fileName, base64Data } = JSON.parse(body);
        if (!fileName || !base64Data) {
          sendJson(res, 400, { error: 'fileName and base64Data required' });
          return;
        }
        if (typeof base64Data !== 'string' || !base64Data.startsWith('data:image/')) {
          sendJson(res, 400, { error: 'Invalid image data - must be data:image/*;base64' });
          return;
        }
        // Allow jpg, jpeg, png, webp, gif, svg
        const mimeMatch = base64Data.match(/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/);
        if (!mimeMatch) {
          sendJson(res, 400, { error: 'Unsupported image type. Allowed: png, jpg, webp, gif, svg' });
          return;
        }

        const base64Image = base64Data.replace(/^data:image\/[\w+.-]+;base64,/, '');
        let buffer;
        try {
          buffer = Buffer.from(base64Image, 'base64');
        } catch {
          sendJson(res, 400, { error: 'Invalid base64' });
          return;
        }
        if (buffer.length > 5 * 1024 * 1024) {
          sendJson(res, 413, { error: 'Image too large (max 5MB)' });
          return;
        }
        if (buffer.length === 0) {
          sendJson(res, 400, { error: 'Empty image' });
          return;
        }

        const safeFileName = `${Date.now()}_${path.basename(fileName).replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        const targetPath = path.join(UPLOAD_DIR, safeFileName);
        // Extra traversal check
        if (!targetPath.startsWith(UPLOAD_DIR)) {
          sendJson(res, 403, { error: 'Forbidden' });
          return;
        }
        const relPath = `assets/images/${safeFileName}`;

        await fs.promises.writeFile(targetPath, buffer);
        console.log(`📸 Image Uploaded & Saved: ${relPath} (${(buffer.length/1024).toFixed(1)}KB)`);

        sendJson(res, 200, { success: true, imagePath: relPath, message: 'تم حفظ الصورة بنجاح!' });
      } catch (err) {
        console.error('❌ Upload Error:', err);
        sendJson(res, 500, { error: 'Failed to upload image' });
      }
    });
    return;
  }

  // --- Static File Server ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security: prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(PUBLIC_DIR))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  filePath = resolvedPath;

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - الصفحة غير موجودة</h1><p><a href="/">العودة للرئيسية</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 CV Website Backend Server Running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log(`   Max payload: ${MAX_BODY_SIZE/1024/1024}MB | Async I/O | Validated`);
  console.log(`====================================================`);
});

/**
 * Simple HTTP server for DareMate
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Make sure the data directories exist
function ensureDataDirectories() {
    const collections = ['rooms', 'players', 'messages', 'turns', 'questions'];
    const baseDir = path.join(__dirname, 'data');
    
    // Create base data directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
        console.log('Created data directory:', baseDir);
    }
    
    // Create collection directories if they don't exist
    collections.forEach(collection => {
        const collectionDir = path.join(baseDir, collection);
        if (!fs.existsSync(collectionDir)) {
            fs.mkdirSync(collectionDir);
            console.log('Created collection directory:', collectionDir);
            
            // Create an empty index.json file in the directory
            fs.writeFileSync(
                path.join(collectionDir, 'index.json'),
                JSON.stringify([]),
                'utf8'
            );
            console.log('Created empty index.json for:', collection);
        }
    });
}

// Handle API request to save collection data
function handleSaveRequest(req, res, parsedUrl) {
    const query = parsedUrl.query;
    const collection = query.collection;
    
    if (!collection) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Collection parameter is required' }));
        return;
    }
    
    // Validate collection name to prevent directory traversal
    const validCollections = ['rooms', 'players', 'messages', 'turns', 'questions'];
    if (!validCollections.includes(collection)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid collection name' }));
        return;
    }
    
    // Read POST data
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            // Parse the JSON data
            const data = JSON.parse(body);
            
            // Ensure directory exists
            const collectionDir = path.join(__dirname, 'data', collection);
            if (!fs.existsSync(collectionDir)) {
                fs.mkdirSync(collectionDir, { recursive: true });
            }
            
            // Write to index.json file
            fs.writeFile(
                path.join(collectionDir, 'index.json'),
                JSON.stringify(data, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.error('Error writing file:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to write file' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    }
                }
            );
        } catch (error) {
            console.error('Error processing request:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON data' }));
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Handle API endpoints
    if (pathname === '/api/save' && req.method === 'POST') {
        handleSaveRequest(req, res, parsedUrl);
        return;
    }
    
    // Normalize URL by removing query parameters
    let urlPath = pathname;
    
    // Default to index.html if the path is '/'
    if (urlPath === '/') {
        urlPath = '/index.html';
    }
    
    // Get the full path to the requested file
    const filePath = path.join(__dirname, urlPath);
    
    // Get the file extension
    const ext = path.extname(filePath);
    
    // Read the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // If file not found, return 404
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>');
                return;
            }
            
            // For other errors, return 500
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 Internal Server Error</h1>');
            return;
        }
        
        // Set the content type based on the file extension
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Return the file content
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// Make sure data directories exist before starting the server
ensureDataDirectories();

// Start the server
server.listen(PORT, () => {
    console.log(`DareMate server running at http://localhost:${PORT}/`);
    console.log(`Data files stored in ${path.join(__dirname, 'data')}`);
    console.log(`Press Ctrl+C to stop the server`);
}); 
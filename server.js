const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { createClient } = require('redis');
const helmet = require('helmet');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public folder
app.use(helmet());

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});

// Apply the rate limiting middleware to all requests
app.use(limiter);


// Connect to Redis
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
redisClient.connect();
  

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Helper functions
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'defaultEncryptionKey';

function encryptSecret(secret) {
  const cipher = crypto.createCipher('aes-256-ctr', ENCRYPTION_SECRET);
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptSecret(encrypted) {
  const decipher = crypto.createDecipher('aes-256-ctr', ENCRYPTION_SECRET);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


// Create a secret
app.post('/create-secret', async (req, res) => {
    try {
      const { secret, expiration } = req.body;
      const token = generateToken();
      const encryptedSecret = encryptSecret(secret);
  
      // Store secret in Redis with expiration time (in seconds)
      await redisClient.setEx(token, expiration, encryptedSecret);
  
      res.json({ url: `https://yourapp.onrender.com/secret/${token}` });
    } catch (error) {
      console.error('Error creating secret:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Access a secret
app.get('/secret/:token', async (req, res) => {
  const token = req.params.token;
  const encryptedSecret = await redisClient.get(token);

  if (!encryptedSecret) {
    return res.status(404).send('Secret not found or expired');
  }

  const secret = decryptSecret(encryptedSecret);
  await redisClient.del(token);  // Delete secret after one-time access

  res.send(`<p>Your secret: ${secret}</p>`);
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


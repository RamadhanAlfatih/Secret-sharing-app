const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { createClient } = require('redis');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public folder

// Connect to Redis
const redisClient = createClient({
  url: 'redis://localhost:6379',  // Default Redis port
});
redisClient.connect();

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Helper functions
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

function encryptSecret(secret) {
  const cipher = crypto.createCipher('aes-256-ctr', 'encryptionSecretKey');
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptSecret(encrypted) {
  const decipher = crypto.createDecipher('aes-256-ctr', 'encryptionSecretKey');
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Create a secret
app.post('/create-secret', async (req, res) => {
  const { secret, expiration } = req.body;
  const token = generateToken();
  const encryptedSecret = encryptSecret(secret);

  // Store secret in Redis with expiration time (in seconds)
  await redisClient.setEx(token, expiration, encryptedSecret);

  res.json({ url: `http://localhost:3000/secret/${token}` });
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
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

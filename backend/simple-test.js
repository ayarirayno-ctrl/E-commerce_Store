const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

console.log('📝 Starting to define routes...');

// Test route 1
app.post('/test', (req, res) => {
  console.log('🎯 POST /test hit');
  res.json({ success: true, message: 'Test endpoint' });
});

// Test route 2
app.post('/api/register', (req, res) => {
  console.log('🎯 POST /api/register hit');
  res.json({ success: true, message: 'Register endpoint' });
});

// Test route 3
app.post('/api/client-auth/register', (req, res) => {
  console.log('🎯 POST /api/client-auth/register hit');
  const { name, email, password } = req.body;
  console.log('Data received:', { name, email, passwordLength: password?.length });
  res.json({ success: true, user: { name, email } });
});

console.log('✅ Routes defined');

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ Ready for requests');
});
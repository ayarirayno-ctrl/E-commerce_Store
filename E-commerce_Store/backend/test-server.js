import express from 'express';

const app = express();
const PORT = 5000;

app.get('/test', (req, res) => {
  res.json({ message: 'Server works!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

// Keep alive
setInterval(() => {
  console.log('Server still running...');
}, 5000);

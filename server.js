require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.LOGIN_PASSWORD || '';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
  const password = (req.body && req.body.password) || '';
  if (!PASSWORD) {
    return res.status(500).send('Server misconfigured: LOGIN_PASSWORD not set.');
  }
  if (password === PASSWORD) {
    return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  }
  return res.status(401).send('Invalid password. <a href="/">Try again</a>');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

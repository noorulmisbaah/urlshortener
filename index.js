require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  dns.lookup(req.body.url, (err, address, family) => {
    if (err)
      res.json({ error: 'Invalid URL' })
    else {
      res.json({ "original_url": req.body.url, "short_url": family });
    }
   })
});

app.get('/api/shorturl/:short_url', (req, res) => {
  console.log(req.url)
  res.redirect('https://forum.freecodecamp.org/');
});

app.use((req, res) => {
  res.json({ error: 'Invalid URL' });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

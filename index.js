require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const fs = require('fs');
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
  const url = req.body.url;
  const urlObject = new URL(url);

  dns.lookup(urlObject.host, (err, address, family) => {
    //Checks if there is an error or if the URL is invalid
    if (err || !address)
      res.json({ "error": "invalid url" });
    else {
      //Writes the URL in a file called url.json
      fs.writeFileSync('./url.json', JSON.stringify({ original_url: req.body.url }));
      res.json({ "original_url": req.body.url, "short_url": family });
    }
  });
});

app.get('/api/shorturl/:short', (req, res) => {
  //Checks if there is a valid URL in the url.json file
  try {
    const url = JSON.parse(fs.readFileSync('./url.json')).original_url;
    res.redirect(url);
  } catch (e) {
    res.json({ "error": "invalid url" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

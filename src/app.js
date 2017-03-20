const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const apiRoutes = require('./server/apiRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'public')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use('/api', apiRoutes);

const server = app.listen(9000, function () {
    console.log('Server is running..');
});

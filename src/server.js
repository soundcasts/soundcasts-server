const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./routes.js');

// Configure app
var app = express();
app.use(bodyParser.json());
app.use(routes);
app.use(express.static('static'));
app.set('port', (process.env.PORT || 3001));
app.set('trust proxy', true);

// Start server
app.listen(app.get('port'), function() {
  console.log(`server started on port ${app.get('port')}`);
});

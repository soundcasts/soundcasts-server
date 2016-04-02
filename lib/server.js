import bodyParser from 'body-parser';
import express from 'express';

import routes from './routes.js';


// configure app
var app = express();
app.use(bodyParser.json());
app.use(routes);
app.use(express.static('static'));
app.set('port', (process.env.PORT || 3001));
app.set('trust proxy', 'loopback');


// start server
app.listen(app.get('port'), function() {
  console.log(`server started on port ${app.get('port')}`);
});

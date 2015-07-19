import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import routes from './routes.js';


// configure app
var app = express();
app.set('port', (process.env.PORT || 3001));
app.use(bodyParser.json());
app.use(routes);


// connect to mongodb
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/soundcasts');


// start server
var server = app.listen(app.get('port'), function() {
  console.log(`app listening on ${app.get('port')}`);
});

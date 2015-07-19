import {Router} from 'express';

import SoundCloud from './SoundCloud.js';
import Soundcast from './Soundcast.js';
import CONSTANTS from './constants.js';


var router = Router();
export default router;


router.get('/', function(req, res, next) {
  var sc = new SoundCloud(clientId);
  res.send(sc);
});


router.get('/search', (req, res) => {
  var sc = new SoundCloud(CONSTANTS.CLIENT_ID);
  var query = req.query.query;
  sc.searchUsers(query)
    .then((data) => {
      console.log('found', data.length, 'users');
      res.send(data);
    })
    .catch(err => {
      console.log(err.stack);
    });
});


router.post('/soundcasts', (req, res) => {
  console.log(req.body);
  var sc = new SoundCloud(CONSTANTS.CLIENT_ID);
  var soundcast = new Soundcast(req.body);

  soundcast
    .save()
    .then(() => soundcast.update())
    .then(() => {
      res.send(soundcast);
    });
});


router.get('/soundcasts/:id.xml', (req, res) => {
  Soundcast
    .findOne({ _id: req.params.id })
    .exec()
    .then((soundcast) => {
      if (!soundcast) return res.status(404).send({ error: 'not found' });
      if (soundcast.needsUpdate()) return soundcast.update();
      return soundcast;
    }, error)
    .then((soundcast) => {
      res.set('Content-Type', 'application/xml').send(soundcast.toXml());
    }, error);
});


router.get('/soundcasts/:id', (req, res) => {
  Soundcast
    .findOne({ _id: req.params.id })
    .exec()
    .then((soundcast) => {
      if (!soundcast) return res.status(404).send({ error: 'not found' });
      res.send(soundcast);
    }, error);
});


router.get('/soundcasts/:soundcastId/tracks/:trackId.*', (req, res) => {
  Soundcast
    .findOne({ _id: req.params.soundcastId })
    .exec()
    .then((soundcast) => {
      var track = soundcast.tracks.id(req.params.trackId);
      res.status(301).set('Location', track.url).send({ moved: 'true' });
    })
});


function error(err) {
  console.log(err);
}

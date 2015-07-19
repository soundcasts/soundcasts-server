import {Router} from 'express';

import SoundCloud from './SoundCloud.js';
import Soundcast from './Soundcast.js';
import CONSTANTS from './constants.js';


var router = Router();
export default router;

var soundCloud = new SoundCloud(CONSTANTS.CLIENT_ID);


router.get('/', function(req, res) {
  res.send('hello world');
});


router.get('/search', (req, res) => {
  var query = req.query.query;
  soundCloud.searchUsers(query)
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      console.log(err.stack);
    });
});


router.post('/soundcasts', (req, res) => {
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
    });
});


function error(err) {
  console.log(err);
}

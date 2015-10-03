'use strict';

import {Router} from 'express';

import SoundCloud from './SoundCloud';
import Soundcast from './Soundcast';
import CONSTANTS from './constants';

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

router.get('/soundcasts', (req, res) => {
  Soundcast
    .find({})
    .select('title userId regexString')
    .then((soundcasts) => {
      res.send(soundcasts);
    });
});

router.get('/soundcast', (req, res) => {
  var q = req.query;
  if (q.title && q.userId && q.regexString) {
    var options = {
      title: q.title,
      userId: q.userId,
      regexString: q.regexString
    };

    Soundcast
      .findOne(options)
      .then((soundcast) => {
        if (!soundcast) {
          soundcast = new Soundcast(options);
          return soundcast.save();
        }
        else return soundcast;
      })
      .then((soundcast) => {
        if (soundcast.needsUpdate()) return soundcast.update();
        else return soundcast;
      })
      .then((soundcast) => {
        res.set('Content-Type', 'application/xml').send(soundcast.toXml());
      });
  }
  else res.status(400).send({ error: 'you must specify a title (String), userId (Number), and regexString (String)'});
});

router.get('/:id.json', (req, res) => {
  Soundcast
    .findOne({ _id: req.params.id })
    .exec()
    .then((soundcast) => {
      res.send(soundcast);
    });
});

router.get('/:id', (req, res) => {
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

router.get('/:soundcastId/tracks/:trackId.*', (req, res) => {
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

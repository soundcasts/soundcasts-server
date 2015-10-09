import {Router} from 'express';

import CONSTANTS from './constants';
import Soundcast from './Soundcast';
import SoundCloud from './SoundCloud';
import {makeUrl} from './util';


var router = Router();
export default router;


router.use((req, res, next) => {
  console.log(makeUrl(req));
  next();
});


router.get('/soundcast.xml', async (req, res) => {
  try {
    var soundcast = new Soundcast(req);
    await soundcast.getChannelData();
    res.set('Content-Type', 'application/xml').send(soundcast.toXml());
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});


router.get('/soundcast.json', async (req, res) => {
  try {
    var soundcast = new Soundcast(req);
    await soundcast.getChannelData();
    res.send(soundcast.channel);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});


router.get('/track/:url/track.*', (req, res) => {
  res.status(301).set('Location', req.params.url).send({ moved: 'true' });
});

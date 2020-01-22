const { Router } = require('express');

const { getSoundcast, soundcastToXml } = require('./soundcast.js');
const { makeUrl } = require('./util.js');

const router = Router();

router.use((req, res, next) => {
  console.log(makeUrl(req));
  next();
});

router.get('/soundcast.xml', (req, res) => {
  Promise.resolve()
    .then(() => getSoundcast(req.query))
    .then(soundcast => (
      res
        .set('Content-Type', 'application/xml')
        .send(soundcastToXml(soundcast, req))
    ))
    .catch(err => res.status(400).send({ error: err.message }));
});

router.get('/soundcast.json', (req, res) => {
  Promise.resolve()
    .then(() => getSoundcast(req.query))
    .then(soundcast => res.send(soundcast))
    .catch(err => res.status(400).send({ error: err.message }));
});

router.get('/track.*', (req, res) => {
  const url = decodeURIComponent(req.query.url);
  res.status(301).set('Location', url).send({ moved: true });
});

module.exports = router;

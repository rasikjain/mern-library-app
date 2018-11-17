/* eslint-disable wrap-iife */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
const express = require('express');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');

debug.enabled = true;
const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp').post((req, res) => {
    // Create User
    const { username, password } = req.body;
    const url = 'mongodb://localhost:27017';
    const dbName = 'LibraryApp';

    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('connected to mongodb');
        const db = client.db(dbName);
        const col = await db.collection('users');
        const user = { username, password };
        const results = await col.insertOne(user);
        debug(results);

        req.login(results.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    })();
  });

  authRouter
    .route('/signIn')
    .get((req, res) => {
      res.render('signIn', { nav, title: 'Sign In' });
    })
    .post(
      passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/'
      })
    );

  authRouter
    .route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      debug(req.user);
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;

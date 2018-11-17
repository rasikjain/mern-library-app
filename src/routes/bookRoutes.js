/* eslint-disable wrap-iife */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
const express = require('express');
const debug = require('debug')('app:bookRoutes');
const { MongoClient, ObjectID } = require('mongodb');

debug.enabled = true;
const bookRouter = express.Router();

function router(nav) {
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  bookRouter.route('/').get((req, res) => {
    (async function query() {
      const url = 'mongodb://localhost:27017';
      const dbName = 'LibraryApp';
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('connected to mongodb');
        const db = client.db(dbName);
        const col = await db.collection('books');
        const books = await col.find().toArray();
        res.render('bookListView', {
          title: 'Library',
          nav,
          books
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    })();
  });

  bookRouter
    .route('/:id')
    .all((req, res, next) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'LibraryApp';

      (async function query() {
        const { id } = req.params;
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected to mongodb');
          const db = await client.db(dbName);
          const col = await db.collection('books');
          const book = await col.findOne({ _id: new ObjectID(id) });
          req.book = book;
        } catch (err) {
          debug(err.stack);
        }
        client.close();
        next();
      })();
    })
    .get((req, res) => {
      res.render('bookView', {
        title: 'Library',
        nav,
        book: req.book
      });
    });

  return bookRouter;
}

module.exports = router;

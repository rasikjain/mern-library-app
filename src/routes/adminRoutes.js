/* eslint-disable wrap-iife */
const express = require('express');
const debug = require('debug')('app:adminRoutes');
const { MongoClient } = require('mongodb');

const adminRouter = express.Router();

const books = [
  {
    title: 'RandomTitle',
    genre: 'Random Genre',
    author: 'Random Author',
    read: false
  },
  {
    title: 'RandomTitle1',
    genre: 'Random Genre1',
    author: 'Random Author1',
    read: false
  },
  {
    title: 'RandomTitle2',
    genre: 'Random Genre2',
    author: 'Random Author2',
    read: false
  }
];

function router(nav) {
  adminRouter.route('/').get((req, res) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'LibraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('connected to mongodb');
        const db = client.db(dbName);
        const response = await db.collection('books').insertMany(books);
        res.json(response);
      } catch (err) {
        debug('error in inserting books');
        debug(err);
        client.close();
      }
      client.close();
    })();
  });

  return adminRouter;
}

module.exports = router;

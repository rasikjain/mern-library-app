const debug = require('debug')('app:bookController');
const { MongoClient, ObjectID } = require('mongodb');

/* eslint-disable wrap-iife */
function bookController(bookService, nav) {
  function middlewareCheckAuth(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'LibraryApp';

    (async function query() {
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
  }

  function getById(req, res) {
    res.render('bookView', {
      title: 'Library',
      nav,
      book: req.book
    });
  }

  function getBookDetails(req, res, next) {
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
        book.details = await bookService.getBookById(book.bookId);

        req.book = book;
      } catch (err) {
        debug(err.stack);
      }
      client.close();
      next();
    })();
  }

  return {
    middlewareCheckAuth,
    getIndex,
    getById,
    getBookDetails
  };
}

module.exports = bookController;

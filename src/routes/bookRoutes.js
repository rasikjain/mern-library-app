/* eslint-disable wrap-iife */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

debug.enabled = true;
const bookRouter = express.Router();

function router(nav) {
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
  bookRouter.route('/').get((req, res) => {
    (async function query() {
      const request = new sql.Request();
      const result = await request.query('Select * From Books');
      // debug(result);
      res.render('bookListView', {
        title: 'Library',
        nav,
        books: result.recordset
      });
    })();
  });

  bookRouter.route('/:id').get((req, res) => {
    const { id } = req.params;

    res.render('bookView', {
      title: 'Library',
      nav,
      book: books[id]
    });
  });

  return bookRouter;
}

module.exports = router;

/* eslint-disable linebreak-style */
const express = require('express');

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
    res.render('bookListView', {
      title: 'Library',
      nav,
      books
    });
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

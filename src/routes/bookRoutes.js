/* eslint-disable wrap-iife */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
const express = require('express');
const bookController = require('../controllers/bookController');

const bookRouter = express.Router();
const bookService = require('../services/goodreadsService');

function router(nav) {
  const {
    middlewareCheckAuth,
    getIndex,
    getById,
    getBookDetails
  } = bookController(bookService, nav);

  bookRouter.use(middlewareCheckAuth);
  bookRouter.route('/').get(getIndex);

  bookRouter
    .route('/:id')
    .all(getBookDetails)
    .get(getById);

  return bookRouter;
}

module.exports = router;

/* eslint-disable wrap-iife */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
const express = require('express');
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController');

debug.enabled = true;
const bookRouter = express.Router();

function router(nav) {
  const { middlewareCheckAuth, getIndex, getById, getUser } = bookController(
    nav
  );

  bookRouter.use(middlewareCheckAuth);
  bookRouter.route('/').get(getIndex);

  bookRouter
    .route('/:id')
    .all(getUser)
    .get(getById);

  return bookRouter;
}

module.exports = router;

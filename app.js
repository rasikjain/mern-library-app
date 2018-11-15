/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: '...',
  password: '...',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  database: '...',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch((err) => {
  debug(err);
});
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));

app.use(
  '/css',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/jquery/dist'))
);
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/authors', title: 'Authors' },
  { link: '/books', title: 'Books' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Library',
    nav: [
      { link: '/author', title: 'Authors' },
      { link: '/books', title: 'Books' }
    ]
  });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});

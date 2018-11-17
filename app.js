/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
const bodyParser = require('body-parser');
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

debug.enabled = true;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));
require('./src/config/passport.js')(app);

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
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

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

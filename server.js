require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME || 'budgetbuddy',
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET || 'pikachu_i_choose_you',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

mongoose.connection.once('open', () => {
  const db = mongoose.connection.db; // native driver handle for db.collection(...)
  require('./app/routes.js')(app, passport, db);

  app.listen(PORT, () => {
    console.log('✅ Mongo connected');
    console.log('🚀 http://localhost:' + PORT);
  });
});
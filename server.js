// server.js
require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const connectToMongo = require('./config/database');

const PORT = process.env.PORT || 8080;

// lightweight health endpoint so Railway health checks pass even before DB mounts
app.get('/health', (_req, res) => res.status(200).send('ok'));

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

(async () => {
  try {
    const conn = await connectToMongo();
    console.log('✅ MongoDB connected successfully.');

    const db = conn.db; // native handle for db.collection(...)
    require('./app/routes.js')(app, passport, db);

    app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err?.message || err);
    process.exit(1);
  }
})();

// basic hardening from ChatGPT to help troucleshoot unhandled errors
process.on('unhandledRejection', (e) => console.error('UnhandledRejection:', e));
process.on('uncaughtException', (e) => { console.error('UncaughtException:', e); process.exit(1); });
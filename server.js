
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

// Lightweight health endpoint so Railway health checks pass even before DB mounts from ChatGPT
app.get('/health', (_req, res) => res.status(200).send('ok'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(session({
  secret: process.env.SESSION_SECRET || 'aurahaus_session_secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);


app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
app.post('/login',
  passport.authenticate('local-login', {
    successRedirect: '/projects',
    failureRedirect: '/login',
    failureFlash: true
  })
);
app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));
app.post('/signup',
  passport.authenticate('local-signup', {
    successRedirect: '/projects',
    failureRedirect: '/signup',
    failureFlash: true
  })
);
app.get('/logout', (req, res) => { req.logout(() => {}); res.redirect('/'); });


app.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/projects');
  return res.render('index.ejs', { message: req.flash('loginMessage') });
});

(async () => {
  try {
    const conn = await connectToMongo(); // returns mongoose.connection
    console.log('✅ MongoDB connected successfully.');

    const db = conn.db; 

    require('./app/routes.js')(app, passport, db);

    app.listen(PORT, () => {
      console.log(`🖤 AURAHAUS running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err?.message || err);
    process.exit(1);
  }
})();

// Global error handlers from Google AI suggestions
process.on('unhandledRejection', (e) => console.error('UnhandledRejection:', e));
process.on('uncaughtException', (e) => { console.error('UncaughtException:', e); process.exit(1); });
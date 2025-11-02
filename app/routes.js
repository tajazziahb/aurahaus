const { ObjectId } = require('mongodb');

module.exports = function (app, passport, db) {

  // Transaction Routes

  // Home - show all transactions
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  // Profile - show user profile
  app.get('/profile', isLoggedIn, (req, res) => {

    // get last 10 transactions for this user
    db.collection('transactions').find({ userId: String(req.user._id) }).sort({ date: -1 }).limit(10).toArray((err, transactions) => {
      if (err) {
        console.error(err);
        return res.render('profile.ejs', { user: req.user, transactions: [] });
      }
      res.render('profile.ejs', { user: req.user, transactions: transactions });
    });
  });

  // Logout - log the user out
  app.get('/logout', (req, res) => {
    req.logout(() => {
      console.log('User logged out');
    });
    res.redirect('/');
  });

  // Transactions API 

// Create transaction
app.post('/transactions', isLoggedIn, (req, res) => {
  const { type, amount, category, date, note } = req.body;
  const doc = {
    userId: String(req.user._id),
    type: type,
    amount: parseFloat(amount),
    category,
    date: new Date(date),
    note: note || '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.collection('transactions').insertOne(doc, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating transaction');
    }
    res.redirect('/profile');
  });
})

// List transactions for logged-in user
app.get('/transactions', isLoggedIn, (req, res) => {
  db.collection('transactions').find({ userId: String(req.user._id) }).sort({ date: -1 }).toArray((err, transactions) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving transactions');
    }
    res.json(transactions);
  });
});

// Update transaction (POST to keep it simple for form methods)
app.post('/transactions/:id', isLoggedIn, (req, res) => {
  const id = req.params.id;
  const { type, amount, category, date, note } = req.body;
  const updatedDoc = {
    type,
    amount: parseFloat(amount),
    category,
    date: new Date(date),
    note: note || '',
    updatedAt: new Date()
  };

  db.collection('transactions').findOneAndUpdate({ _id: new ObjectId(id), userId: String(req.user._id) }, { $set: updatedDoc }, { returnDocument: 'after' }, (err, result) => {
    if (err) return res.status(500).send('Error updating transaction');
    if (!result.value) return res.status(404).send('Transaction not found');
    res.redirect('/profile');
  });
});

// Delete transaction
app.post('/transactions/:id/delete', isLoggedIn, (req, res) => {
  const id = req.params.id;
  db.collection('transactions').deleteOne({ _id: new ObjectId(id), userId: String(req.user._id) }, (err, result) => {
    if (err) return res.status(500).send('Error deleting transaction');
    if (result.deletedCount === 0) return res.status(404).send('Transaction not found');
    res.redirect('/profile');
  });
});

// Auth local
app.get('/login', (req, res) => {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

// Auth signup
app.get('/signup', (req, res) => {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// Unlink local 
app.get('/unlink/local', isLoggedIn, (req, res) => {
  const user = req.user;
  user.local.email = undefined;
  user.local.password = undefined;
  user.save(() => {
    res.redirect('/profile');
  });
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
}


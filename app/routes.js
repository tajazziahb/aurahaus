const { ObjectId } = require('mongodb');

module.exports = function (app, passport, db) {
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    res.redirect('/');
  }

  // Save project 
  app.post('/projects', (req, res) => {
    const { title, description, cost, category, date } = req.body;
    db.collection('projects').save({
      userId: String(req.user._id),
      title,
      description,
      cost: parseFloat(cost) || 0,
      category,
      date: new Date(date),
      createdAt: new Date(),
      updatedAt: new Date()
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })
  // Home
  app.get('/', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/profile');
    res.render('index.ejs');
  });

  // AuraHaus Dashboard (profile)
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const userId = String(req.user._id);
      const projects = await db.collection('projects')
        .find({ userId })
        .sort({ updatedAt: -1 })
        .toArray();

      const totals = projects.reduce((acc, p) => {
        acc.count += 1;
        acc.sum += Number(p.cost || 0);
        const s = p.status || 'planned';
        acc.status[s] = (acc.status[s] || 0) + 1;
        return acc;
      }, { count: 0, sum: 0, status: {} });

      res.render('profile.ejs', {
        user: req.user,
        projects,
        totals
      });
    } catch (e) {
      console.error(e);
      res.render('profile.ejs', { user: req.user, projects: [], totals: { count: 0, sum: 0, status: {} } });
    }
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.logout(() => { });
    res.redirect('/');
  });

  // Create 
  app.post('/projects', isLoggedIn, async (req, res) => {
    const { title, type, status, cost, startDate, dueDate, description } = req.body;
    try {
      await db.collection('projects').insertOne({
        userId: String(req.user._id),
        title: (title || '').trim(),
        type: type || 'maintenance',
        status: status || 'planned',
        cost: parseFloat(cost || 0),
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        description: (description || '').trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      res.redirect('/profile');
    } catch (e) {
      console.error(e);
      res.redirect('/profile');
    }
  });

  // Update
  app.post('/projects/:id/update', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const { title, type, status, cost, startDate, dueDate, description } = req.body;
    try {
      await db.collection('projects').findOneAndUpdate(
        { _id: new ObjectId(id), userId: String(req.user._id) },
        {
          $set: {
            title: (title || '').trim(),
            type: type || 'maintenance',
            status: status || 'planned',
            cost: parseFloat(cost || 0),
            startDate: startDate ? new Date(startDate) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            description: (description || '').trim(),
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.redirect('/profile');
    }
  });

  // Delete
  app.post('/projects/:id/delete', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    try {
      await db.collection('projects').findOneAndDelete({ _id: new ObjectId(id), userId: String(req.user._id) });
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.redirect('/profile');
    }
  });

  app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/unlink/local', isLoggedIn, function (req, res) {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function () {
      res.redirect('/profile');
    });
  });

  app.get('/projects', isLoggedIn, (req, res) => res.redirect('/profile'));
};
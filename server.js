let express = require('express');
let passport = require('passport');
let {mongoConnect, Users} = require('./connect');
let ejs = require('ejs');
let app = express()
let {initializingPassport, isAuthenticated} = require('./passportConfig');
let expressSession = require('express-session');

let PORT = 3000;

initializingPassport(passport);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({  secret: 'secret', resave: false, saveUninitialized: false, cookie: { secure: false } }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

// ======== Home Section for test API
app.get('/', (req, res) => {
	res.render('index')
})

app.get('/register', (req, res) => {
	res.render('register')
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.get('/error', (req, res) => {
	res.render('error')
})

app.get('/success', (req, res) => {
  const userData = req.user;
  res.render('success', { user: userData });
})

app.get('/profile', isAuthenticated, (req, res) => {
  const userData = req.user;
  res.render('profile', { user: userData });
})

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
})

// ======== Registration API
app.post('/register', async (req, res) => {
    try {
	    const userData = req.body;
    	const user = await Users.find({'username': userData.username});
    	if(user.length > 0) {
	    	res.status(400).send('user already exists');
	    } else {
	    	const register = new Users(userData);
	        await register.save();
	        res.status(201).send('user created successfully');
	    }
    }
    catch (err) {
        res.send('user not created, try again.' + err);
    }
});

// ======== Login API
app.post('/login',  passport.authenticate('local', {failureRedirect: "/error", successRedirect: '/success'}));

app.listen(PORT, () => {
	console.log(`server are running on ${PORT}`);
})
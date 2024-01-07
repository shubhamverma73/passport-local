/*
https://www.passportjs.org/packages/
https://www.passportjs.org/packages/passport-local/
*/

var LocalStrategy = require('passport-local').Strategy
let {Users} = require('./connect');

exports.initializingPassport = (passport) => {

	passport.use(new LocalStrategy(async(username, password, done) => {
		try {

			const user = await Users.findOne({'username': username});
			if (!user) { return done(null, false); }
			if (user.password !== password) { return done(null, false); }
			return done(null, user);

		} catch(error) {
			return done(error, false);
		}
	}));


	passport.serializeUser(function(user, done) {
		//console.log('user.id', user.id)
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await Users.findById(id)
			//console.log('user', user)
			done(null, user);
		} catch(error) {
			done(err, false);
		}
	});
}

exports.isAuthenticated = (req, res, next) => {
	//if(req.isAuthenticated()) return next();
	if(req.user) return next();
	res.redirect('/login')
}
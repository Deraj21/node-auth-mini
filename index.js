const express = require('express');
const session = require('express-session');
require('dotenv').config();
const passport = require('passport');
const strategy = require('./strategy');
let { SECRET } = process.env;

const app = express();
app.use( session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( strategy );

passport.serializeUser( function(user, done){
  let { id, displayName, nickName, emails } = user;
  done(null, { id, displayName, nickName, email: emails[0].value });
} );

passport.deserializeUser( function(obj, done){
  done(null, obj);
} );

const config = { successRedirect: '/me', failureRedirect: '/login', failureFlash: true };
app.get('/login', passport.authenticate('auth0', config) );
app.get('/me', (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    res.status(200).send(req.user);
  } else {
    res.redirect('/login');
  }
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
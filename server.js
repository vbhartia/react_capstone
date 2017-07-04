
const mongoose = require('mongoose');
const express = require('express');
const mongo = require('mongo');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {PORT, DATABASE_URL, AWSID, AWSSECRET, AWSTAG} = require('./config');
const {User} = require('./models');
const router = express.Router();
const {BasicStrategy} = require('passport-http')
const validator = require('validator');
const isEmpty = require('lodash/isEmpty');
const bcrypt = require('bcrypt');

const app = express();
mongoose.Promise = global.Promise;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.static('build'));

app.use(jsonParser);
app.use(morgan('common'));

app.post('/signup', (req, res) => {
    console.log('signup')

    if (!req.body) {
      res.statusMessage = "No request body";
      return res.status(400).end();
    }

    var {username, email, password, passwordConfirmation} = req.body;
            console.log('req.body', req.body)

    if (!('username' in req.body)) {
      res.statusMessage = "Incorrect field: username";
      return res.status(422).end();
    }

    if (typeof username !== 'string') {
      res.statusMessage = "Incorrect field type: username";
      return res.status(422).end();
    }

    username = username.trim();

    if (username === '') {
      res.statusMessage = "Missing field: username";
      return res.status(422).end();
    }

    if (!(email)) {
      res.statusMessage = "Missing field: email";
      return res.status(422).end();
    return res.status(422).send('Missing field: email');
    }

    if (typeof email !== 'string') {
      res.statusMessage = "Incorrect field type: email";
      return res.status(422).end();
    }

    email = email.trim();

    if (email === '') {
      res.statusMessage = "Missing field: email";
      return res.status(422).end();
    }

    if (!(password)) {
      res.statusMessage = "Missing field: password";
      return res.status(422).end();
    }

    if (typeof password !== 'string') {
      res.statusMessage = "Incorrect field type: password";
      return res.status(422).end();
    }

    password = password.trim();

    if (password === '') {
      res.statusMessage = "Missing field: password";
      return res.status(422).end();
    }

    if (!(passwordConfirmation)) {
      res.statusMessage = "Missing field: confirm password";
      return res.status(422).end();
    }

    if (typeof passwordConfirmation !== 'string') {
      res.statusMessage = "Incorrect field type: confirm password";
      return res.status(422).end();
    }

    passwordConfirmation = passwordConfirmation.trim();

    if (passwordConfirmation === '') {
      res.statusMessage = "Missing field: confirm password";
      return res.status(422).end();
    }

    if (password !== passwordConfirmation) {
      res.statusMessage = "password must match";
      return res.status(422).end();
    }
    // check for existing user
    return User
    .find({email})
    .count()
    .exec()
    .then(count => {

      if (count > 0) {
        res.statusMessage = "email already taken";
        return res.status(422).end();
      }
      // if no existing user, hash password
      return User.hashPassword(password)
    }).then(hash => {
      return User
        .create({
          username: username,
          password: hash,
          email: email
        })
    }).then(user => {
      console.log('user', user)
      return res.status(201).json(user.apiRepr());
    }).catch(error => {
      res.statusMessage = "Internal server error";
      return res.status(500).end();
    });
});


const basicStrategy = new BasicStrategy({ disableBasicChallenge: true },function(username, password, callback) {
    console.log('username', username, 'password', password);
  let user;

  User
    .findOne({ $or:[{'username': username}, {'email':username}] })
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      console.log('user', user);
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});

passport.use(basicStrategy);
app.use(passport.initialize());

app.post('/login',
  passport.authenticate(
    'basic',
    {session: false}),
    (req, res) => res.json({user: req.user.apiRepr()})
);


var amazon = require('amazon-product-api');
var client = amazon.createClient({
  awsId: AWSID,
  awsSecret: AWSSECRET,
  awsTag: AWSTAG
});

app.get('/amazon/:search_text', function(req, res){
  var keywords = req.params.search_text;
    console.log('params', req.params)
  var page = req.query.page;
    console.log('page', parseInt(req.query.page));
  if (page === '') {
    page = 1;
  } else {
    page = parseInt(page);
  }
  console.log(keywords, page);

  client.itemSearch({
    keywords: req.params.search_text,
    searchIndex: 'All',
    responseGroup: 'ItemAttributes, Offers, Images',
    itemPage: page,
    }, function(err, data){
      console.log(data);
      res.json(data);
    }
  );
});


function cleanDollars(obj) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (property[0] === '$') {
        delete obj[property];
      } else if (typeof obj[property] == "object") {
        cleanDollars(obj[property]);
      }
    }
  }
  return obj;
}

app.post('/favorites',
    passport.authenticate(
        'basic',
        {session: false}
    ),
    (req, res) => {
      console.log('addfav')
        let product = cleanDollars(req.body);
        User.findByIdAndUpdate(
            req.user._id,
            {$push: {"favorites": {product}}},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                console.log('err', err);
                console.log('model.favorites', model.favorites)
                res.json(model.favorites);
            }
        );
    }
);

app.get('/favorites',
    passport.authenticate(
        'basic',
        {session: false}
    ),
    (req, res) => {
        console.log('favorites', req.user.favorites)
        res.json(req.user.favorites);
    }
);

app.delete('/favorites',
    passport.authenticate(
        'basic',
        {session: false}
    ),
    (req, res) => {
      console.log('req', req.body)
    User.findByIdAndUpdate(
        req.user._id,
        {$pull: {"favorites": {_id: req.body._id}}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log('err', err);
            res.json(req.user.favorites);
            console.log('req.user.favorites', req.user.favorites)
        });
});



let server;

function runServer(databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer};










const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');

exports.auth = function(req, res) {
  const { email, password } = req.body;

  if(!password || !email){
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Please provide email and password!'}]});
  }

  User.findOne({email}, function(err, user) {
    if(err) {
      return res.status(422).send({'mongoose': "A mongoose error"});
    }
    if(!user) {
      return res.status(422).send({errors: [{title: 'Invalid user!', detail: 'User doesnot exist!'}]});
    }

    if(user.hasSamePassword(password)) {
        // Generate JWT token
        const token = jwt.sign({
          userId: user.id,
          username: user.username
        }, config.SECRET, { expiresIn: '1h'});

        res.json(token);

    } else {
      return res.status(422).send({errors: [{title: 'Wrong data!', detail: 'Wrong email or password!'}]});
    }

  });

}
exports.register = function(req, res) {
  const {username, email, password, passwordConfirmation} = req.body;
  if(!password || !email){
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Please provide email and password!'}]});
  }

  if(password !== passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Invalid password!', detail: 'Password not same as confirmation password!'}]});
  }

  User.findOne({email}, function(err, existinguser) {
    if(err) {
      return res.status(422).send({'mongoose': "A mongoose error"});
    }
    if(existinguser) {
      return res.status(422).send({'Invalid email': "User with email already exists"});
    }
  });

  const user = new User({
    username,
    email,
    password
  });
  user.save(function(err) {
    if(err) {
      return res.status(422).send({'mongoose': err});
    }
    return res.json({'registered': true});
  });
}

exports.authMiddleware = function(req, res, next) {
  const token = req.headers.authorization;

  if(token) {
    const user = parseToken(token);
    User.findById(user.userId, function(err, user) {
      if(err) {
        return res.status(422).send({errors: err.errors});
      }
      if(user) {
        res.locals.user = user;
        next();
      } else {
        return res.status(422).send({title: 'Not authorized', detail: 'You need to login to get access'});
      }

    });
  } else {
    return res.status(422).send({title: 'Not authorized', detail: 'You need to login to get access'});
  }
}

function parseToken(token) {
  return jwt.verify(  token.split(' ')[1], config.SECRET);
}

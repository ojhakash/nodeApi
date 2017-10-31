const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var  {mongoose} = require('./../db/mongoose');
var {User} = require('./../models/user');
var {authenticate} = require('./../middleware/authenticate');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/',(req,res)=>{
  var body = _.pick(req.body,['email','password']);

  var user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

router.post('/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

router.delete('/me/token',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  })
});

router.get('/me',authenticate,(req,res)=>{
  res.send(req.user);
});

router.get('/me',authenticate,(req,res)=>{
  res.send(req.user);
});


module.exports = router;
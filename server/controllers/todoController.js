const _ = require('lodash');
var {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var  {mongoose} = require('./../db/mongoose');
var {Todo} = require('./../models/todo');
var {authenticate} = require('./../middleware/authenticate');

var router = express.Router();
const port = process.env.PORT || 3000;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/',authenticate,(req,res)=>{
  var todo = new Todo({
    text:req.body.text,
    _creator:req.user._id
  });

  todo.save().then((doc)=>{
    res.status(200).send(doc);
  },(e)=>{
    res.status(400).send(e);
  })
});

router.get('/',authenticate,(req,res)=>{
  Todo.find({
    _creator:req.user._id
  }).then((docs)=>{
    res.send(docs);
  },(err)=>{
    res.status(400).send(err);
  })
});

router.get('/:id',authenticate,(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOne({
    _id:id,
    _creator:req.user._id
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  },(err)=>{
    res.status(400).send(err);
  })
});

router.delete('/:id',authenticate,(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err)=>{
    res.status(400).send(err);
  })
});

router.patch('/:id',authenticate,(req,res)=>{
  var id = req.params.id;
  console.log(req.body);
  var body = _.pick(req.body,['text','completed'])
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err)=>{
    res.status(400).send(err);
  })
});

module.exports = router;
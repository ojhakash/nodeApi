var express = require('express');

var userController = require('./controllers/userController');
var todoController = require('./controllers/todoController');

var app = express();
const port = process.env.PORT || 3000;

app.use('/users',userController);
app.use('/todos',todoController);

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
})

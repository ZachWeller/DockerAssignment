var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/hello', (req, res, next) => {
  res.render('index', {title: 'world'})
})

// let cat = {
//   breed: "Siamese",
//   color: "Tan"
// }
// let dog = {
//   breed: "Husky",
//   color: "Grey"
// }
// let joe = {
//   breed: "Human",
//   color: "White"
// }
// let animals = [cat, dog, joe]

// app.get('/db', (req, res, next) => {
//   res.render( 'animalProfile', { animals: animals})
// })

const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://ZachWeller181:nXDA8NkgnLoZRWUz@cluster0.ocrjylp.mongodb.net/theZoo';

const dbName = 'theZoo';
const client = new MongoClient(url);    

app.get('/', async function(req,res,next) {
  try {
    // const animalsCopy = JSON.parse(JSON.stringify(animals));

    await client.connect();
    console.log("Connected!");
    const db = client.db(dbName);
    const collection = db.collection('animals');

    // const insertAnimals = await collection.insertMany(animalsCopy);
    // console.log("Inserting", insertAnimals);

    const findAnimals = await collection.find({}).toArray();
    res.render("animalProfile", {animals: findAnimals})

  } catch (error) {
    console.log("ERROR");
    next(error)
  }finally {
    client.close()
  }
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

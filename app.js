const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expresslayout = require('express-ejs-layouts')
const dotenv= require("dotenv").config()
const db = require('./db')
const colors = require('colors')
const session = require('express-session')
const nocache = require('nocache')


const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expresslayout)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache())
app.use((req, res, next)=> {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.use(session({
  secret:process.env.SESSION_SECRET || "my-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 18000000 } 
}));



db.connect((err,db)=>{
  if(err) {
    console.log("database not connected",err);
  }else{
    console.log("dataBase connected successfully\n".cyan);
  }
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);


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
  res.render('error',);  
});

const PORT = process.env.PORT ||8080;
app.listen(PORT,function(err){
  if(err) console.log('error in connecting server');
  console.log(`Server listening on Port ${PORT}`.bgMagenta);
})



/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const names = require('./names');
const sayHi = require('./utils');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(sayHi(names.ahlaou) + '\n'  +  sayHi(names.jhon) + '\n' + sayHi(names.yassine));
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/


const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const morgan = require('morgan')// requests to pages are showen in console
const { engine }  = require('express-handlebars') // midlleware for templates
//engine is a function in express-handlebares
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')//store the session in database
const connectDB = require('./config/db')

//const { default: mongoose } = require("mongoose")




//load config
dotenv.config({path: './config/config.env'})


//passport config

require('./config/passport')(passport)

connectDB()

const app = express()

//parse body
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Method Override

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Logging
if (process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

//handlebars helpers

const {formatDate , stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//handlebars

app.engine('.hbs', engine({ helpers : {formatDate,stripTags, truncate, editIcon, select},defaultLayout : 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//session 
app.use(session({
  secret: 'keyboard cat',
  resave: false,//we don't wanna save a session if nothing is modified
  saveUninitialized: false,//don't create a session until something is stored
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
}))

//passport middleware

app.use(passport.initialize())
app.use(passport.session())

//set global variable

app.use(function (req, res, next)
{
  res.locals.user = req.user ||null
  next()
})

//static folder

app.use(express.static(path.join(__dirname, 'public'))) // dirname is the root

//Routes

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth')) 
app.use('/posts', require('./routes/posts')) 


const PORT = process.env.PORT || 5000// when we use process we can use variables that are in config file


app.get("/Welcome",function(request,response){
//response.send("Hello Yassine!")
response.render ('welcome')
})


app.listen(PORT, 
console.log(`Started application on port ${PORT}`)
);
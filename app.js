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
const dotenv = require("dotenv")
const morgan = require('morgan')// requests to pages are showen in console
const { engine }  = require('express-handlebars') // midlleware for templates
//engine is a function in express-handlebares
const connectDB = require('./config/db')




//load config
dotenv.config({path: './config/config.env'})




connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

//handlebars

app.engine('.hbs', engine({ defaultLayout : 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//static folder

app.use(express.static(path.join(__dirname, 'public'))) // dirname is the root

//Routes

app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 5000// when we use process we can use variables that are in config file


app.get("/Welcome",function(request,response){
//response.send("Hello Yassine!")
response.render ('welcome')
})


app.listen(PORT, 
console.log(`Started application on port ${PORT}`)
);
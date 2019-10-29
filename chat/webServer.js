const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/index', (req,res)=>{
    res.render('index', {Title:"챗팅"});
});

app.get('/login',(req,res)=>{
    res.render('login', {Title: "로그인"});
});

http.listen(3100,()=>{
    console.log('connected at 3100');
});

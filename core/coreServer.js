//signalServer - coreserver = socket.io
// const io = require(socket.io)(http); 연결은 coreServer에서 해줌
const express = require('express');
const app = express();
const bodyParser = require('body-parser') //post 받기

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
}));

// connect
const pg = require('pg');
const client = new pg.Client({
    user: 'genie',
    host: '106.240.247.42',
    database: 'test',
    password: 'genie01',
    port: 5432
}); 

app.get('/',(req,res)=>{
    res.json({
        info: 'You are in!'
    })
})

app.post('/login', (req, res)=>{
    var sql = "select count(id) as cnt from exam.user where id=$1 and password=$2";
    client.query(sql, [req.body.id, req.body.pw], (err, data) => {
        if (err) {
            console.log('incorrect info');
        } else {
            var cnt = Number(data.rows[0].cnt);
            if (cnt > 0) {
                res.status(200).json({
                    message: 'true',
                })
            } else {
                res.status(200).json({
                    message: 'false',
                })
            }
        }
    });
});

app.post('/signUp', (req, res)=>{
    console.log(req.body);
    loginSelect(req.body.id, req.body.pw);
});

app.post('/pwdUpdate', (req, res)=>{
    console.log(req.body);
    pwdUpdate(req.body.userPw, req.body.userId, res);
});

app.post('/joinInsert', (req, res)=>{
    console.log(req.body);
    joinInsert(req.body.userPw, req.body.userId, req.body.email, res);
});

app.post('/userDelete', (req, res)=>{
    console.log(req.body);
    userDelete(req.body.userId, res);
});

app.post('/selectAll', (res)=>{
    selectAll(res);
});

app.listen('6100',()=>{
    console.log('connected at 6100');
});



client.connect().then(()=>{
    console.log("connection done");
});

// dummy 값일때 select

function loginSelect(id, pw){
    var sql = "select count(id) as cnt from exam.user where id=$1 and password=$2"; 
    client.query(sql, [id, pw], (err, res)=>{
        if(err){
            console.log('incorrect info');
        }else{
            // console.log(Number(res.rows[0].cnt)); // object에서 number로 형변환 //
            var cnt = Number(res.rows[0].cnt);
            if(cnt>0){
                res.status(200).json({
                    message: 'true'
                })
            }else{
                res.status(200).json({
                    message: 'false'
                })
            }
        }
    });
}

// select
function selectAll(res){
    var sql = "select id, password from exam.user";
    client.query(sql, (err, response)=>{
        if(err){
            console.log(err.stack);
        }else{
            res.send(response)
            console.log(response.rows);
        };
    });
}

// update
function pwdUpdate(pwd, id, response){
    var sql = "update exam.user set password=$1 where id=$2";
    var param = [pwd, id];
    client.query(sql, param, (err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            response.send('update done')
            console.log('updated');
        }
    });
}

function joinInsert(id,pw,email){
    client.query('select (max)+1 as nextid from exam.user',(err, res)=>{
        if(err){
            console.log(err.database);
        }else{
        idx = nextid;
        var sql = 'insert into exam.user values($1,$2,$3,$4)';
        var param =[idx, id, pw, email]
        client.query(sql,param,(err,response)=>{
            if(err){
                console.log(err.database);
            }else{
                selectAll();
                response.send('updated');
                console.log(response.rows[0]);
            }
        });
        }
    });
}
// delete
function userDelete(id){
    var sql = "delete from exam.user where id=$1";
    var param = [id];
    client.query(sql, param, (err, res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res.rows);
        }
    });
}

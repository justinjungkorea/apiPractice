/** coreServer로 request로 요청한다. // Request - Simplified HTTP client
 * request('어디로',(err, res, body)-{});
 * 요청할때 post 형식 json 형식 
 * 받는쪽 signalling 에서는 jsonparser로 변환해줘야한다
 * 값 보내고 콜백으로 다시 받기 
 */

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const request = require('request');
const bodyParser = require('body-parser') //post 받기
app.use(bodyParser.json())


// let option = {
//     uri : 'http://localhost:6000/login', 
//     body: {
//         'test' : 'exam',
//         'study': 'student'
//     },
//     json:true //json으로 보낼경우 true로 해줘야 header값이 json으로 설정
// }

// request.post(option, (err, res)=>{
//     if(!err){
//         console.log(res.body);
//     }else{
//         console.log(err.message);
//     }
// });



app.post('/signUp',(req,res)=>{
    console.log(req.body)
    console.log('/signUp ' + req.body.userId, ' : ' + req.body.userPw);
    
    connectNextServer('http://localhost:6100/signUpAction',{
        usreId : req.body.userId, 
        userPw : req.body.userPw
    },
    (err, response, body)=>{
        if(body == '성공'){
            res.send('login success')
        }else{

        }
    });
});

function connectNextServer(url, gap, callback){ // 어디로, 무엇을보내고, 돌려받는가
    var option = {
        url : url,
        body : gap,
        json : true
    };
    request.post(option,callback);
}



// request.post('http://localhost:6000', data, (err, req, res)=>{
//     if(!err){
//         console.log(req.body);
//         console.log(res.body);
//     }else{
//         console.log(err.message);
//     }
// });

io.on('connection',(socket)=>{
    socket.on('chat msg',(msg)=>{
        io.emit('chat msg', msg);
    });
    socket.on('disconnection',()=>{
        console.log('disconnected');
    });

});

http.listen(5100,()=>{
    console.log('connected at 5100');
});
var express=require('express');
//加载body-parser模块
var bodyParser = require('body-parser');
//加载数据库模块
var mongoose = require('mongoose');
//加载cookies模块
var cookies = require('cookies');
var app =express();
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
/*app.post('/product',function(req,res){
 var name = req.body.username;
 });*/
//数据库的连接
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27018/toptest', { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("数据库成功连接!");
});
var artSchema = new mongoose.Schema({
    art_title : { type:String },//属性name,类型为String
    art_content  : { type:String },
    art_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    art_see: {type:Number,default:0},
    art_time: {type:Date,default:new Date()},
    art_answer: {type:Number,default:0},
    art_mongey:{type:String}
});
var artModel = db.model("article", artSchema, "article");
var countSchema = new mongoose.Schema({
    count_content:{type:String},
    count_time:{type:Date,default:new Date()},
    count_user:{
        type:String
    },
    count_art:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'artModel'
    }
});
var countModel = db.model("count", countSchema, "count");
var userSchema = new mongoose.Schema({
    user_art: [{
        type:Object
    }],
    user_name : { type:String },//属性name,类型为String
    user_password  : { type:String },
    user_answer: { type:Number,default:0 },
    user_question:{ type:Number,default:0 },
    user_money:{ type:String,default:'' }
});
var userModel = db.model("user", userSchema, "user");

var dataList1,dataName,dataList2,dataList3,dataList4,dataList5;
var responseData;
app.use(function (res,req,next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});
userModel.find({},function(err,doc){
    dataList1 = doc;
});

//注册接口url
app.get('/user',function(req,res){
    res.status(200);
    res.json(dataList1);
});

app.post('/user/register',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if( username=='' ){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if( password == '' ){
        responseData.code = 2;
        responseData.message = '用户密码不能为空';
        res.json(responseData);
        return;
    }
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }

    //数据库的验证（用户名是否已经存在）
    userModel.findOne({
        user_name: username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }
        var user = new userModel({
            user_name: username,
            user_password:password,
            user_answer:0,
            user_question:0,
            user_money:''
        });
        return user.save();
    }).then(function(newUserInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

app.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }
    userModel.findOne({
        user_name: username,
        user_password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或者密码不正确';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.user_name
        };

        res.json(responseData);
        return;
    });
});

app.post('/user/info',function(req,res,next){
    var userId = req.body.userId;
    userModel.findOne({
        _id: userId
    }).then(function(userInfo){
        artModel.find({art_user:userInfo._id}).then(function(artDoc){
            return userInfo.user_art = userInfo.user_art.concat(artDoc);
        }).then(function(se){
            responseData.userInfo = userInfo;
            responseData.user_art = se;
            res.json(responseData);
            return;
        });
    });
});

app.post('/artShow',function(req,res,next){
    var limit = 5,pages = 0,num = 0;
    var page = Number(req.body.page || 1);
    var artId = req.body.art_id;
    artModel.findOne({
        _id : artId
    }).then(function(artDoc){
        userModel.findOne({
            _id:artDoc.art_user
        }).then(function(userInfo){
            responseData.artDoc = artDoc;
            responseData.message = userInfo.user_name;
            countModel.find({count_art:artDoc._id}).count().then(function(sum){
                num = sum;
                //总页数
                pages = Math.ceil(sum / limit);
                //页数不能超过pages
                page = Math.min(page,pages);
                //页数不能小于1
                page = Math.max(page,1);
                var skip = (page-1) * limit;
                countModel.find({count_art:artDoc._id}).sort({'count_time':-1}).limit(limit).skip(skip).then(function(count){
                    responseData.countAry = count;
                    responseData.pages = pages;
                    responseData.sum = num;
                    res.json(responseData);
                    return;
                });
            });
        });
    });
});

app.post('/count',function(req,res,next){
    var countArt = req.body.countArt;
    var countUser = req.body.countUser;
    var countTime = req.body.countTime || new Date();
    var countCon = req.body.countContent;
    if(countCon === ""){
        responseData.code = 1;
        responseData.message = "答案都不愿意写，还想点提交？！";
        res.json(responseData);
        return;
    }else{
        new countModel({
            count_art : countArt,
            count_user:countUser,
            count_time:countTime,
            count_content:countCon
        }).save();
        responseData.message = "";
        res.json(responseData);
        return;
    }
});

app.get('/hotDoor',function(req,res,next){
    res.status(200);
    artModel.find({'art_answer':{$gt:10}}).populate(['userSchema']).then(function(doc){
        dataList2 = doc;
        res.json(dataList2);
        return;
    });
});

app.get('/newAnswer',function(req,res,next){
    res.status(200);
    artModel.find({'art_time':{$gte:new Date("2018-01-02T00:00:00Z")}}).then(function(doc){
        dataList3 = doc;
        res.json(dataList3);
        return;
    });
});

app.get('/zoomP',function(req,res,next){
    res.status(200);
    artModel.find({'art_answer':0 }).then(function(doc){
        dataList4 = doc;
        res.json(dataList4);
        return;
    });
});

app.get('/tabOff',function(req,res,next){
    res.status(200);
    artModel.find({'art_mongey': {$ne:""} }).then(function(doc){
        dataList5 = doc;
        res.json(dataList5);
        return;
    });
});

app.post('/question',function(req,res,next){
    var artUser = req.body.artUser;
    var artName = req.body.artName;
    var artTime = req.body.artTime || new Date();
    var artCon = req.body.artContent;
    var artTitle = req.body.artTitle;
    var artMoney = req.body.artMoney;
    if(artCon === ""){
        responseData.code = 1;
        responseData.message = "问题描述不能为空！";
        res.json(responseData);
        return;
    }else{
        new artModel({
            art_title : artTitle,
            art_mongey:artMoney,
            art_time:artTime,
            art_content:artCon,
            art_user:artUser,
            art_name:artName
        }).save();
        responseData.message = "发布成功";
        res.json(responseData);
        return;
    }
});

//配置服务端口
var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
});


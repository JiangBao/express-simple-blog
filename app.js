// 引入依赖
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');

// 获取express实例
var app = express();

// 模板引擎设置为ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// 加载中间件
app.use(logger('dev'));                                                   //加载日志中间件
app.use(bodyParser.json());                                               //加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));                      //加载解析urlencoded请求体的中间件
app.use(cookieParser());                                                  //加载解析cookie的中间件
// 加载session中间件
app.use(session({
  secret: 'abcdefg',
  name: 'simple-blog',
  cookie: {maxAge: 300000}
}));
app.use(express.static(path.join(__dirname, 'public')));                  //存放静态文件目录

/*-------  开发时，这一部分是需要根据自己业务逻辑进行自定义的 ---------------*/
// 路由配置
routes(app);
/*------------------------------------------------------------------------*/

// 捕获404错误并传递给错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理器
app.use(function(err, req, res, next) {
  // 仅捕获开发模式下错误
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 将错误渲染到页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
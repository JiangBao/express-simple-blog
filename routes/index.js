// 引入本地用户管理user模块
var User = require('../models/user.js');
var user = new User();

/*
* 路由配置
* */
module.exports = function(app) {
  // GET /        主页
  app.get('/', function (req, res) {
    console.log(user);
    res.render('index', {
      title: 'Index',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  // GET /reg     注册页
  app.get('/reg', checkNotLogin);
  app.get('/reg', function (req, res) {
    res.render('reg', {
      title: 'Register',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  // POST /reg    注册请求
  app.post('/reg', checkNotLogin);
  app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        rePassword = req.body.rePassword;

    // 两次输入密码不一致
    if(rePassword != password) {
      req.flash('error', 'password not same!!!');
      return res.redirect('/reg');
    }

    // 用户名已存在
    if(user.get(name)) {
      req.flash('error', 'username already exist');
      return res.redirect('/reg');
    }

    // 注册成功，记录用户信息，写入session并跳转到主页
    user.save(name, password);
    req.session.user = {userName: name, password: password};//用户信息存入 session
    req.flash('success', 'reg success');
    res.redirect('/');                                      //注册成功后返回主页
  });

  // GET /login   登录页
  app.get('/login', checkNotLogin);
  app.get('/login', function (req, res) {
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  // POST /login  登录请求
  app.post('/login', checkNotLogin);
  app.post('/login', function (req, res) {
    var userName = req.body.name,
        password = req.body.password;

    // 用户名不存在
    if(!user.get(userName)) {
      req.flash('error', 'username not exist');
      return res.redirect('/login');
    }

    // 密码错误
    if(password != user.get(userName).password) {
      req.flash('error', 'error password');
      return res.redirect('/login');
    }

    // 成功登录，将信息写入session并跳转到主页
    req.session.user = {userName: userName, password: password};
    req.flash('success', 'login success');
    res.redirect('/');
  });

  // GET /logout  退出
  app.get('/logout', checkLogin);
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', 'logout success');
    res.redirect('/');
  });
};

// 检测是否为登录状态
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'not login');
    res.redirect('/login');
  }
  next();
}

// 检测是否为退出状态
function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'already login');
    res.redirect('back');//返回之前的页面
  }
  next();
}
/**
 * Created by Administrator on 2017/2/5 0005.
 */
module.exports = function() {
return new User();
};

var User = function() {
	this.users = {
		"admin": {userName: "admin", password: "123456"}
  	};
};

// 原型链
var user = User.prototype;

/*
* user对象的get方法
* */
user.get = function(username) {
	return this.users[username];
};

/*
* user对象的set方法
* */
user.save = function(userName, password) {
	this.users[userName] = {userName: userName, password: password};
};
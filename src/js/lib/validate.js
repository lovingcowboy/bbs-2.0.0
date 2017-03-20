// import Bbsbridge from '../lib/bbsbridge.js';
import OpenAPI from '../../services/openapi.js';
import Services from '../../services'
import Toast from '../../components/toast/index.js';
// import Vue from 'vue'

var Validate = {
	getCookie: function(name) {
		var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	},
	getParam: function(name, url) {
		if (!url) {
			url = location.href;
		}
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var returnValue;
		for (var i = 0; i < paraString.length; i++) {
			var tempParas = paraString[i].split('=')[0];
			var parasValue = paraString[i].split('=')[1];
			if (tempParas === name)
				returnValue = parasValue;
		}

		if (!returnValue) {
			return "";
		} else {
			if (returnValue.indexOf("#") != -1) {
				returnValue = returnValue.split("#")[0];
			}
			return returnValue;
		}
	},
	checkLogin: function() {
		var uid = Util.getSessionStorage('uid');
		var isLogined_cookie = Validate.getCookie('voHF_2132_auth'); //测试服务器
		// var isLogined_cookie = Validate.getCookie('voHF_b718_auth'); //本地测试，正式地址
		return uid || isLogined_cookie;
	},
	requesting: false,
	bbsAppLogin: function(loginToken, callback) {
		var me = this;
		if (me.requesting) {
			return;
		}
		var reqParam = {
			version: 4,
			module: "memebr",
			action: 'app_login',
			v_token: loginToken
		};

		Vue.http.options.before = function(request) {
				Toast('用户信息同步中，请稍候...');
				me.requesting = true;
			}
			/*reqParam.beforeSend = function(request) {
				if (request) {
					me.requesting = true;
					// console.info('beforeSend----', request);
					Toast('用户信息同步中，请稍候...');
				}
			}*/
		var loginInfo = {};
		Services.postData('/app/index.php', reqParam).then((response) => {
			var v_data = response.body;
			console.info("login---bbsAppLogin--", v_data);
			if (v_data.code == "200") {

				Util.setSessionStorage('uid', v_data.data.member.uid);
				// if (callback && typeof callback === "function") {
				// 	callback.apply(this, arguments);
				// }
				loginInfo.isLogined = 1;
				typeof callback === "function" && callback.call(this, loginInfo);
				Toast('同步数据成功');

			} else {

				Util.setSessionStorage('uid', '');
				console.info("login fail------", v_data.message);
				Toast(v_data.message);
				// if (callback && typeof callback === "function") {
				// 	callback.apply(this, arguments);
				// }
				loginInfo.isLogined = -1;
				typeof callback === "function" && callback.call(this, loginInfo);
			}
			me.requesting = false;
		}, (response) => {
			Toast("同步数据失败！");

			Util.setSessionStorage('uid', '');
			loginInfo.isLogined = -1;
			typeof callback === "function" && callback.call(this, loginInfo);
			// if (callback && typeof callback === "function") {
			// 	callback.apply(this, arguments);
			// }
			me.requesting = false;
		})


	},
	bbsWebLogin: function(callback) {
		var me = this;
		if (me.requesting) {
			return;
		}
		var loginInfo = {
			isLogined: 0
		};
		var tuandaiCookie = this.getCookie('tuandaiw');
		if (!tuandaiCookie) {
			typeof callback === "function" && callback.call(this, loginInfo);
			return;
		}
		var reqParam = {
			version: 4,
			module: "member",
			action: 'login',
			tuandaiwang_cookie: tuandaiCookie
		};
		/*reqParam.beforeSend = function(request) {
			if (request) {
				console.info('beforeSend----', request)
				Toast('用户信息同步中，请稍候...');
			}
		}*/
		Vue.http.options.before = function(request) {
			Toast('用户信息同步中，请稍候...');
			me.requesting = true;
		}
		service.postData('/app/index.php', reqParam).then((response) => {
			var v_data = response.body;
			console.info("--bbsWebLogin====data--", v_data);
			if (v_data.code == "200") {
				Util.setSessionStorage('uid', v_data.data.member.uid);
				Toast('同步数据成功');
				loginInfo.isLogined = 1;
				typeof callback === "function" && callback.call(this, loginInfo);
			} else {
				Util.setSessionStorage('uid', '');
				console.info("login fail------", v_data.message);
				Toast(v_data.message);
				loginInfo.isLogined = -1;
				typeof callback === "function" && callback.call(this, loginInfo);
			}

			me.requesting = false;
		}, (response) => {
			Toast('同步数据失败！');
			Util.setSessionStorage('uid', '');
			loginInfo.isLogined = -1;
			typeof callback === "function" && callback.call(this, loginInfo);
			me.requesting = false;
		})

	},
	setTitle: function(titleParams) {
		// console.info("----kkk--", titleParams);
		Bbsbridge.appBbsLifeHook(null, function() {
			// console.info("appbbs---------");
			Bbsbridge.exec('setTitleComponent', titleParams, function(data) {
				// console.info('setTitleComponent--------', data);
			});
		});
	},
	/*
	app中bbs登录有几种情况：
	1，app跳转到bbs时，url地址中带了loginToken参数，直接获取url地址中的t登录。
		其中，如果url地址中有状态参数s为2表示app已登录，但无法获取到loginToken，此情况同3；
	2，app跳转到bbs时， url地址中没有带有loginToken参数，通过原生的BBSLoginToken回调返回的loginToken登录；
	3，通过原生BBSToken回调获取到的data为空时，bbs登录采用触屏版登录方式；

	callback传参：loginInfo {isLogin: [0|1|-1]} 0:未登录 1：已登录；-1登录失败
	*/
	getLoginInfo: function(callback) {
		var me = this;
		var dataReturn = Util.getSessionStorage('dataReturn'); //app的loginToken回调是否返回空数据 0表示返回空
		console.info("dataReturn-----", dataReturn);
		//无法从app的loginToken回调中获取loginToken时，采用触屏版登录
		if (Bbsbridge.isNewVersion() && dataReturn != 0) {
			var bbs_token = Util.getParam("t");
			var bbs_status = Util.getParam("s");
			if (!bbs_token && !bbs_status) {
				bbs_token = Util.getSessionStorage('bbs_token');
				bbs_status = Util.getSessionStorage('bbs_status');
			} else {
				Util.setSessionStorage('bbs_token', bbs_token);
				Util.setSessionStorage('bbs_status', bbs_status);
			}

			console.info("bbs_t=", bbs_token, "----bbs_s=", bbs_status);
			//从url中获取loginToken登录

			if (bbs_status == 1) {
				//app已登录并获取到loginToken
				me.bbsAppLogin(bbs_token, callback);
				Util.setSessionStorage('v_token', bbs_token);
			} else if (bbs_status == 2) {
				//app已登录，但是未获取到loginToken
				Util.setSessionStorage('v_token', '');
				Util.setSessionStorage('dataReturn', 0);
				console.info('app is logined, but can not get loginToken');
				var loginInfo = {
					isLogined: -1
				};
				typeof callback === 'function' && callback.call(this, loginInfo);
			} else {
				//app未登录
				var loginInfo = {
					isLogined: 0
				};
				typeof callback === 'function' && callback.call(this, loginInfo);
			}
			/*else {
				//获取app返回的loginToken登录
				Bbsbridge.appBbsLifeHook(function(data) {
					console.info("lifehook----data-----", data);

					if (data) {
						data = JSON.parse(data);
						var returncode = data.ReturnCode;
						data = data.Data
						var v_token = data.LoginToken;

						//returncode == 1调用登陆接口
						if (returncode == '1') {
							// window.sessionStorage['v_token'] = v_token;
							var uid;
							window.isAppLogined = true;
							if (window.mySessionStorage) {
								window.mySessionStorage['v_token'] = v_token;
								window.mySessionStorage['dataReturn'] = 1;
								uid = window.mySessionStorage['uid'];
							} else {
								window.sessionStorage['v_token'] = v_token;
								window.sessionStorage['dataReturn'] = 1;
								uid = window.sessionStorage['uid'];
							}
							if (!uid) {
								//防止app转入后台后重新访问重复调用接口
								me.bbsAppLogin(v_token, callback);
							}
						} else {
							var message = data.ReturnMessage;
							// returncode为4表示用户未登录
							if (returncode != 4) {
								Toast(message);
							}
							window.isAppLogined = false;
							if (window.mySessionStorage) {
								window.mySessionStorage['v_token'] = "";
								window.mySessionStorage['dataReturn'] = 1;
							} else {
								window.sessionStorage['v_token'] = "";
								window.sessionStorage['dataReturn'] = 1;
							}

						}
					} else {
						window.isAppLogined = false;
						if (window.mySessionStorage) {
							window.mySessionStorage['v_token'] = "";
							window.mySessionStorage['dataReturn'] = 0;
						} else {
							window.sessionStorage['v_token'] = "";
							window.sessionStorage['dataReturn'] = 0;
						}
						callback();
					}

				});
			}*/
		} else {
			me.bbsWebLogin(callback);
		}

	},
	openLogin: function(ReturnUrl) {
		var me = this;
		var dataReturn = Util.getSessionStorage('dataReturn');
		if (Bbsbridge.isNewVersion() && dataReturn != 0) {
			// var v_token;
			// if (window.mySessionStorage) {
			// 	v_token = window.mySessionStorage['v_token'];
			// } else {
			// 	v_token = window.sessionStorage['v_token'];
			// }
			// if (v_token) {
			// 	me.bbsAppLogin(v_token, callback);
			// 	// alert('获取用户信息失败，请稍后重试！');
			// } else {
			// 	Bbsbridge.toAppLogin();
			// }
			Bbsbridge.toAppLogin();
		} else {
			ReturnUrl = ReturnUrl ? ReturnUrl : window.location.href;
			ReturnUrl = encodeURIComponent(ReturnUrl);
			//https://m.tuandai.com/user/login.aspx?UrlType=json&ReturnUrl={Url:"http://bbs87.tuandai.com:8080/index.php?code=2323&value=2323232"}
			// window.location.href = "https://m.tuandai.com/user/login.aspx?ReturnUrl=" + ReturnUrl;
			window.location.href = 'http://10.100.11.110:9008/user/Login.aspx?ReturnUrl=' + ReturnUrl;
		}
	}
}

if (typeof(module) !== undefined) {
	module.exports = Validate;
}
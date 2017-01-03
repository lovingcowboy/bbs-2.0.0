import Bbsbridge from '../lib/bbsbridge.js';
import OpenAPI from '../../services/openapi.js';
import Toast from '../../components/toast/index.js';


var Validate = {
	getCookie: function(name) {
		var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
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
	requesting: false,
	bbsAppLogin: function(loginToken, callback) {
		var me = this;
		if (me.requesting) {
			return;
		}

		$.ajax({
			url: OpenAPI.value + "/app/index.php",
			type: 'post',
			dataType: 'json',
			data: {
				version: 4,
				module: "member",
				action: 'app_login',
				v_token: loginToken,

			},
			beforeSend: function() {
				me.requesting = true;
				Toast('用户信息同步中，请稍候...');
			},
			success: function(v_data) {
				me.requesting = false;
				console.info("login---bbsAppLogin--", v_data);
				if (v_data.code == "200") {
					// window.sessionStorage['uid'] = v_data.data.member.uid;
					if (window.mySessionStorage) {
						window.mySessionStorage['uid'] = v_data.data.member.uid;
					} else {
						window.sessionStorage['uid'] = v_data.data.member.uid;
					}
					if (callback && typeof callback == "function") {
						callback.apply(this, arguments);
					}
					Toast('同步数据成功');

				} else {
					// window.sessionStorage['uid'] = "";
					if (window.mySessionStorage) {
						window.mySessionStorage['uid'] = "";
					} else {
						window.sessionStorage['uid'] = "";
					}
					console.info("login fail------", v_data.message);
					Toast(v_data.message);
				}
			},
			error: function(e) {
				Toast("同步数据失败！");
				if (window.mySessionStorage) {
					window.mySessionStorage['uid'] = "";
				} else {
					window.sessionStorage['uid'] = "";
				}
			},
			complete: function(request, status) {
				me.requesting = false;
			}
		});
	},
	bbsWebLogin: function() {
		var tuandaiCookie = this.getCookie('tuandaiw');
		if (!tuandaiCookie) {
			return;
		}
		$.ajax({
			url: OpenAPI.value + "/app/index.php",
			type: 'post',
			dataType: 'json',
			data: {
				version: 4,
				module: "member",
				action: 'login',
				tuandaiwang_cookie: tuandaiCookie,
			},
			beforeSend: function() {
				Toast('用户信息同步中，请稍候...');
			},
			success: function(v_data) {
				console.info("--bbsWebLogin====data--", v_data);
				if (v_data.code == "200") {
					// window.sessionStorage['uid'] = v_data.data.member.uid;
					if (window.mySessionStorage) {
						window.mySessionStorage['uid'] = v_data.data.member.uid;
					} else {
						window.sessionStorage['uid'] = v_data.data.member.uid;
					}
					Toast('同步数据成功');
				} else {
					// window.sessionStorage['uid'] = "";
					if (window.mySessionStorage) {
						window.mySessionStorage['uid'] = "";
					} else {
						window.sessionStorage['uid'] = "";
					}
					console.info("login fail------", v_data.message);
					Toast(v_data.message);
				}
			},
			error: function(e) {
				Toast('同步数据失败！');
				if (window.mySessionStorage) {
					window.mySessionStorage['uid'] = "";
				} else {
					window.sessionStorage['uid'] = "";
				}
			}
		});
	},
	setTitle: function(titleParams) {
		console.info("----kkk--", titleParams);
		Bbsbridge.appBbsLifeHook(null, function() {
			console.info("appbbs---------");
			Bbsbridge.exec('setTitleComponent', titleParams, function(data) {
				console.info('setTitleComponent--------', data);
			});
		});
	},
	/*
	app中bbs登录有几种情况：
	1，app跳转到bbs时，url地址中带了loginToken参数，直接获取url地址中的t登录。
		其中，如果url地址中有状态参数s为2表示app已登录，但无法获取到loginToken，此情况同3；
	2，app跳转到bbs时， url地址中没有带有loginToken参数，通过原生的BBSLoginToken回调返回的loginToken登录；
	3，通过原生BBSToken回调获取到的data为空时，bbs登录采用触屏版登录方式；
	*/
	getLoginInfo: function() {
		var me = this;
		let dataReturn; //app的loginToken回调是否返回空数据 0表示返回空
		if (window.mySessionStorage) {
			dataReturn = window.mySessionStorage['dataReturn'];
		} else {
			dataReturn = window.sessionStorage['dataReturn'];
		}
		console.info("dataReturn-----", dataReturn);
		//无法从app的loginToken回调中获取loginToken时，采用触屏 版登录
		if (Bbsbridge.isNewVersion() && dataReturn != 0) {
			var bbs_token = me.getParam("t");
			var bbs_status = me.getParam("s");
			if (!bbs_token && !bbs_status) {
				if (window.mySessionStorage) {
					bbs_token = window.mySessionStorage['bbs_token'];
					bbs_status = window.mySessionStorage['bbs_status'];
				} else {
					bbs_token = window.sessionStorage['bbs_token'];
					bbs_status = window.sessionStorage['bbs_status'];
				}
			} else {
				if (window.mySessionStorage) {
					window.mySessionStorage['bbs_token'] = bbs_token;
					window.mySessionStorage['bbs_status'] = bbs_status;
				} else {
					window.sessionStorage['bbs_token'] = bbs_token;
					window.sessionStorage['bbs_status'] = bbs_status;
				}
			}

			console.info("bbs_t=", bbs_token, "----bbs_s=", bbs_status);
			//从url中获取loginToken登录
			if (bbs_status) {
				if (bbs_status == 1) {
					//app已登录并获取到loginToken
					me.bbsAppLogin(bbs_token, null);
					if (window.mySessionStorage) {
						window.mySessionStorage['v_token'] = bbs_token;
					} else {
						window.sessionStorage['v_token'] = bbs_token;
					}
					window.isAppLogined = true;
				} else if (bbs_status == 2) {
					//app已登录，但是未获取到loginToken
					window.isAppLogined = false;
					if (window.mySessionStorage) {
						window.mySessionStorage['v_token'] = "";
						window.mySessionStorage['dataReturn'] = 0;
					} else {
						window.sessionStorage['v_token'] = "";
						window.sessionStorage['dataReturn'] = 0;
					}
					window.isAppLogined = true;
				}
				
			} else {
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
							let uid;
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
								me.bbsAppLogin(v_token, null);
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
					}

				});
			}
		} else {
			me.bbsWebLogin();
		}

	},
	openLogin: function(ReturnUrl, callback) {
		var me = this;
		let dataReturn;
		if (window.mySessionStorage) {
			dataReturn = window.mySessionStorage['dataReturn'];
		} else {
			dataReturn = window.sessionStorage['dataReturn'];
		}
		if (Bbsbridge.isNewVersion() && dataReturn != 0) {
			let v_token;
			if (window.mySessionStorage) {
				v_token = window.mySessionStorage['v_token'];
			} else {
				v_token = window.sessionStorage['v_token'];
			}
			if (v_token) {
				me.bbsAppLogin(v_token, callback);
				// alert('获取用户信息失败，请稍后重试！');
			} else {
				Bbsbridge.toAppLogin();
			}
		} else {
			ReturnUrl = encodeURIComponent(ReturnUrl);
			//https://m.tuandai.com/user/login.aspx?UrlType=json&ReturnUrl={Url:"http://bbs87.tuandai.com:8080/index.php?code=2323&value=2323232"}
			window.location.href = "https://m.tuandai.com/user/login.aspx?ReturnUrl=" + ReturnUrl;
		}
	}
}

if (typeof(module) !== undefined) {
	module.exports = Validate;
}
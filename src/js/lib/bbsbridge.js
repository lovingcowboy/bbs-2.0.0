(function() {
	var isIOS = function() {
		return navigator.userAgent.match(/(iPad|iPhone)/);
	};
	//android注册事件
	var connectWebViewJavascriptBridge = function(callback) {
		if (window.WebViewJavascriptBridge) {
			// callback(WebViewJavascriptBridge)
			callback.call(this, WebViewJavascriptBridge)
		} else {
			document.addEventListener(
				'WebViewJavascriptBridgeReady',
				function() {
					// callback(WebViewJavascriptBridge);
					callback.call(this, WebViewJavascriptBridge)
				},
				false
			);
		}

	};
	//ios调用app方法
	function iosHandler(method, param, callback) {
		window[method](param, function(respones) {
			// console.info("respones------", respones);
			// var _data = JSON.parse(respones[0]);
			typeof callback === 'function' && callback.apply(this, arguments);
			/*if (callback) {
				callback(respones);
			}*/
		});
	}
	//android调用app方法
	var androidHandler = function(method, param, callback) {
		window.WebViewJavascriptBridge.callHandler(
			method, param,
			function(responseData) {
				typeof callback === 'function' && callback.apply(this, arguments);
				// if (callback && typeof callback == "function") {
				// 	callback(responseData);
				// }
			}
		);
	};

	var Bbsbridge = function() {
		var me = this;
	};
	
	/*版本对比 
	@params: equal 是否包含等于 true 包含 false 不包含
	例：v1 > v2 return true 
		v1 >= v2 return true 
	*/
	var compareVersion = function(v1, v2, equal) {	
 		var arr = v1 && v1.split(".");
		var list = v2 && v2.split(".");
		if(!arr || !list) return;

		var i = 0; 
		var arrlength = arr.length;
		var listlength = list.length;
		var length = arrlength > listlength ? arrlength : listlength;	//取最长的数组长度
		var isEqual = false;
		var item1 = "";
		var item2 = "";
		for(; i < length; i++) {
			item1 = Number(arr[i]);
			item2 = Number(list[i]);

			item1 = isNaN(item1) ? 0 : item1;
			item2 = isNaN(item2) ? 0 : item2;
			if(i == length -1) 
				isEqual = item1 === item2 && equal;	//是否包含等于
			
			if(item1 > item2 || isEqual) {
				return true;
			} else if(item1 < item2) {
				return false
			}
		}
		return false;
	};

	Bbsbridge.prototype = {
		constructor: Bbsbridge,
		isNewVersion: function() {
			var str = navigator.userAgent;
			var arr = str.match(/\[([^\[\]]*)\]/);

			if (arr && arr[1]) {
				var vst = arr[1].split('_');
				var vstr = vst[0] + vst[1];
				if (vst && vst[vst.length - 1] >= '4.3.4' && (vstr == "tuandaiappandroid" || vstr == "tuandaiappIOS")) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		},
		/*
			version: 版本号
			mode: String 0-等于；1-大于等于 
		*/
		isCorrectVersion: function(version, mode) {
			mode = mode ? mode : "1";
			var str = navigator.userAgent;
			var arr = str.match(/\[([^\[\]]*)\]/);

			if (arr && arr[1]) {
				var vst = arr[1].split('_');
				var vstr = vst[0] + vst[1];
				if (mode == 1) {
					if (vst && vst[vst.length - 1] >= version && (vstr == "tuandaiappandroid" || vstr == "tuandaiappIOS")) {
						return true;
					} else {
						return false;
					}
				} else {
					if (vst && vst[vst.length - 1] == version && (vstr == "tuandaiappandroid" || vstr == "tuandaiappIOS")) {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		},
		toAppLogin: function() {
			try {
				if (isIOS()) {
					typeof ToAppIosLogin === 'function' && ToAppIosLogin();
					typeof ToAppLogin === 'function' && ToAppLogin();
					/*if (typeof ToAppIosLogin == "function") {
						ToAppIosLogin();
					}
					if (typeof ToAppLogin == "function") {
						ToAppLogin();
					}*/
				} else {
					androidHandler('ToAppLogin', null);
				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		},
		//活动分享
		toActivityAppInviteFriend: function() {
			try {
				if (isIOS()) {
					/*if (typeof ToAppIosActivityShare == "function") {
						ToAppIosActivityShare();
					}
					if (typeof ToAppActivitiesShare == "function") {
						ToAppActivitiesShare();
					}*/
					typeof ToAppIosActivityShare === 'function' && ToAppIosActivityShare();
					typeof ToAppActivitiesShare === 'function' && ToAppActivitiesShare();
				} else {
					androidHandler('ToActivityAppInviteFriend', null);
					androidHandler('ToAppActivitiesShare', null);
				}

			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		},
		//活动分享
		/*
			shareType: 1-活动分享；2-邀请有礼；3-签到分享；4-活动分享2；5-活动分享3
		*/
		ToAppActivity: function(shareType) {
			//不允许传2,3
			if (shareType == 2 || shareType == 3) {
				console("参数错误！");
				return;
			}
			try {
				if (isIOS()) {

					// if (typeof ToAppActivity == "function") {
					// 	ToAppActivity(shareType);
					// }
					typeof ToAppActivity === 'function' && ToAppActivity();
				} else {
					var param = {
						FunctionType: shareType
					}
					androidHandler('ToAppActivity', param);
				}

			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		},

		//非固定插件调用
		/*
		params,--参数 （json），
		iosName：ios方法名
		androidName：android方法名
		callback：回调函数

		*/
		exec: function(methodName, params, callback) {
			console.info('exec --', methodName, params)
			try {
				var handler = isIOS() ? iosHandler : androidHandler;
				handler(methodName, params, callback);
				/*if (isIOS()) {
					console.log("ios-func", methodName);
					iosHandler(methodName, params, callback);

				} else {
					console.log("android-func");
					androidHandler(methodName, params, callback);
				}*/
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		},
		// 生命周期
		/*
            initCallback：初始化回调
            bbsLoginCallback：获取loginToken用于登录
            webonResumeCallback：打开webview回调
         **/
		appBbsLifeHook: function(initCallback, bbsLoginCallback, webonResumeCallback) {
			if (isIOS()) {
				window.LoginTokenBBS = function(data) {
					typeof bbsLoginCallback === 'function' && bbsLoginCallback.apply(this, arguments);
					/*if (bbsLoginCallback && typeof bbsLoginCallback == "function") {
						// arguments[0] = data;
						bbsLoginCallback.apply(this, arguments);
					}*/
				}
				window.ToAppLifeCycle = function(step) {
					if (step == 1) {
						typeof webonResumeCallback === 'function' && webonResumeCallback.apply(this, arguments);
						/*if (webonResumeCallback && typeof webonResumeCallback == "function") {
							webonResumeCallback.apply(this, arguments);
						}*/
					}
					/*else if (step == 2) {
						if (webonPauseCallback && typeof webonPauseCallback == "function") {

							webonPauseCallback.apply(this, arguments);
						}
					}*/
				}

			} else {
				connectWebViewJavascriptBridge(function(bridge) {
					// console.info("bbsbridge-------", window.WebViewJavascriptBridge._messageHandler);
					if (!window.WebViewJavascriptBridge._messageHandler) {
						try {
							bridge.init(function(message, responseCallback) {
								// console.log('JS got a message', message);
								var data = {
									'Javascript Responds': 'bbs connectWebViewJavascriptBridge init---'
								};
								// console.log('JS responding with', data);
								/*if (initCallback && typeof initCallback == "function") {
									arguments[0] = message;
									initCallback.apply(this, arguments);
								}*/
								typeof initCallback === 'function' && initCallback.apply(this, arguments);
								responseCallback(data);
							});
						} catch (e) {
							console.info("Bbsbridge----er--", e);
						}
					}

					bridge.registerHandler("LoginTokenBBS", function(data, responseCallback) {
						var responseData = "Javascript Says Right back aka!";
						typeof bbsLoginCallback == "function" && bbsLoginCallback.apply(this, arguments);
						/*if (bbsLoginCallback && typeof bbsLoginCallback == "function") {
							// bbsLoginCallback(data);
							arguments[0] = data;
							bbsLoginCallback.apply(this, arguments);
						}*/
						responseCallback(responseData);
					});
					bridge.registerHandler("WebonResume", function(data, responseCallback) {
						// document.getElementById("show").innerHTML = ("data from Java: = " + data);
						var responseData = "Javascript Says Right back aka!";
						typeof webonResumeCallback == "function" && webonResumeCallback.apply(this, arguments);
						/*if (webonResumeCallback && typeof webonResumeCallback == "function") {
							arguments[0] = data;
							webonResumeCallback.apply(this, arguments);
						}*/
						responseCallback(responseData);
					});


				});
			}

		}
	};
	var bbsbridge = new Bbsbridge();
	window.Bbsbridge = bbsbridge;
})();

if (typeof(module) !== undefined) {
	module.exports = Bbsbridge;
}


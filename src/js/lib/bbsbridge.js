(function() {
	var isIOS = function() {
		var flag = false;
		if (navigator.userAgent.match(/(iPad|iPhone)/)) {
			flag = true;
		} else if (navigator.userAgent.match(/(Android)/)) {
			flag = false;
		}
		return flag;
	};

	var connectWebViewJavascriptBridge = function(callback) {
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge)
		} else {
			document.addEventListener(
				'WebViewJavascriptBridgeReady',
				function() {
					callback(WebViewJavascriptBridge);
				},
				false
			);
		}

	};

	function iosHandler(method, param, callback) {
		window[method](param, function(respones) {
			console.info("respones------", respones);
			// var _data = JSON.parse(respones[0]);
			// alert(respones);
			if (callback) {
				callback(respones);
			}
		});
	}

	var androidHandler = function(method, param, callback) {
		/*if (param) {
			param = JSON.parse(param);
		}*/
		window.WebViewJavascriptBridge.callHandler(
			method, param,
			function(responseData) {
				// document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
				if (callback && typeof callback == "function") {
					callback(responseData);
				}
			}
		);
	};

	var Bbsbridge = function() {
		var me = this;
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
					if (typeof ToAppIosLogin == "function") {
						ToAppIosLogin();
					}
					if (typeof ToAppLogin == "function") {
						ToAppLogin();
					}
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
					if (typeof ToAppIosActivityShare == "function") {
						ToAppIosActivityShare();
					}
					if (typeof ToAppActivitiesShare == "function") {
						ToAppActivitiesShare();
					}
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

					if (typeof ToAppActivity == "function") {
						ToAppActivity(shareType);
					}
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
			try {
				if (isIOS()) {
					console.log("ios-func", methodName);
					iosHandler(methodName, params, callback);

				} else {
					console.log("android-func");
					androidHandler(methodName, params, callback);
				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		},
		// 生命周期
		appBbsLifeHook: function(bbsLoginCallback, webonResumeCallback) {
			if (isIOS()) {
				window.LoginTokenBBS = function(data) {
					if (bbsLoginCallback && typeof bbsLoginCallback == "function") {
						// bbsLoginCallback(data);
						arguments[0] = data;
						bbsLoginCallback.apply(this, arguments);
					}
				}
				window.ToAppLifeCycle = function(step) {
					if (step == 1) {
						if (webonResumeCallback && typeof webonResumeCallback == "function") {
							// document.getElementById("show2").innerHTML = ("data from ios: = ");
							webonResumeCallback.apply(this, arguments);
						}
					} else if (step == 2) {
						if (webonPauseCallback && typeof webonPauseCallback == "function") {

							webonPauseCallback.apply(this, arguments);
						}
					}
				}

			} else {
				connectWebViewJavascriptBridge(function(bridge) {
					console.info("bbsbridge-------", window.WebViewJavascriptBridge._messageHandler);
					if (!window.WebViewJavascriptBridge._messageHandler) {
						try {
							bridge.init(function(message, responseCallback) {
								console.log('JS got a message', message);
								var data = {
									'Javascript Responds': '测试中文!'
								};
								console.log('JS responding with', data);
								if (initCallback && typeof initCallback == "function") {
									arguments[0] = message;
									initCallback.apply(this, arguments);
								}
								responseCallback(data);
							});
						} catch (e) {
							console.info("Bbsbridge----er--", e);
						}
					}

					bridge.registerHandler("LoginTokenBBS", function(data, responseCallback) {
						var responseData = "Javascript Says Right back aka!";
						if (bbsLoginCallback && typeof bbsLoginCallback == "function") {
							// bbsLoginCallback(data);
							arguments[0] = data;
							bbsLoginCallback.apply(this, arguments);
						}
						responseCallback(responseData);
					});
					bridge.registerHandler("WebonResume", function(data, responseCallback) {
						// document.getElementById("show").innerHTML = ("data from Java: = " + data);
						var responseData = "Javascript Says Right back aka!";
						if (webonResumeCallback && typeof webonResumeCallback == "function") {
							arguments[0] = data;
							webonResumeCallback.apply(this, arguments);
						}
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
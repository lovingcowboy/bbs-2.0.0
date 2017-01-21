(function(global) {

    let ArrayProto = Array.prototype;
    let slice = ArrayProto.slice;
    let nativeForEach = ArrayProto.forEach;
    // Establish the object that gets returned to break out of a loop iteration.
    let breaker = {};

    let each = function(obj, iterator, context) {
        if (obj == null) return obj;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        }
        /*else {
               var keys = _.keys(obj);
               for (var i = 0, length = keys.length; i < length; i++) {
                   if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
               }
           }*/
        return obj;
    }

    let Util = {
        getElHeight: function(el) {   //获取高度
            var headerEl = document.querySelector(el);

            return headerEl ? headerEl.clientHeight : 0;
        },
        pxToRem: function(px, basePx) {
            var basePx = basePx || 75;

            return px / basePx;
        },
        remToPx: function(rem, basePx) {
            var basePx = basePx || parseInt(document.querySelector("html").style.fontSize);

            return rem * basePx;
        },
        pxToPx: function(px, basePx) {
            return this.remToPx(this.pxToRem(px, basePx), basePx);
        },
        pxToRemAdapt: function(px) {
            return this.pxToRem(px, parseInt(document.querySelector("html").style.fontSize));
        },
        unFreeze: function(obj) { //解冻对象
            var ob = {};

            if (obj) {
                if (Array.isArray(obj)) {
                    ob = [];
                }
                for (let prop in obj) {
                    var o = obj[prop];
                    if (typeof obj[prop] === "object") {
                        o = this.unFreeze(obj[prop]);
                    }
                    ob[prop] = o;
                }
            }
            return ob;
        },
        freeze: function(obj) { //冻结对象
            var ob = {};
            if (Object.isFrozen(obj)) {
                return obj;
            }
            if (obj) {
                if (Array.isArray(obj)) {
                    ob = [];
                }
                for (let prop in obj) {

                    if (typeof obj[prop] === "object") {
                        var o = this.freeze(obj[prop]);
                        obj[prop] = o;
                    }
                    ob[prop] = obj[prop];
                }
            }

            each(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (let prop in source) {
                        ob[prop] = source[prop];
                    }
                }
            });

            return Object.freeze(ob);
        },
        myExtend: function(obj, etdObj) { //扩展对象，并不影响原来的对象
            return this.unFreeze(this.freeze(obj, etdObj));
        },
        getElemetByTarget: function(target, cls, until) {   //获取某个元素的父级或同级dom节点
            let result = target;
            if (!result) { //不存在target
                return false;
            }
            let classList = Array.from(result.classList); //转换成数组

            // 寻找到until类名位置为止，默认为body
            if (classList.indexOf(until) > -1 || result.tagName.toLocaleLowerCase() === "body") {
                return false;
            }

            if (classList.indexOf(cls) > -1) { //存在该类名
                return result;
            } else {
                return this.getElemetByTarget(result.parentElement, cls);
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
        setSessionStorage: function(key, param) {
            if (window.sessionStorage) {
                window.sessionStorage[key] = param
            } else {
                window.mySessionStorage[key] = param
            }
        },
        getSessionStorage: function(key) {
            if (window.sessionStorage) {
                return window.sessionStorage[key]
            } else {
                return window.mySessionStorage[key]
            }
        }
    }

    global.Util = Util;
})(window);

if (typeof(module) !== undefined) {
    module.exports = Util;
}
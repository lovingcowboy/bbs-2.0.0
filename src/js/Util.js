(function(global) {
    function scrolling(e) {
        preventDefault(e);
    }

    function preventDefault(e) {
        e = e || global.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

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
        pxToRem: function(px, basePx) {
            var basePx = basePx || parseInt(document.querySelector("html").style.fontSize) || 75;

            return px / basePx;
        },
        remToPx: function(rem, basePx) {
            var basePx = basePx || parseInt(document.querySelector("html").style.fontSize);

            return rem * basePx;
        },
        pxToPx: function(px, basePx) {
            return this.remToPx(this.pxToRem(px, basePx), basePx);
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
        getElemetByTarget: function(target, cls, until) {
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
        disableScrolling: function() {
            if (global.addEventListener) {
                global.addEventListener('DOMMouseScroll', scrolling, false);
                global.addEventListener('touchmove', scrolling, false);
                global.onmousewheel = scrolling;
                if (global.document) {
                    global.document.onmousewheel = scrolling;
                }
            }
        },

        enableScrolling: function() {
            if (global.removeEventListener) {
                global.removeEventListener('DOMMouseScroll', scrolling, false);
                global.removeEventListener('touchmove', scrolling, false);
            }
            global.onmousewheel = null;
            if (global.document) {
                global.document.onmousewheel = null;
            }
        }
    }


    global.Util = Util;
})(window);

if (typeof(module) !== undefined) {
    module.exports = Util;
}

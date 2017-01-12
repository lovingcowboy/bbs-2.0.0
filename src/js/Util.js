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

    let Util = {
        getElemetByTarget: function(target, cls, until) {
            let result = target;
            if(!result) {   //不存在target
                return false;
            }
            let classList = Array.from(result.classList);   //转换成数组
            
            // 寻找到until类名位置为止，默认为body
            if(classList.indexOf(until) > -1 || result.tagName.toLocaleLowerCase() === "body") {
                return false;
            }
            
            if(classList.indexOf(cls) > -1) {   //存在该类名
                return result;
            } else {
               this.getElemetByTarget(result.parentElement, cls); 
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
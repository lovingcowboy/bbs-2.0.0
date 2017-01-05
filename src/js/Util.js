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

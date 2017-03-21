import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// import MainView from '../views/MainView.vue'
// import CenterMyView from '../views/CenterMyView.vue'
// import CenterOtherView from '../views/CenterOtherView.vue'
// import PostDetailView from '../views/PostDetailView.vue'
// import ChangeTBView from '../views/ChangeTBView.vue'
// import MyMessageView from '../views/MyMessageView.vue'
// import MyPostView from '../views/MyPostView.vue'
// import MyReplyView from '../views/MyReplyView.vue'
// import MyCollectionView from '../views/MyCollectionView.vue'
// import MessageDetailView from '../views/MessageDetailView.vue'
// import ReplyView from '../views/ReplyView.vue'
// import MarkView from '../views/MarkView.vue'
// import PostView from '../views/PostView.vue'
// import SessionListView from '../views/SessionListView.vue'
// import RecommentView from '../views/RecommentView.vue'
const router = new Router({
    mode: 'hash',
    routes: [{
        path: '/main',
        name: 'main',
        component: function(resolve) {
            require.ensure(['../views/MainView.vue'], function(require) {
                var MainView = require('../views/MainView.vue');
                resolve(MainView);
            });
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/recomment',
        name: 'recomment',
        component: function(resolve) {
            require.ensure(['../views/RecommentView.vue'], function(require) {
                var RecommentView = require('../views/RecommentView.vue');
                resolve(RecommentView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/postdetail/:id',
        name: 'postdetail',
        component: function(resolve) {
            require.ensure(['../views/PostDetailView.vue'], function(require) {
                var PostDetailView = require('../views/PostDetailView.vue');
                resolve(PostDetailView);
            })
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/postdetail/reply/:tid',
        name: 'reply',
        component: function(resolve) {

            require.ensure(['../js/lib/lrz.js', '../views/ReplyView.vue'], function(require) {
                require('../js/lib/lrz.js');
                var EditView = require('../views/ReplyView.vue');
                resolve(EditView);
            });
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/postdetail/mark/:tid/:pid',
        name: 'mark',
        component: function(resolve) {
            require.ensure(['../views/MarkView.vue'], function(require) {
                var MarkView = require('../views/MarkView.vue');
                resolve(MarkView);
            })
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/post',
        name: 'post',
        component: function(resolve) {
            require.ensure(['../js/lib/lrz.js', '../views/PostView.vue'], function(require) {
                require('../js/lib/lrz.js');
                var PostView = require('../views/PostView.vue');
                resolve(PostView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/post/addvote',
        name: 'addvote',
        component: function(resolve) {
            require.ensure(['../views/AddVoteView.vue'], function(require) {
                var AddVoteView = require('../views/AddVoteView.vue')
                resolve(AddVoteView)
            })
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/centermy',
        name: 'centermy',
        component: function(resolve) {
            require.ensure(['../js/lib/lrz.js', '../views/CenterMyView.vue'], function(require) {
                require('../js/lib/lrz.js');
                var CenterMyView = require('../views/CenterMyView.vue');
                resolve(CenterMyView);
            })
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/centerother/:id',
        name: 'centerother',
        component: function(resolve) {
            require.ensure(['../views/CenterOtherView.vue'], function(require) {
                var CenterOtherView = require('../views/CenterOtherView.vue');
                resolve(CenterOtherView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/user/changetb',
        name: 'changetb',
        component: function(resolve) {
            require.ensure(['../views/ChangeTBView.vue'], function(require) {
                var ChangeTBView = require('../views/ChangeTBView.vue');
                resolve(ChangeTBView);
            })
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/user/mymessage',
        name: 'mymessage',
        component: function(resolve) {
            require.ensure(['../views/MyMessageView.vue'], function(require) {
                var MyMessageView = require('../views/MyMessageView.vue');
                resolve(MyMessageView);
            })
        },
        meta: {
            keepAlive: false
        }
    }, {
        path: '/user/mypost',
        name: 'mypost',
        component: function(resolve) {
            require.ensure(['../views/MyPostView.vue'], function(require) {
                var MyPostView = require('../views/MyPostView.vue');
                resolve(MyPostView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/user/myreply',
        name: 'myreply',
        component: function(resolve) {
            require.ensure(['../views/MyReplyView.vue'], function(require) {
                var MyReplyView = require('../views/MyReplyView.vue');
                resolve(MyReplyView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/user/mycollection',
        name: 'mycollection',
        component: function(resolve) {
            require.ensure(['../views/MyCollectionView.vue'], function(require) {
                var MyCollectionView = require('../views/MyCollectionView.vue');
                resolve(MyCollectionView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, /*{
        path: '/user/messagedetail/:id',
        name: 'messagedetail',
        component: function(resolve) {
            require.ensure(['../views/MessageDetailView.vue'], function(require) {
                var MessageDetailView = require('../views/MessageDetailView.vue');
                resolve(MessageDetailView);
            })
        },
        meta: {
            keepAlive: false
        }
    },*/ {
        path: '/sessionlist/:fid',
        name: 'sessionlist',
        component: function(resolve) {
            require.ensure(['../views/SessionListView.vue'], function(require) {
                var SessionListView = require('../views/SessionListView.vue');
                resolve(SessionListView);
            })
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '*',
        redirect: '/main'
    }]
})

export default router
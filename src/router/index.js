import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import MainView from '../views/MainView.vue'
import CenterMyView from '../views/CenterMyView.vue'
import CenterOtherView from '../views/CenterOtherView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import ChangeTBView from '../views/ChangeTBView.vue'
import MyMessageView from '../views/MyMessageView.vue'
import MyPostView from '../views/MyPostView.vue'
import MyReplyView from '../views/MyReplyView.vue'
import MyCollectionView from '../views/MyCollectionView.vue'
import MessageDetailView from '../views/MessageDetailView.vue'
import ReplyView from '../views/ReplyView.vue'
import MarkView from '../views/MarkView.vue'
import PostView from '../views/PostView.vue'
import SessionListView from '../views/SessionListView.vue'
import RecommentView from '../views/RecommentView.vue'
const router = new Router({
  mode: 'hash',
  routes: [
    {path: '/main', name: 'main', component: MainView},
    {path: '/recomment', name: 'recomment', component: RecommentView},
    {path: '/postdetail/:id', name: 'postdetail', component: PostDetailView},
    {path: '/postdetail/reply/:id', name: 'reply', component: ReplyView},
    {path: '/postdetail/mark/:id', name: 'mark', component: MarkView},
    {path: '/post', name: 'post', component: PostView},
    {path: '/centermy', name: 'centermy', component: CenterMyView},
    {path: '/centerother/:id', name: 'centerother', component: CenterOtherView},
    {path: '/user/changetb', name: 'changetb', component: ChangeTBView},
    {path: '/user/mymessage', name: 'mymessage', component: MyMessageView},
    {path: '/user/mypost', name: 'mypost', component: MyPostView},
    {path: '/user/myreply', name: 'myreply', component: MyReplyView},
    {path: '/user/mycollection', name: 'mycollection', component: MyCollectionView},
    {path: '/user/messagedetail/:id', name: 'messagedetail', component: MessageDetailView},
    {path: '/sessionlist/:id', name: 'sessionlist', component: SessionListView},
    {path: '*', redirect: '/main'}
  ]
})

export default router

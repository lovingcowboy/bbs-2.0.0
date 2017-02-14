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
    {path: '/main', name: 'main', component: MainView, meta: {keepAlive: true}},
    {path: '/recomment', name: 'recomment', component: RecommentView, meta: {keepAlive: false}},
    {path: '/postdetail/:id', name: 'postdetail', component: PostDetailView, meta: {keepAlive: false}},
    {path: '/postdetail/reply/:tid', name: 'reply', component: ReplyView, meta: {keepAlive: false}},
    {path: '/postdetail/mark/:tid/:pid', name: 'mark', component: MarkView, meta: {keepAlive: false}},
    {path: '/post', name: 'post', component: PostView, meta: {keepAlive: false}},
    {path: '/centermy', name: 'centermy', component: CenterMyView, meta: {keepAlive: false}},
    {path: '/centerother/:id', name: 'centerother', component: CenterOtherView, meta: {keepAlive: false}},
    {path: '/user/changetb', name: 'changetb', component: ChangeTBView, meta: {keepAlive: false}},
    {path: '/user/mymessage', name: 'mymessage', component: MyMessageView, meta: {keepAlive: false}},
    {path: '/user/mypost', name: 'mypost', component: MyPostView, meta: {keepAlive: false}},
    {path: '/user/myreply', name: 'myreply', component: MyReplyView, meta: {keepAlive: false}},
    {path: '/user/mycollection', name: 'mycollection', component: MyCollectionView, meta: {keepAlive: false}},
    {path: '/user/messagedetail/:id', name: 'messagedetail', component: MessageDetailView, meta: {keepAlive: false}},
    {path: '/sessionlist/:id', name: 'sessionlist', component: SessionListView, meta: {keepAlive: false}},
    {path: '*', redirect: '/main'}
  ]
})

export default router

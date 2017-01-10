import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// import view1 from '../views/view1.vue'
// import Mission from '../views/Mission.vue'

// export default new Router({
//   mode: 'hash',
//   routes: [
//     {path: '/view1', component: view1},
//     {path: '/personal', name: 'personal', component: PersonalView},
//     {path: '/mission', name: 'mission', component: Mission},
//     {path: '/invite', name: 'invite', component: Invite},
//     {path: '/mission/daily', name: 'daily', component: DailyMission},
//     {path: '/mission/detail/:id', name: 'missiondetail', component: MissionDetail},
//     {path: '/invite/posttoinvite', name: 'posttoinvite', component: PostToInvite},
//     {path: '/invite/scantoinvite', name: 'scantoinvite', component: ScanToInvite},
//     {path: '/invite/share', name: 'share', component: SharePage},
//     {path: '/personal/detail', name: 'personaldetail', component: PaymentDetail},
//     {path: '/personal/my', name: 'my', component: MyView},
//     {path: '/personal/other', name: 'other', component: OtherView},
//     {path: '/personal/applies', name: 'applies', component: AppliesView},
//     {path: '/personal/applydetail/:type', name: 'applydetail', component: ApplyDetail},
//     {path: '*', redirect: '/mission'}
//   ]
// })
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
export default new Router({
  mode: 'hash',
  routes: [
    {path: '/main', name: 'main', component: MainView},
    {path: '/postdetail/:id', name: 'postdetail', component: PostDetailView},
    {path: '/postdetail/reply/:id', name: 'reply', component: ReplyView},
    {path: '/postdetail/mark/:id', name: 'mark', component: MarkView},
    {path: '/centermy', name: 'centermy', component: CenterMyView},
    {path: '/centerother/:id', name: 'centerother', component: CenterOtherView},
    {path: '/user/changetb', name: 'changetb', component: ChangeTBView},
    {path: '/user/mymessage', name: 'mymessage', component: MyMessageView},
    {path: '/user/mypost', name: 'mypost', component: MyPostView},
    {path: '/user/myreply', name: 'myreply', component: MyReplyView},
    {path: '/user/mycollection', name: 'mycollection', component: MyCollectionView},
    {path: '/user/messagedetail/:id', name: 'messagedetail', component: MessageDetailView},
    {path: '*', redirect: '/main'}
  ]
})

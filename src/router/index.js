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
import Main from '../views/MainView.vue'
import Center_MyView from '../views/Center_MyView.vue'
export default new Router({
  mode: 'hash',
  routes: [
    {path: '/main', name: 'main', component: Main},
    {path: '/center_my', name: 'center_my', component: Center_MyView},
    {path: '*', redirect: '/main'}
  ]
})

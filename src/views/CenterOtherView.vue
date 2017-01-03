<template>
  <div class="center-my-view">
    <zheader 
      :header-title="'个人中心'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader> 
    <div class="content">
      <div class="contetn-header">
        <div class="md01">
          <img class="avatar" src="../images/icon-avatar.png">
          <div class="userInfo-right">
            <div class="username">{{userInfo.username}}</div>
            <div class="other-baseinfo">
              <div class="row01 baseinfo-row">
                <div class="post">{{userInfo.post}}</div>
                <div class="label">TA的主题</div>
              </div>
              <div class="row02 baseinfo-row">
                <div class="reply">{{userInfo.reply}}</div>
                <div class="label">TA的回帖</div>
              </div>
              <div class="row03 baseinfo-row">
                <div class="friends">{{userInfo.friends}}</div>
                <div class="label">TA的好友</div>
              </div>
            </div>
          </div>
        </div>
       
        <div class="level-wrapper">
          <span class="icon-level"></span>
          <div class="level-name">
            {{userInfo.level_name}}
          </div>
        </div>
        <div class="md">
          <div class="integral md-item">{{userInfo.credit}}积分</div>
          <div class="line"></div>
          <div class="prestige md-item">{{userInfo.prestige}}威望</div>
        </div>
        <div class="label">还差{{userInfo.disparity}}积分升级成为“{{userInfo.next_level_name}}”</div>
      </div>
    
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'

export default {
  name: 'mission',
  components: {
    Zheader
  },
  data () {
    return {
      userInfo: {
        avatar: "../images/icon-avatar.png",
        username: "萱萱宝贝",
        level:2,
        level_name:"社区大虾",
        credit :165,
        prestige: 120,
        disparity: 20,
        next_level_name: "社区能手",
        series_sign_num : 0,
        yes_sign: 0,
        reply: 120,
        friends: 10,
        post:120
      },
     
    }
  },
  methods: {
   
  },
  beforeMount () {

  }
}
</script>

<style lang="scss" scoped>
@import "../sass/centerOther.scss";

</style>

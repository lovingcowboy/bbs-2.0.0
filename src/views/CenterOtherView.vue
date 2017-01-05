<template>
  <div class="center-my-view scroll" :class="{'scroll-active': isScrollActive}">
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
          <span class="icon-star"></span>
          <div class="level-name">
            {{userInfo.level_text}}
          </div>
        </div>
        <div class="md02">
          <div class="integral">
            <span class="icon-integral"></span>
            <font>{{userInfo.credit}}积分</font>
          </div>
          <div class="prestige">
            <span class="icon-prize"></span>
            <font>{{userInfo.prestige}}威望</font>
          </div>
          <div class="btn-message">发消息</div>
        </div>
      </div>
      <div class="dynamic">
        <div class="label">TA的动态</div>
         <ul class="post-list">
          <post-item v-for="(item, index) in postList" :data="item" v-on:onItemClick="goDetail(item.id)"></post-item>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
export default {
  components: {
    Zheader,
    Toast,
    PostItem
  },
  data () {
    return {
      isScrollActive: true,
      userInfo: {
        avatar: "../images/icon-avatar.png",
        username: "萱萱宝贝",
        level:2,
        level_name:"社区大虾",
        level_text: "有问必答、畅所欲言等4个版块的版主",
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
      postList: []
    }
  },
  methods: {
   
  },
  beforeMount () {

  },
  mounted () {
    let that = this
    for (let i = 0; i < 5; i++) {
      let item = {
        name: '神采飞扬',
        act: '发表了帖子',
        time: i * 10 + '分钟前',
        pTitle: '团贷网大踏步走在紧拥监管，跨越发展之路上',
        pDesc: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
        view: 12 * i,
        reply: 25 * i,
        id: i * 10
      }
      if ( i === 1) {
        item.hasImg = true
      }
      that.postList.push(item)
      
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/centerother.scss";

</style>

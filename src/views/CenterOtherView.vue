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
          <li class="post-row">
            <div class="item-title">
              <span>
                <img src="../images/pai.png"><font>神采飞扬</font>发表了帖子
              </span>
              <span>32分钟前</span>
            </div>
            <div class="item-desc">
              <div class="post">
                <p>团贷网大踏步走在紧拥监管，跨越发展之路上</p>
                <p>如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！</p>
              </div>
              <div class="p-img">
                <img src="../images/img.png">
              </div>
            </div>
            <div class="item-message">
              <span class="post-view">1234</span>
              <span class="post-reply">789</span>
            </div>
          </li>
          <li class="post-row">
            <div class="item-title">
              <span>
                <img src="../images/pai.png"><font>神采飞扬</font>发表了帖子
              </span>
              <span>32分钟前</span>
            </div>
            <div class="item-desc">
              <div class="post no-img">
                <p>团贷网大踏步走在紧拥监管，跨越发展之路上</p>
                <p>如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！</p>
              </div>
            </div>
            <div class="item-message">
              <span class="post-view">1234</span>
              <span class="post-reply">789</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
export default {
  components: {
    Zheader,
    Toast
  },
  data () {
    return {
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

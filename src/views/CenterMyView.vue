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
        <div class="btn-edit edit-btn" v-show="!editing" @click="onEdit();"></div>
        <div class="btn-edit-done edit-btn" v-show="editing" @click="onEditDone();">完成</div>

        <div class="avatar-wrapper">
          <div class="avatar-mask" v-show="editing">
            <img class="avatar-edit" src="../images/avatar-edit.png">
          </div>
          <img class="avatar" src='../images/icon-avatar.png'>
        </div>
        <div class="name-wrapper" :class = 'isEditing' >
          <input class="name-txt" maxlength="30" :readonly ='editing == true ? readonly : ""' :value='userInfo.username' />
        </div>
        <div class="level-wrapper">
          <div class="icon-level-wrapper">
            <span class="icon-level">{{userInfo.level}}</span>
          </div>
          <div class="level-name">
            <font>LV{{userInfo.level}}</font>
            <span class="point">LV{{userInfo.level}}</span>
            <font>{{userInfo.level_name}}</font>
          </div>
        </div>
        <div class="md">
          <div class="integral md-item">{{userInfo.credit}}积分</div>
          <div class="line"></div>
          <div class="prestige md-item">{{userInfo.prestige}}威望</div>
        </div>
        <div class="label">还差{{userInfo.disparity}}积分升级成为“{{userInfo.next_level_name}}”</div>
      </div>
      <div class="sign-wrapper">
        <div class="sign-text">已连续签到<font>{{userInfo.series_sign_num}}</font>天</div>
        <div class="sign-btn btn-blue" v-show="!userInfo.yes_sign" @click="onSign();">马上签到</div>
        <div class="sign-done btn-grey" v-show="!!userInfo.yes_sign">
          <span class="icon icon-signed"></span>
          <font>已签到</font>
        </div>
      </div>
      <ul class="ubody">
        <li class="urow" @click="goUItemDetail('/user/mypost',0);">
          <span class="icon icon-post"></span>
          <font>我的帖子</font>
          <span class="icon-arrow-right"></span>
        </li>
        <li class="urow" @click="goUItemDetail('/user/mypost',0);">
          <span class="icon icon-reply"></span>
          <font>我的回复</font>
          <span class="icon-arrow-right"></span>
        </li>
        <li class="urow" @click="goUItemDetail('/user/mypost',0);">
          <span class="icon icon-message"></span>
          <font>我的消息</font>
          <span class="icon-arrow-right"></span>
        </li>
        <li class="urow" @click="goUItemDetail('/user/mypost',0);">
          <span class="icon icon-heart"></span>
          <font>我的收藏</font>
          <span class="icon-arrow-right"></span>
        </li>

        <li class="urow" @click="goUItemDetail('/user/changetb',2);">
          <span class="icon icon-coin"></span>
          <font>威望兑团币</font>
          <span class="icon-arrow-right"></span>
        </li>
    </ul>
    <div class="logoutbtn" @click="goLogout();" v-show="!isApp">退出登录</div>
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
        username: "团小贷",
        level:2,
        level_name:"社区大虾",
        credit :165,
        prestige: 120,
        disparity: 20,
        next_level_name: "社区能手",
        series_sign_num : 0,
        yes_sign: 0
      },
      editing: false,
      isEditing: ""
    }
  },
  methods: {
    onEdit() {
      this.editing = true;
      this.isEditing = "editing"
    },

    onEditDone() {
       this.editing = false;
       this.isEditing = ""
    },
    onSign() {
      
      this.userInfo.yes_sign = 1;
      console.log("签到");
    }
   
  },
  beforeMount () {

  }
}
</script>

<style lang="scss" scoped>
@import "../sass/centerMy.scss";

</style>

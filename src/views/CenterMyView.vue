<template>
  <div class="center-my-view">
    <zheader 
      :header-title="'个人中心'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
      <div class="content">
        <div class="contetn-header">
          <div class="btn-edit edit-btn" v-show="!editing" @click="onEdit();"></div>
          <div class="btn-edit-done edit-btn" v-show="editing" @click="onEditDone();">完成</div>

          <div class="avatar-wrapper">
            <div class="avatar-mask" v-show="editing">
              <img class="avatar-edit" src="../images/avatar-edit.png" />
            </div>
            <img class="avatar" src='../images/icon-avatar.png' />
          </div>
          <div class="name-wrapper" :class='isEditing' >
            <input class="name-txt" maxlength="30" :readonly ='editing == true ? readonly : ""' :value='userInfo.username' />
          </div>
          <div class="level-wrapper">
            <div class="icon-level-wrapper">
              <span class="icon-level">{{userInfo.level}}</span>
            </div>
            <div class="level-name">
              <font>LV{{userInfo.level}}</font>
              <span class="point"></span>
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
          <div class="sign-btn btn-blue" v-show="userInfo.yes_sign == '1' ? false : true" @click="onSign();">马上签到</div>
          <div class="sign-done btn-grey" v-show="userInfo.yes_sign == '1' ? true : false">
            <span class="icon icon-signed"></span>
            <font>已签到</font>
          </div>
        </div>
        <ul class="ubody">
          <li class="urow" @click="goUItemDetail('/user/mypost');">
            <span class="icon icon-post"></span>
            <font>我的帖子</font>
            <span class="icon-arrow-right"></span>
          </li>
          <li class="urow" @click="goUItemDetail('/user/myreply');">
            <span class="icon icon-reply"></span>
            <font>我的回复</font>
            <span class="icon-arrow-right"></span>
          </li>
          <li class="urow" @click="goUItemDetail('/user/mymessage');">
            <span class="icon icon-message"></span>
            <font>我的消息</font>
            <span class="icon-arrow-right"></span>
          </li>
          <li class="urow" @click="goUItemDetail('/user/mycollection');">
            <span class="icon icon-heart"></span>
            <font>我的收藏</font>
            <span class="icon-arrow-right"></span>
          </li>

          <li class="urow" @click="goUItemDetail('/user/changetb');">
            <span class="icon icon-coin"></span>
            <font>威望兑团币</font>
            <span class="icon-arrow-right"></span>
          </li>
        </ul>
        <div class="logoutbtn" @click="goLogout();" v-show="!isApp">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Validate from '../js/lib/validate.js'
import Services from '../services'
import { isApp } from '../filters'
export default {
  components: {
    Zheader,
    Toast
  },
  data () {
    return {
      isScrollActive: true,
      userInfo: {},
      editing: false,
      isEditing: ""
    }
  },
  computed: {
    isApp:function() {
      return isApp();
    }
  },
  methods: {
    getUserInfo() { //获得用户信息
      let that = this;
      let param = {
        version: 4,
        module: 'member'
      }

      Services.postData('/app/index.php', param).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          // console.log(data);
          that.userInfo = data.member;
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
          // console.log("fail")
      })
    },
    onEdit() {
      this.editing = true;
      this.isEditing = "editing"
    },
    onEditDone() {
       this.editing = false;
       this.isEditing = ""
    },
    onSign() {
      let that = this;
      let param = {
        version: 4,
        module: 'member',
        action: 'sign'
      }

      Services.postData('/app/index.php', param).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

          let userInfo = that.userInfo;
          let member = data.member;
          
          userInfo.series_sign_num = member.series_sign_num;
          userInfo.yes_sign = 1;
          userInfo.credit = member.credit;
          userInfo.prestige = member.extcredits1;
          userInfo.next_level_name = member.next_group_name;
          userInfo.level_name = member.group_name;
          userInfo.level_name = member.group_level;
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
      })
    },
    goUItemDetail(url) {
      let uid = "";
      if(window.mySessionStorage) {
        uid = window.mySessionStorage['uid'];
      }else{
        uid = window.sessionStorage['uid'];
      }
      let isLogined_cookie = Validate.getCookie('voHF_b718_auth');
      
      this.$router.push(url);
     
      return;
      if (isLogined_cookie || uid) {  //已登录
         this.$router.push(url);
      } else {  //未登录
        var returnUrl = window.location.href;
        Validate.openLogin(returnUrl, function() {
          this.$router.push(url);
        });
      }
    },

    goLogout() {  //登出
      let that = this;
      let param = {
        version: 4,
        module: 'member',
        action: 'logout'
      }

      Services.postData('/app/index.php', param).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          that.$router.push("main")

        
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
      })
    }
   
  },
  beforeMount () {
    
    this.getUserInfo();  //获取用户信息
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/centermy.scss";

</style>

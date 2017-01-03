<template>
  <div class="v1-view">
  <zheader 
    :header-title="'团粉圈'" 
    :has-back="false" 
    :has-rightbtn="false"
    :prevent-back="true"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="content">
      <div class="u-info">
        <div :class="[{'has-unread': hasUnRead&&isLogin}, {'u-welcome' : !isLogin}, 'avator-cont']" :data-content="unReadNum">
          <img src="../images/pai.png" class="u-avator" v-show="isLogin">
          <!-- <img :src="userInfo.avator" class="u-avator" v-show="isLogin"> -->
        </div>
        <div class="u-det">
          <p class="u-name">团小贷</p>
          <p class="u-data"><span>LV2大侠</span><span>125积分</span><span>66威望</span></p>
        </div>
        <div class="u-sign">
          <div v-show="isLogin" @click="sign()">社区签到</div>
          <div v-show="!isLogin">注册/登录</div>
        </div>
      </div>
      <div class="tabs">
        <span :class="[{'active': tabType === 0}, 'tab']" @click="triggerTab(0)">热门</span>
        <span :class="[{'active': tabType === 1}, 'tab']" @click="triggerTab(1)">最新</span>
        <span :class="[{'active': tabType === 2}, 'tab']" @click="triggerTab(2)">精华</span>
        <span class="tab-module" ><i class="icon-module"></i>板块</span>
      </div>
      <div class="scroll-list">
        <div class="recommend-cont">
          <div class="r-title">
            <span>小编推荐</span>
            <span>更多<i class="icon-arrow-grey"></i></span>
          </div>
          <ul class="swiper-container">
            <li :class="recommentClass" v-for="(item, index) in recommentPosts">
              <span>{{item.title}}</span>
            </li>
            <!-- <li class="recomment-item rb-blue">
              <span>团贷新手攻略</span>
            </li>
            <li class="recomment-item rb-yellow">
              <span>定期理财上线啦</span>
            </li>
            <li class="recomment-item rb-purple">
              <span>C轮融资发布会</span>
            </li>
            <li class="recomment-item rb-blue">
              <span>定期理财上线啦</span>
            </li>
            <li class="recomment-item rb-yellow">
              <span>C轮融资发布会</span>
            </li>
            <li class="recomment-item rb-purple">
              <span>定期理财上线啦</span>
            </li>
            <li class="recomment-item rb-blue">
              <span>C轮融资发布会</span>
            </li> -->
          </ul>
        </div>
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
      <i class="post-add"></i>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
// import { Swipe, SwipeItem } from 'mint-ui'
// import Swipe from '../components/swipe'
// import SwipeItem from '../components/swipe-item'
export default {
  name: 'mission',
  components: {
    Zheader,
    Toast
    // Swipe,
    // SwipeItem
  },
  data () {
    return {
      hasUnRead: false,
      unReadNum: 0,
      isLogin: true,
      tabType: 0,
      userInfo: {},
      recommentPosts: []
    }
  },
  computed: {
    recommentClass: function (index) {
      return {
        'recomment-item': true,
        'rb-blue': index % 6 === 0,
        'rb-yellow': index % 6 === 1,
        'rb-purple': index % 6 === 2,
        'rb-red': index % 6 === 3,
        'rb-green': index % 6 === 4,
        'rb-cyan': index % 6 === 5
      }
    }
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    triggerTab (type) {
      this.tabType = type
    },
    sign () {
      Toast({
        message: '签到成功，积分+3，威望+5'
      })
    }
  },
  beforeMount () {
    let that = this
    that.hasUnRead = true
    that.unReadNum = parseInt(Math.random() * 100)
    for (let i = 0; i < 10; i++) {
      let post = {
        title: '团贷新手攻略' + (i * 10)
      }
      that.recommentPosts.push(post)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";
@import "../sass/func.scss";
.u-info {
  width: 100%;
  height: pxToRem(166px);
  background-color: $color-white;
  border-bottom: 1px solid $border-color;
  font-size: 0;
  white-space: nowrap;
  // padding: 0 pxToRem(30px);
  &>div {
    height: 100%;
    display: inline-block;
    vertical-align: text-bottom;
    position: relative;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
  }
  .has-unread {
    position: relative;
      &:before {
        content: attr(data-content);
        color: $color-white;
        height: pxToRem(30px);
        line-height: pxToRem(30px);
        text-align: center;
        font-size: pxToRem(18px);
        border: 1px solid $color-white;
        border-radius: pxToRem(30px);
        background-color: #fa4c2f;
        padding: 0 pxToRem(10px);
        position: absolute;
        right: pxToRem(20px);
        top: pxToRem(33px);
        z-index: 5;
      }
  }
  .avator-cont {
    width: pxToRem(140px);
    .u-avator {
      width: pxToRem(80px);
      height: pxToRem(80px);
      border-radius: pxToRem(80px);
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: pxToRem(-40px);
      margin-top: pxToRem(-40px);
    }
    
  }
  .u-welcome {
    background-image: url('../images/pai-welcome.png');
    background-size: pxToRem(86px) pxToRem(112px);
    background-repeat: no-repeat;
    background-position: center;
  }
  .u-det {
    width: pxToRem(400px);
    padding-top: pxToRem(50px);
    &>p {
      // display: inline-block;
      width: 100%;
    }
    .u-name {
      font-size: pxToRem($font-size-30);
      color: $txt-color-black;
    }
  }
  .u-data {
    font-size: pxToRem($font-size-24);
    color: $txt-color-grey;
    margin-top: pxToRem(20px);
    &>span:not(:last-child) {
      margin-right: pxToRem(30px);
      position: relative;
      &:before {
        content: "";
        width: pxToRem(8px);
        height: pxToRem(8px);
        border-radius: pxToRem(8px);
        background-color: #e8e8e8;
        position: absolute;
        top: 50%;
        right: pxToRem(-18px);
        margin-top: pxToRem(-4px);
      }
    }
  }
  .u-sign {
    width: pxToRem(210px);
    &>div {
      width: pxToRem(140px);
      height: pxToRem(70px);
      line-height: pxToRem(70px);
      text-align: center;
      background-image: linear-gradient( 0deg, rgb(25,166,255) 0%, rgb(40,201,255) 100%);
      box-shadow: 0px pxToRem(4px) pxToRem(10px) 0px rgba(29, 194, 255, .35);
      border-radius: pxToRem(10px);
      position: absolute;
      right: pxToRem(30px);
      top: 50%;
      margin-top: pxToRem(-35px);
      color: $color-white;
      font-size: pxToRem(26px);
    }
  }
}



.tabs {
  width: 100%;
  height: pxToRem(78px);
  line-height: pxToRem(78px);
  background-color: $color-white;
  color: $txt-color-grey;
  text-align: center;
  font-size: 0;
  white-space: nowrap;
  padding-left: pxToRem(30px);
  .tab {
    font-size: pxToRem($font-size-30);
    width: pxToRem(130px);
  }
  .active {
    color: $txt-color-blue;
    position: relative;
    &:before {
      content: "";
      width: pxToRem(60px);
      height: 0;
      border-bottom: pxToRem(2px) solid $txt-color-blue;
      position: absolute;
      left: pxToRem(35px);
      bottom: 0;
    }
  }
  .tab-module {
    width: pxToRem(330px);
    font-size: pxToRem($font-size-30);
    text-align: right;
    padding-right: pxToRem(30px);
    position: relative;
  }
  .icon-module {
    @include background('../images/icon-module.png', 26px, 26px);
    position: absolute;
    right: pxToRem(100px);
    top: 50%;
    margin-top: pxToRem(-13px);
  }
}
.recommend-cont {
  width: 100%;
  height: pxToRem(310px);
  background-color: $color-white;
  margin-top: pxToRem(20px);
  padding: pxToRem(36px) 0;
  overflow: hidden;
}
.r-title {
  width: 100%;
  height: pxToRem(30px);
  line-height: pxToRem(30px);
  font-size: 0;
  white-space: nowrap;
  padding: 0 pxToRem(30px);
  &>span {
    width: 49.99%;
    font-size: pxToRem($font-size-30);
  }
  &>span:first-child {
    color: $txt-color-black;
    position: relative;
    padding-left: pxToRem(20px);
    &:before {
      content: "";
      width: pxToRem(9px);
      height: pxToRem(30px);
      background-color: $txt-color-blue;
      position: absolute;
      left: 0;
      top: 0
    }
  }
  &>span:last-child {
    text-align: right;
    color: $txt-color-grey-light;
  }
  .icon-arrow-grey {
    margin-left: pxToRem(10px);
  }
}
.swiper-container {
  width: 100%;
  height: pxToRem(240px);
  font-size: 0;
  white-space: nowrap;
  margin-top: pxToRem(40px);
  overflow: auto;
  &>li:first-child {
    margin-left: pxToRem(30px);
  }
  &>li:last-child {
    margin-right: pxToRem(30px);
  }
  .recomment-item {
    width: pxToRem(302px);
    height: pxToRem(192px);
    display: inline-block;
    font-size: pxToRem($font-size-30);
    color: $color-white;
    text-align: center;
    box-shadow: 0px pxToRem(10px) pxToRem(20px) 0px rgba( 0, 0, 0, .1);
    width: pxToRem(270px);
    height: pxToRem(162px);
    border-radius: pxToRem(20px);
    margin: 0 pxToRem(10px);
    background-repeat: no-repeat, no-repeat;
    background-size: pxToRem(270px) pxToRem(160px), 100% 100%;
    // background-image: url('../images/r-bg.png');
    // background-repeat: no-repeat;
    // background-size: pxToRem(270px) pxToRem(160px);
    background-position: center bottom, 0 0;
    span {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // padding-bottom: pxToRem(20px);
    }
  }
  .rb-blue {
    background-image: url('../images/r-bg.png'), linear-gradient(0deg, rgb(23,185,238) 0%, rgb(46,214,255) 100%);
  }
  .rb-yellow {
    background-image: url('../images/r-bg.png'), linear-gradient(0deg, rgb(255,173,66) 0%, rgb(255,205,52) 100%);
  }
  .rb-purple {
    background-image: url('../images/r-bg.png'), linear-gradient(0deg, rgb(132,132,255) 0%, rgb(120,171,255) 100%);
  }
  .rb-red {
    background-image: url('../images/r-bg.png'), linear-gradient(0deg, rgb(255,124,114) 0%, rgb(255,165,116) 100%);
  }
  .rb-green {
    background-image: url('../images/r-bg.png'), linear-gradient(0deg, rgb(133,208,3) 0%, rgb(183,238,16) 100%);
  }
  .rb-cyan {
    background-image: url('../images/r-bg.png'), linear-gradient(0deg, rgb(5,205,159) 0%, rgb(20,226,219) 100%);
  }
}


.post-list {
  width: 100%;
  background-color: $color-white;
  padding-left: pxToRem(30px);
  font-size: 0;
  margin-top: pxToRem(20px);
  &>li:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }
}
.post-row {
  width: 100%;
  padding: pxToRem(40px) pxToRem(30px) pxToRem(40px) 0;
  // white-space: nowrap;
  
}
.item-title {
  height: pxToRem(42px);
  line-height: pxToRem(42px);
  white-space: nowrap;
  &>span{
    font-size: pxToRem(24px);
    color: $txt-color-grey-light;
  }
  &>span:first-child {
    width: 60%;
    font {
      color: $txt-color-grey-dark;
      margin-right: pxToRem(10px);
    }
  }
  &>span:last-child {
    width: 39.9%;
    text-align: right;
  }
  img {
    width: pxToRem(42px);
    height: pxToRem(42px);
    border-radius: pxToRem(42px);
    vertical-align: top;
    margin-right: pxToRem(20px);
  }
 
}
.item-desc {
  width: 100%;
  // white-space: nowrap;
  margin: pxToRem(40px) 0;
  .no-img {
    width: 100% !important;
  }
  .post {
    display: inline-block;
    width: pxToRem(450px);
    font-size: pxToRem($font-size-48);
    p {
      width: 100%;
      word-wrap: break-word;
      word-break: break-all; 
    }
    &>p:first-child {
      font-size: pxToRem($font-size-30);
      color: $txt-color-black;
      line-height: pxToRem(48px);
    }
    &>p:last-child {
      font-size: pxToRem($font-size-24);
      color: $txt-color-grey;
      line-height: pxToRem(42px);
      margin-top: pxToRem(30px);
    }
  }
  .p-img {
    display: inline-block;
    width: pxToRem(240px);
    text-align: right;
    vertical-align: top;
    img {
      width: pxToRem(200px);
      height: pxToRem(200px);
    }
  }
}
.item-message {
  width: 100%;
  font-size: pxToRem($font-size-20);
  color: $txt-color-grey-light;
  span {
    width: pxToRem(152px);
    // display: inline-block;
    height: pxToRem(22px);
    line-height: pxToRem(22px);
    background-repeat: no-repeat;
    background-position: left;
  }
  .post-view {
    background-image: url('../images/icon-view.png');
    background-size: pxToRem(26px) pxToRem(18px);
    padding-left: pxToRem(36px);
  }
  .post-reply {
    background-image: url('../images/icon-msg.png');
    background-size: pxToRem(22px) pxToRem(20px);
    padding-left: pxToRem(32px);
  }
}
.post-add {
  border-radius: 50%;
  background-image: linear-gradient(0deg, rgb(25,166,255) 0%, rgb(40,201,255) 100%);
  width: pxToRem(90px);
  height: pxToRem(90px);
  z-index: 100;
  opacity: 0.8;
  box-shadow: 0px 4px 10px 0px rgba( 29, 194, 255, .35);
  position: absolute;
  right: pxToRem(30px);
  bottom: pxToRem(40px);
  &:before {
    content: "";
    @include background('../images/edit-white.png', 38px, 44px);
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: pxToRem(-19px);
    margin-top: pxToRem(-22px);
  }
}
.scroll-list {
  width: 100%;
  // overflow-y: scroll;
}


</style>

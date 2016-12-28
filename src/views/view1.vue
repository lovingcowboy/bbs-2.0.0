<template>
  <div class="v1-view">
    <zheader 
    :header-title="'试玩列表'" 
    :has-back="false" 
    :has-rightbtn="true"
    :prevent-back="true"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <p class="m-banner" v-show="showBanner"><span>赚花花解决闪退解决办法，先删除桌面赚花花~~</span><i class="banner-close" @click="showBanner = !showBanner"></i></p>
    <div class="content m-content bz-cont" :class="{'b-cont': showBanner}">
      <spinner :show="loading"></spinner>
        <ul class="m-list" id="mission">
            <p class="m-type">
                <span><i class="icon-menu"></i>当前任务</span>
                <span>今日发放<i class="txt-red">1234元</i></span>
            </p>
            <li class="m-row">
                <div class="m-icon">
                    <!-- <img :src='userInfo.avatar' v-show="userInfo.avatar"> -->
                    <img src="../images/tuandai.png">
                </div>
                <div class="m-det">
                    <span>团贷网</span>
                    <span>
                    <i class="btn-txt">剩余1234份</i>
                    <i class="btn-txt">高额奖励</i>
                  </span>
                </div>
                <div class="m-bent">
                    <i class="b-txt1">+</i>1.50<i class="b-txt2">元</i>
                </div>
            </li>
            <router-link to="view1/dailyMission">
            <li class="m-row">
                <div class="m-icon">
                    <!-- <img :src='userInfo.avatar' v-show="userInfo.avatar"> -->
                    <img src="../images/daily_task.png">
                </div>
                <div class="m-det">
                    <span>每日任务</span>
                    <span>
                    <i class="btn-txt">还可完成3次</i>
                    <i class="btn-txt">每日重置</i>
                  </span>
                </div>
                <div class="m-bent">
                    <i class="b-txt1">+</i>5.00<i class="b-txt2">元</i>
                </div>
            </li>
            </router-link>
            <li class="m-row">
                <div class="m-icon">
                    <!-- <img :src='userInfo.avatar' v-show="userInfo.avatar"> -->
                    <img src="../images/invitation.png">
                </div>
                <div class="m-det">
                    <span>邀请好友</span>
                    <span>
                    <i class="btn-txt">剩余1234份</i>
                    <i class="btn-txt">高额奖励</i>
                  </span>
                </div>
                <div class="m-bent">
                    <i class="b-txt1">+</i>8.00<i class="b-txt2">元</i>
                </div>
            </li>
             <p class="m-type">
                <span><i class="icon-clock"></i>即将开始</span>
                <!-- <span>今日发放<i class="txt-red">1234元</i></span> -->
            </p>
            <li class="m-row">
                <div class="m-icon">
                    <!-- <img :src='userInfo.avatar' v-show="userInfo.avatar"> -->
                    <img src="../images/mysterious_task.png">
                </div>
                <div class="m-det">
                    <span>神秘任务</span>
                    <span>
                    <i class="btn-txt">剩余1234份</i>
                    <i class="btn-txt">高额奖励</i>
                  </span>
                </div>
                <div class="m-bent">
                    <i class="b-txt1">+</i>8.00<i class="b-txt2">元</i>
                </div>
            </li>
             <p class="m-type">
                <span><i class="icon-checked"></i>已完成</span>
                <!-- <span>今日发放<i class="txt-red">1234元</i></span> -->
            </p>
            <li class="m-row">
                <div class="m-icon">
                    <!-- <img :src='userInfo.avatar' v-show="userInfo.avatar"> -->
                    <img src="../images/tuandai.png">
                </div>
                <div class="m-det">
                    <span>团贷网</span>
                    <span>
                    <i class="btn-txt">剩余1234份</i>
                    <i class="btn-txt">高额奖励</i>
                  </span>
                </div>
                <div class="m-bent">
                    <span class="f-txt">已完成</span>
                </div>
            </li>
            <li class="m-row">
                <div class="m-icon">
                    <!-- <img :src='userInfo.avatar' v-show="userInfo.avatar"> -->
                    <img src="../images/tuandai.png">
                </div>
                <div class="m-det">
                    <span>团贷网</span>
                    <span>
                    <i class="btn-txt">剩余1234份</i>
                    <i class="btn-txt">高额奖励</i>
                  </span>
                </div>
                <div class="m-bent">
                    <span class="f-txt">已完成</span>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'
import Zheader from '../components/Header.vue'
import userService from '../services/userService'
import MessageBox from '../components/message-box'
// import Toast from '../components/toast'

export default {
  name: 'view1',

  components: {
    Zheader,
    Spinner
  },

  data () {
    // const isInitialRender = !this.$root._isMounted
    return {
      loading: true,
      transition: 'slide-left',
      showBanner: true
    }
  },

  methods: {
    headerRightBtnFun () {
      console.log(12324)
    }
  },

  beforeMount () {
    userService.getUser({'version': 4, 'module': 'member'}).then((response) => { console.log(response) }, (response) => {})
  },

  mounted () {
    MessageBox({
      // icon: '../../images/wx.png',
      message: '切换后，现有未绑定手机的账号将被清空，真的要继续吗?',
      showCancelButton: true,
      closeOnClickModal: false
    }).then(action => {
      console.log(action)
    })

    // Toast({
    //   message: '切换后，现有未绑定手机的账号将被清空，真的要继续吗'
    // })
  }
}
</script>

<style lang="scss">
@import "../sass/variables.scss";
@import "../sass/func.scss";
.m-content {
  background: #F4F4F4;
  // overflow: hidden !important;
  // *{
  //   box-sizing: border-box;
  // }
  // span, i, ul, li {
  //   display: inline-block;
  // }
}
  .m-list {
    width: 100%;
    padding: 0 pxToRem(20px);
    overflow: scroll;
    .m-type {
      width: 100%;
      height: pxToRem(77px);
      line-height: pxToRem(77px);
      font-size: 0;
      color: #666;
      i {
        margin-right: pxToRem(20px);
        // vertical-align: sub;
      }
      &>span {
        width: 49.98%;
        font-size: pxToRem(28px);
      }
      span:nth-of-type(2) {
        text-align: right;
      }
    }
  }
  .txt-red {
    color: #FB435B;
  }
.m-row {
  width: 100%;
  height: pxToRem(150px);
  // background: #fff;
  @include background('../images/m_tem_bg.png', 710px, 150px);
  font-size: 0;
  position: relative;
  margin-bottom: pxToRem(20px);
  div {
    display: inline-block;
    vertical-align: bottom;
  }
  .m-icon {
    padding: pxToRem(35px) pxToRem(28px) pxToRem(35px) pxToRem(32px);
    width: pxToRem(140px);
    height: 100%;
    img {
      width: pxToRem(80px);
      height: pxToRem(80px);
    }
  }
  .m-det {
    height: 100%;
    min-width: pxToRem(300px);
    margin: 0;
    span {
      height: 50%;
      width: 100%;
    }
    &>span:first-child {
      padding-top: pxToRem(28px);
      font-size: pxToRem(32px);
      color: #333;
    }
    &>span:last-child {
      padding-bottom: pxToRem(34px);
      font-size: pxToRem(20px);
      color: #999;
    }
  }
  .btn-txt {
    padding: pxToRem(5px) pxToRem(20px);
    border: 1px solid #B8B8B8;
    border-radius: pxToRem(8px);
    margin-right: pxToRem(27px);
  }
  // .m-bent {
  //   width: pxToRem(180px);
  //   height: pxToRem(78px);
  //   line-height: pxToRem(78px);
  //   position: absolute;
  //   left: pxToRem(527px);
  //   right: pxToRem(24px);
  //   top: pxToRem(36px);
  //   font-size: pxToRem(56px);
  //   color: #FB435B;
  //   .b-txt1 {
  //     font-size: pxToRem(24px);
  //   }
  //   .b-txt2 {
  //     font-size: pxToRem(28px);
  //   }
  //   .f-txt {
  //     font-size: pxToRem(28px);
  //     color: #666;
  //     text-align: center;
  //     width: 80%;
  //   }
  // }
}
.icon-menu {
  @include background('../images/current_task.png', 25px, 20px);
}
.icon-clock {
  @include background('../images/begin.png', 28px, 28px);
}
.icon-checked {
  @include background('../images/completed.png', 26px, 26px);
}

</style>

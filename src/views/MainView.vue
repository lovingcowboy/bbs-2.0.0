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
        <div class="avator-cont">
          <img src="../images/pai.png">
        </div>
        <div class="u-det">
          <p class="u-name">团小贷</p>
          <p class="u-data"><span>LV2大侠</span><span>125积分</span><span>66威望</span></p>
        </div>
        <div class="u-sign">
          <div>社区签到</div>
        </div>
      </div>
      <div class="tabs">
        <span class="tab active" data-type="0">热门</span>
        <span class="tab" data-type="1">精华</span>
        <span class="tab-module" data-type="2"><i class="icon-module"></i>板块</span>
      </div>
      <div class="recommend-cont">
        <div class="r-title">
          <span>小编推荐</span>
          <span>更多<i class="icon-arrow-grey"></i></span>
        </div>
        <div class="swiper-container">
          <!-- <swipe :show-indicators="false">
            <swipe-item>1</swipe-item>
            <swipe-item>2</swipe-item>
            <swipe-item>3</swipe-item>
          </swipe> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
// import { Swipe, SwipeItem } from 'mint-ui'
// import Swipe from '../components/swipe'
// import SwipeItem from '../components/swipe-item'
export default {
  name: 'mission',
  components: {
    Zheader,
    // Swipe,
    // SwipeItem
  },
  data () {
    return {}
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    }
  },
  beforeMount () {}
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
  .avator-cont {
    width: pxToRem(140px);
    img {
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
      box-shadow: 0px pxToRem(4px) pxToRem(10px) 0px rgb( 29, 194, 255 );
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
  .tab {
    font-size: pxToRem($font-size-30);
    width: pxToRem(180px);
  }
  .active {
    color: $txt-color-blue;
    border-bottom: pxToRem(2px) solid $txt-color-blue;
  }
  .tab-module {
    width: pxToRem(390px);
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
  padding: pxToRem(36px) pxToRem(30px);
}
.r-title {
  width: 100%;
  height: pxToRem(30px);
  line-height: pxToRem(30px);
  font-size: 0;
  white-space: nowrap;
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
}




</style>

<template>
  <header id="header" class="header-bar" v-show="show && !isApp">
    <i class="icon-back" v-show="hasBack" @click="leftBtnFunc">{{backTxt}}</i>
      {{headerTitle}}
    <i v-show="hasRightbtn" class="refresh-btn" @click="rightBtnFunc"></i>
  </header><!-- /header -->
</template>

<script>
import { isApp } from '../filters'
  export default {
    data () {
      return {
      }
    },
    computed: {
      isApp() {
        return isApp()
      }
    },
    props: ['headerTitle', 'hasBack', 'backTxt', 'hasRightbtn', 'preventBack', 'show', 'hasLeftBtnFunc'],
    methods: {
      leftBtnFunc () {
        if (this.hasLeftBtnFunc) {
          this.$emit('left-btn-func')
        } else {
          this.goBack()
        }
      },
      goBack () {
        // this.$emit('back-btn-func')
        if (!this.preventBack) {
          // this.$router.back()
          window.history.back()
        }
      },
      rightBtnFunc () {
        this.$emit('right-btn-func')
      }
    },
    beforeMount () {
      console.info('header-----', this.isApp)
    }
  }
</script>

<style lang="scss">
  @import "../sass/variables";
  @import "../sass/func";
  .header-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: pxToRem(90px);
    line-height: pxToRem(90px);
    // background-image: linear-gradient(90deg, #FB435B 2%, #FC6766 99%);
    background-color: #fdfdfd;
    text-align: center;
    color: #212121;
    font-size: pxToRem(40px);
    z-index: 888;
    transform: translateZ(0px);
    &:after {
      content: "";
      position: absolute;
      border-bottom: 1px solid $border-color;
      left: 0;
      right: 0;
      bottom: pxToRem(1px);
      z-index: 999;
      transform: translateZ(0px);
    }
    .icon-back {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: pxToRem(100px);
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        @include background('../images/icon-arrow-left.png', 23px, 41px);
        left: pxToRem(30px);
        margin-top: pxToRem(-14px);
      }
      
    }
    .refresh-btn {
      @extend .icon-back;
      left: auto;
      right: 0;
      &:after {
        // @include background('../images/refresh.png', 42px, 42px);
        left: auto;
        right: pxToRem(30px);
        margin-top: pxToRem(-21px);
      }
    }
  }

</style>
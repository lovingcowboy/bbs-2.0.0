<template>
    <div class="loader-wrapper" v-show="visible">
    <spinner :show="true"></spinner>
    </div>
</template>

<style lang="scss" scoped>
@import "./../../sass/variables.scss";
@import "./../../sass/func.scss";
  .loader-wrapper {
      $length: 92px;
      position: fixed;
      width: pxToRem($length);
      height: pxToRem($length);
      left: 50%;
      top: 50%;
      margin-left: pxToRem(-$length/2);
      margin-top: pxToRem(-$length/2);
      border-radius: pxToRem(10px);
      background: rgba(0, 0, 0, .7);
      color: #fff;
      box-sizing: border-box;
      text-align: center;
      z-index: 99999;
      padding: pxToRem(20px);
  }
</style>

<script type="text/babel">
  import Spinner from '../Spinner.vue'
  export default {
    components: {
      Spinner
    },
    data () {
      return {
        visible: false
      }
    }
  }
</script>
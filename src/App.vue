<template>
  <div id="app">

    <!-- <transition :name="transitionName"> -->
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view :class="{view: true, 'no-footer': !footer}" ></router-view>
    </keep-alive>
     <router-view :class="{view: true, 'no-footer': !footer}" v-else></router-view>
    <!-- </transition> -->
    <!-- <div class="footer" v-show="footer">
      <div class="inner">
        <router-link to="/mission"><i class="icon-mm"></i><span>试玩赚钱</span></router-link>
        <router-link to="/invite"><i class="icon-invite"></i><span>邀请赚钱</span></router-link>
        <router-link to="/personal"><i class="icon-personal"></i><span>个人中心</span></router-link>
      </div>
    </div> -->
  </div>
</template>
<script>
// function hasFooter (path) {
//   let views = ['personal', 'mission', 'daily', 'missiondetail', 'invite']
//   if (views.indexOf(path) !== -1) {
//     return true
//   } else {
//     return false
//   }
// }

export default {
  name: 'app',
  data () {
    return {
      // transitionName: 'slide-left'
      transitionName: '',
      nofooter: 'nofooter',
      footer: false
    }
  },
  computed: {
    // footer () {
    //   return hasFooter(this.$route.name)
    // }
  },
  // dynamically set transition based on route change
  watch: {
    '$route' (to, from) {
      // this.footer = hasFooter(to.name)
    }
  },
  method: {
  },
  beforeMount () {
    // this.footer = hasFooter(this.$route.path)
  }
}
</script>
<style lang="scss">
@import "./sass/variables.scss";
@import "./sass/func.scss";

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing:border-box;
  background-color: #F4F4F4;
}
a {
  color: #34495e;
  text-decoration: none;
}

 
.view {
  width: pxToRem(750px);
  height: 100%;
  margin: 0 auto;
  position: relative;
  transition: all .3s ease-in-out;
  padding-bottom: pxToRem(98px);
  box-sizing: border-box;
  overflow: hidden;
}
.no-footer {
  padding-bottom: 0 !important;
}
  
// .fade-enter-active, .fade-leave-active {
//   transition: all .2s ease;
// }

// .fade-enter, .fade-leave-active {
//   opacity: 0;
// }
.slide-left-enter-active, .slide-right-leave-active {
  // opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active, .slide-right-enter-active {
  // opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
.outLeftInRight-transition,
.fadeOutLeft-transition, 
.fadeInLeft-transition {
  transition: transform .3s ease-in-out;
}
/* 进入时的状态，从右开始 */
.outLeftInRight-enter,
.fadeInLeft-enter,
.fadeInLeft-leave {
  transform: translateX(100%);
}
/* 离开时的状态，向左移动 */
.outLeftInRight-leave,
.fadeOutLeft-enter,
.fadeOutLeft-leave {
  transform: translateX(-100%);
}


</style>

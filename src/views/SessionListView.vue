<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'团粉圈'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
        <div class="content-header">
          <div class="session-name">{{session}}</div>
          <div class="btn-wrapper" @click="onSwitchList">
            <div class="btn btn-all" :class="{'active': isListAllActive}">全部</div>
            <div class="btn btn-essence" :class="{'active': !isListAllActive}">精华</div>
          </div>
        </div>
        <div class="list-all" v-shpw="isListAllActive">
          <div class="list-top">
            <div class=""></div>
          </div>
        </div>
        <div class="list-essence" v-shpw="!isListAllActive"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'

export default {
  name: 'mission',
  components: {
    Zheader,
    Toast
  
  },
  data () {
    return {
      isScrollActive: true,
      session: '投资交流',
      isListAllActive: true
    }
  },
  methods: {
   onSwitchList(e) {
      let target = e.target;
      let prevClass = target._prevClass;
      if(prevClass.indexOf("btn-essence") !== -1) {
        this.isListAllActive = false;
      } else if(prevClass.indexOf("btn-all") !== -1) {
        this.isListAllActive = true;
      }
   }
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/sessionlist.scss";


</style>

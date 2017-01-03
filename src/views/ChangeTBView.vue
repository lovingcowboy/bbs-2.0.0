<template>
  <div class="changetb-view">
  <zheader 
    :header-title="'威望兑团币'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true">
  </zheader> 
  <div class="content">
  
  123123
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
     
    }
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/changetb.scss";
</style>

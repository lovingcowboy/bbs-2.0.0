<template>
  <div class="changetb-view">
  <zheader 
    :header-title="username" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true">
  </zheader> 
  <div class="content">
   
    
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
      username:"小叮当"
    
    }
  },
  methods: {
    
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/messagedetail.scss";
</style>

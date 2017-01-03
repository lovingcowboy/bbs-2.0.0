<template>
  <div class="v1-view">
  <zheader 
    :header-title="'详情'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="content">
      <div class="post-cont">
        
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
export default {
  name: 'postDetail',
  components: {
    Zheader,
    Toast
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    }
  },
  beforeMount () {
  },
  mounted () {
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/postdetail.scss'

</style>

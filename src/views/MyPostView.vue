<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的帖子'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
       <div class="post-list">
         <div class="post-item">
          <div class="line01 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            红包不在多，能匹配合适资金用上最好。
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>
         <div class="post-item">
          <div class="line01 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02">
            <div class="post-time">32分钟前</div>
            <div class="item-message">
              <span class="post-view">21</span>
              <span class="post-reply">1</span>
            </div>
          </div>
         </div>

       </div>
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
    
    }
  },
  methods: {
   
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mypost.scss";


</style>

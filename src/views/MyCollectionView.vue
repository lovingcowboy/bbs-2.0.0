<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的收藏'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
       <div class="collection-list">
         <div class="collection-item">
          <div class="line01">
            <img class="avatar" src="../images/icon-avatar.png" />
            <div class="username">蓝枫</div>
            <div class="collecte-time">32分钟前</div>
          </div>
          <div class="line02 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line03">
            <span class="post-view">21</span>
            <span class="post-reply">1</span>
          </div>
         </div>
         <div class="collection-item">
          <div class="line01">
            <img class="avatar" src="../images/icon-avatar.png" />
            <div class="username">蓝枫</div>
            <div class="collecte-time">32分钟前</div>
          </div>
          <div class="line02 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line03">
            <span class="post-view">21</span>
            <span class="post-reply">1</span>
          </div>
         </div>
         <div class="collection-item">
          <div class="line01">
            <img class="avatar" src="../images/icon-avatar.png" />
            <div class="username">蓝枫</div>
            <div class="collecte-time">32分钟前</div>
          </div>
          <div class="line02 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line03">
            <span class="post-view">21</span>
            <span class="post-reply">1</span>
          </div>
         </div>
         <div class="collection-item">
          <div class="line01">
            <img class="avatar" src="../images/icon-avatar.png" />
            <div class="username">蓝枫</div>
            <div class="collecte-time">32分钟前</div>
          </div>
          <div class="line02 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line03">
            <span class="post-view">21</span>
            <span class="post-reply">1</span>
          </div>
         </div>
         <div class="collection-item">
          <div class="line01">
            <img class="avatar" src="../images/icon-avatar.png" />
            <div class="username">蓝枫</div>
            <div class="collecte-time">32分钟前</div>
          </div>
          <div class="line02 post-title">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line03">
            <span class="post-view">21</span>
            <span class="post-reply">1</span>
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
@import "../sass/mycollection.scss";


</style>

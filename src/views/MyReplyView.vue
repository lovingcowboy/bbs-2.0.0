<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的回复'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
       <div class="reply-list"  @click="goPostDetail">
         <div class="reply-item">
          <div class="line01 reply-body">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02 reply-origin">
            原贴：如果发的红包能匹配合适的最近用，能用就最好
          </div>
          <div class="line03 reply-time">
            20分钟前
          </div>
         </div>
         <div class="reply-item">
          <div class="line01 reply-body">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02 reply-origin">
            原贴：如果发的红包能匹配合适的最近用，能用就最好
          </div>
          <div class="line03 reply-time">
            20分钟前
          </div>
         </div>
         <div class="reply-item">
          <div class="line01 reply-body">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02 reply-origin">
            原贴：如果发的红包能匹配合适的最近用，能用就最好
          </div>
          <div class="line03 reply-time">
            20分钟前
          </div>
         </div>
         <div class="reply-item">
          <div class="line01 reply-body">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02 reply-origin">
            原贴：如果发的红包能匹配合适的最近用，能用就最好
          </div>
          <div class="line03 reply-time">
            20分钟前
          </div>
         </div>
         <div class="reply-item">
          <div class="line01 reply-body">
            团贷网大踏步走在紧拥监管，跨越发展之路上, 团贷网大踏步走在紧拥监管，跨越发展之路上,团贷网大踏步走在紧拥监管，跨越发展之路上
          </div>
          <div class="line02 reply-origin">
            原贴：如果发的红包能匹配合适的最近用，能用就最好,如果发的红包能匹配合适的最近用，能用就最好
            如果发的红包能匹配合适的最近用，能用就最好
          </div>
          <div class="line03 reply-time">
            20分钟前
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
   goPostDetail() {
    let id = "1";
    let url = '/postdetail/' + id
    this.$router.push(url)
   }
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/myreply.scss";

   </style>

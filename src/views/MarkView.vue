<template>
  <div class="v1-view">
  <zheader 
    :header-title="'评分'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <div class="m-cont">
        <p class="item-type">人气</p>
        <p class="score">
          <i v-for="(score, index) in scoreList" @click="mark(score, index)" :class="{'active': scoreActive == index}">{{score}}</i>
        </p>
        <p class="item-type item-ww">威望</p>
        <p class="prestige-container">
          <input type="tel" name="prestige" placeholder="请输入威望数量">
        </p>
        <p class="item-type">留言</p>
        <p class="msg-cont">
          <span>
            <!-- <i class="msg-default">谢谢楼主分享</i>
            <i class="msg-default">加分支持</i> -->
            <i class="msg-default" v-for="(msg, index) in msgList" @click="pickMsg(msg, index)" :class="{'active': msgActive == index}">{{msg}}</i>
            </span>
            <i class="msg-add">+自定义留言</i>
        </p>
        <div class="btn-blue btn-mark">评分</div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
export default {
  name: 'mark',
  components: {
    Zheader,
    Toast,
  },
  data () {
    return {
      isScrollActive: true,
      scoreList: [1,2,3,4,5,6,7],
      msgList: ['谢谢楼主分享', '加分支持'],
      selectedMark: 0,
      scoreActive: null,
      selectedMsg: '',
      msgActive: null
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    mark (score, index) {
      this.selectedMark = score
      this.scoreActive = index
    },
    pickMsg (msg, index) {
      this.selectedMsg = msg
      this.msgActive = index
    }
  },
  beforeMount () {
    let that = this;
  },
  mounted () {
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/mark.scss'

</style>
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
          <input type="tel" name="prestige" placeholder="请输入威望数量" v-model="markDetail.prestige">
        </p>
        <p class="item-type">留言</p>
        <p class="msg-cont">
          <span class="msg-row">
            <!-- <i class="msg-default">谢谢楼主分享</i>
            <i class="msg-default">加分支持</i> -->
            <i class="msg-default msg-item" v-for="(msg, index) in msgList" @click="pickMsg(msg, index)" :class="{'active': msgActive == index}">{{msg}}</i>
            </span>
            <i class="msg-add msg-item" @click="goAdd">+自定义留言</i>
        </p>
        <div class="btn-blue btn-mark" @click="markPost">评分</div>
      </div>
    </div>
    </div>
    <div class="message-dialog" v-show="isShowDialog">
      <div class="masker" v-show="isShowDialog"></div>
      <div class="dialog-content">
        <div class="dialog-title">添加自定义留言</div>
        <textarea class="reply-content" placeholder="请输入留言" v-model="msgAdd"></textarea>
        <div class="btn-wrapper">
          <div class="btn-cancel" @click="onCancel">取消</div>
          <div class="btn-send" @click="onSave">保存</div>
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
      // selectedMark: 0,
      scoreActive: null,
      // selectedMsg: '',
      msgActive: null,
      isShowDialog: false,
      msgAdd: '',
      markDetail: {
        score: 0,
        prestige: '',
        msg: ''
      }
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    mark (score, index) {
      // this.selectedMark = score
      this.markDetail.score = score
      this.scoreActive = index
    },
    pickMsg (msg, index) {
      // this.selectedMsg = msg
      this.markDetail.msg = msg
      this.msgActive = index
    },
    markPost () {
      console.info('data------', this.markDetail)
      window.history.back()
    },
    goAdd () {
      this.isShowDialog = true
      this.isScrollActive = false
    },
    onCancel () {
      this.isShowDialog = false
      this.isScrollActive = true
      this.msgAdd = ''
    },
    onSave () {
      this.isShowDialog = false
      this.isScrollActive = true
      this.msgList.push(this.msgAdd)
      this.markDetail.msg = this.msgAdd
      this.msgAdd = ''
      this.msgActive = this.msgList.length - 1
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
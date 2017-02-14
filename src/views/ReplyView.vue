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
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <div class="reply-cont">
        <div class="r-head">
          <img :src="replyData.avatar">
          <span><font>{{replyData.author}}：</font><font v-html="replyData.message"></font></span>
        </div>
        <div class="r-input">
          <textarea class="input-area" placeholder="请输入…" v-model.trim="replyData.content" id="inputMsg" @blur="blurFun"></textarea>
        </div>
      </div>
      <!-- <div class="insert-tabs">
        <i class="icon-image"></i>
        <i class="icon-emoji"></i>
        <i class="icon-vote">（投票）</i>
        <div class="btn-send btn-blue">发表</div>
      </div> -->
       <insert-tabs
        :hasVote="false"
        :imgList="imgList"
        :addImg="addImg"
        :canAddImg="canAddImg"
        @emotionClickFunc="insertEmo"
        @imgDelFunc="delImg"
        @btnClickFunc="postReply"
        @addImgFunc="addImgFunc"
      ></insert-tabs>
    </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Util from '../js/Util.js'
import InsertTabs from '../components/InsertTabs.vue'
import Vue from 'vue'
export default {
  name: 'reply',
  components: {
    Zheader,
    Toast,
    InsertTabs
  },
  data () {
    return {
      isScrollActive: true,
      selectPostion: {
        selectionStart: 0,
        selectionEnd: 0
      },
      imgList: [],
      addImg: true, //是否显示添加图片图标
      canAddImg: true, //web端是否可上传图片
      comstart: false,
      replyData: {
        content: ''
      }
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun() {
        console.info('11111')
      },
      blurFun(event) {
        let $target = event.currentTarget;
        if ($target.selectionStart || $target.selectionStart == '0') {
          this.selectPostion = {
            'selectionStart': $target.selectionStart,
            'selectionEnd': $target.selectionEnd
          }

        }
      },
      insertEmo(code) {
        // console.info('insertEmo-----', code)
        //插入表情
        let that = this
        if (code === "close") {
          let _cont = that.replyData.content
          that.replyData.content = _cont.substring(0, _cont.length - 1)
          return
        }
        console.log(that.replyData.content)
        let $t = document.querySelector('#inputMsg')
        let startPos = that.selectPostion.selectionStart,
          endPos = that.selectPostion.selectionEnd,
          content = that.replyData.content
        that.replyData.content = content.substring(0, startPos) + code + content.substring(endPos, $t.value.length)
          // this.focus()

        Vue.nextTick(function() {
          that.selectPostion = {
            "selectionStart": startPos + code.length,
            "selectionEnd": startPos + code.length
          }
        })
      },
      addImgFunc () {

      },
      delImg() {
        console.info('delImg------')
      },
      postReply() {
        console.info('postReply-------')
        window.history.back()
      }
  },
  beforeMount () {
    let that = this;
    let param = Util.getSessionStorage('reply')
    if (param) {
      param = JSON.parse(param)
      that.replyData = {
        author: param.author,
        avatar: param.avatar,
        message: param.message,
        pid: param.pid,
        tid: param.tid
      }
      Util.setSessionStorage('reply', '')
    }
  },
  mounted () {
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/reply.scss'

</style>

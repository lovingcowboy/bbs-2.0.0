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
          <img src="../images/icon-avatar.png">
          <span><font>蓝枫：</font>太保守了，我估计20个亿太保守了，我估计20个亿太保守了，我估计20个亿</span>
        </div>
        <div class="r-input">
          <textarea class="input-area" placeholder="请输入…" v-model="inputContent" id="inputMsg" @blur="blurFun"></textarea>
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
        @emotionClickFunc="insertEmo"
        @imgClickFunc="insertImg"
        @btnClickFunc="postReply"
      ></insert-tabs>
    </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
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
      inputContent: '',
      selectPostion: {
        selectionStart: 0,
        selectionEnd: 0
      }
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun () {
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
    insertEmo (code) {
      // console.info('insertEmo-----', code)
      let that = this;
      if (code === "close") {
        let _cont = that.inputContent;
        that.inputContent = _cont.substring(0, _cont.length - 1);
        return;
      }
      console.log(that.inputContent);
      let $t = document.querySelector('#inputMsg');
      let  startPos = that.selectPostion.selectionStart,
        endPos = that.selectPostion.selectionEnd,
        content = that.inputContent;
      that.inputContent = content.substring(0, startPos) + code + content.substring(endPos, $t.value.length);
      // this.focus();

      Vue.nextTick(function() {
        that.selectPostion = {
          "selectionStart": startPos + code.length,
          "selectionEnd": startPos + code.length
        }
      });
    },
    insertImg () {
      console.info('insertImg------')
    },
    postReply () {
      console.info('postReply-------')
      window.history.back()
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
@import '../sass/reply.scss'

</style>

<template>
  <div class="v1-view">
  <zheader 
    :header-title="'发帖'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <p class="p-txt1"><span>选择版块</span><span>发帖规则</span></p>
      <p class="msg-cont">
          <i class="msg-default msg-item" v-for="(item, index) in moduleList" @click="pickMsg(item.name, index)" :class="{'active': moduleActive == index}">{{item.name}}</i>
      </p>
      <div class="p-form">
        <div class="p-title">
          <input type="text" name="pTitle" placeholder="帖子标题" class="i-title">
        </div>
        <div class="p-content">
          <textarea placeholder="帖子内容" class="i-content"></textarea>
        </div>
      </div>
     
      <!-- <div class="reply-cont">
        <div class="r-head">
          <img src="../images/icon-avatar.png">
          <span><font>蓝枫：</font>太保守了，我估计20个亿太保守了，我估计20个亿太保守了，我估计20个亿</span>
        </div>
        <div class="r-input">
          <textarea class="input-area" placeholder="请输入…" v-model="inputContent" id="inputMsg" @blur="blurFun"></textarea>
        </div>
      </div> -->
      <insert-tabs
        :hasVote="true"
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
  name: 'post',
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
      moduleList: [{
        name: '投资交流',
        id: 0
      }, {
        name: '有问必答',
        id: 1
      }, {
        name: '团粉建言',
        id: 2
      }, {
        name: '畅所欲言',
        id: 3
      }, {
        name: '财经新闻',
        id: 4
      }],
      moduleActive: 0,
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
    },
    pickMsg () {

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
@import '../sass/post.scss'

</style>

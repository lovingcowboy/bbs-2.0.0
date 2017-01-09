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
    <div class="scroll" :class="{'scroll-active': isScrollActive}" @scroll="scrollMove()">
    <div class="content" >
      <div class="post-cont">
        <p class="p-title">1218越来越近了，大家对爱心日的“天量”预期会有多少呢...</p>
        <p class="p-poster"><img src="../images/icon-avatar.png"><span>蓝色的枫叶</span></p>
        <p class="p-msg"><span>2016.09.19  22:00</span><span class="post-view">1111</span><span class="post-reply">222</span></p>
        <p class="p-content">
          控件会接口hi骨坏死U盾会返回就几号放假可视电话复健科京东方很快就收到回复可接受的我已uuehhfkjhjhskdjfjkh基督教黑uuhgkjdfk空间的hi文化开放看
        </p>
        <div :class="['vote-cont', {'vote-disable': hasVoted}]">
          <span class="v-question">{{voteData.question}}</span>
          <template v-if="voteData.limit > 1">
            <template v-for="(option, index) in voteData.options">
              <label class="v-answer"  :for="option.id">
                <input type="checkbox" name="answer" :id="option.id" :value="option.id" v-model="selectedOptions" v-if="!hasVoted">
                <input type="checkbox" name="answer" :id="option.id" :value="option.id" v-model="selectedOptions" disabled v-else>
                <label class="icon-checkbox icon-input" :for="option.id"></label>{{option.content}}
              </label>
               <i class="vote-nums" v-show="showVotes"><i class="vote-progress" :style="{width: option.percentage}"></i></i>
            </template>
          </template>
          <template v-else>
            <template v-for="(option, index) in voteData.options">
              <label class="v-answer" :for="option.id">
                <input type="radio" name="answer" :id="option.id" :value="option.id" v-model="picked" v-if="!hasVoted">
                <input type="checkbox" name="answer" :id="option.id" :value="option.id" v-model="picked" disabled v-else>
                <label class="icon-radio icon-input" :for="option.id"></label>{{option.content}}
              </label>
              <i class="vote-nums" v-show="showVotes"><i class="vote-progress" :style="{width: option.percentage}"></i></i>
            </template>
          </template>
        
          <div class="v-btn" @click="goVote()">{{btnTxt}}</div>
        </div>
      </div>
      <div class="rm-cont" >
        <nav class="rm-tabs">
          <a :class="[{'active': tabType === 0}]" @click="triggerTab(0)">回复(263)</a>
          <a :class="[{'active': tabType === 1}]" @click="triggerTab(1)">评分(56)</a>
        </nav>
        <div class="rm" :style="{'transform': scrollX, 'min-height': rmHeight, 'overflow-y': overflowY}">
          <ul class="reply-list rm-list" v-show="tabType === 0">
            <li class="reply-row">
              <div class="rm-u">
                <div class="u-avator">
                  <img src="../images/icon-avatar.png">
                </div>
                <div class="rm-det">
                  <p><span>小叮当</span><span class="u-vip">LV2  大侠</span></p>
                  <p class="r-time">10分钟前</p>
                </div>
                <i class="icon-msg-big"></i>
              </div>
              <p class="rm-txt1 rm-txt">今年1218十个亿！！！今年1218十个亿！！！今年1218十个亿！！！今年1218十个亿！！！今年1218十个亿！！！</p>
            </li>
            <li class="reply-row">
              <div class="rm-u">
                <div class="u-avator">
                  <img src="../images/icon-avatar.png">
                </div>
                <div class="rm-det">
                  <p><span>小叮当</span><span class="u-vip">LV2  大侠</span></p>
                  <p class="r-time">10分钟前</p>
                </div>
                <i class="icon-msg-big"></i>
              </div>
              <p class="rm-txt2 rm-txt"><span class="txt-blue">贪吃小和尚</span>我觉的今年肯定超过10亿，立个flat，要v-model 并不关心表单控件初始化所生成的值。因为它会选择 Vue 实例数据来作为具体的值。</p>
              <p class="rm-txt1 rm-txt">太保守了，20亿没问题的！</p>
            </li>
            <li class="reply-row">
              <div class="rm-u">
                <div class="u-avator">
                  <img src="../images/icon-avatar.png">
                </div>
                <div class="rm-det">
                  <p><span>小叮当</span><span class="u-vip">LV2  大侠</span></p>
                  <p class="r-time">10分钟前</p>
                </div>
                <i class="icon-msg-big"></i>
              </div>
              <p class="rm-txt1 rm-txt">今年1218十个亿！！！今年1218十个亿！！！今年1218十个亿！！！今年1218十个亿！！！今年1218十个亿！！！</p>
            </li>
            <li class="reply-row">
              <div class="rm-u">
                <div class="u-avator">
                  <img src="../images/icon-avatar.png">
                </div>
                <div class="rm-det">
                  <p><span>小叮当</span><span class="u-vip">LV2  大侠</span></p>
                  <p class="r-time">10分钟前</p>
                </div>
                <i class="icon-msg-big"></i>
              </div>
              <p class="rm-txt2 rm-txt"><span class="txt-blue">贪吃小和尚</span>我觉的今年肯定超过10亿，立个flat，要v-model 并不关心表单控件初始化所生成的值。因为它会选择 Vue 实例数据来作为具体的值。</p>
              <p class="rm-txt1 rm-txt">太保守了，20亿没问题的！</p>
            </li>
          </ul>
          <ul class="reply-list rm-list" v-show="tabType === 1">
            <li class="reply-row">
              <div class="rm-u">
                <div class="u-avator">
                  <img src="../images/icon-avatar.png">
                </div>
                <div class="rm-det">
                  <p><span>小叮当</span><span class="u-vip">LV2  大侠</span></p>
                  <p class="r-time">10分钟前</p>
                </div>
              </div>
              <p class="rm-txt1 rm-txt">人气 <span class="txt-blue">+3</span>，威望 <span class="txt-blue">+4</span></p>
              <p class="rm-txt3 rm-txt">“谢谢楼主分享”</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
      <div class="post-foot">
        <div class="f-container">
          <span class="f-reply" @click="goReply()">发表回复…</span>
          <i class="icon-zan"></i>
          <i class="icon-mark"></i>
          <i class="icon-share"></i>
        </div>
      </div>
      <nav class="rm-tabs float-tabs" v-show="showFloat">
        <a :class="[{'active': tabType === 0}]" @click="triggerTab(0)">回复(263)</a>
        <a :class="[{'active': tabType === 1}]" @click="triggerTab(1)">评分(56)</a>
      </nav>
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
       scrollX: 'translateX(0)',
       tabType: 0,
       showVotes: false,
       voteData: {},
       selectedOptions: [], //复选框选中内容
       picked: "", //单选框选中内容
       hasVoted: false,
       btnTxt: '投票',
       postHeight: 0,
       tabsOffsetTop: 0,
       contentObj : null,
       showFloat: false,
       rmHeight: '100%',
       overflowY: 'scroll',
       isScrollActive: true
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    triggerTab (type) {
      this.tabType = type
      // let num = +type * (-100)
      // this.scrollX = 'translateX(' + num + '%)'
    },
     percentage (count, total) {
      return (count / total * 100) + "%"
    },
    goVote () {
      if (this.hasVoted) {
        if (this.showVotes) {
          this.showVotes = false
          this.btnTxt = '显示投票结果'
        } else {
          this.showVotes = true
          this.btnTxt = '隐藏投票结果'
        }
      } else {
        if (this.selectedOptions.length > this.voteData.limit) {
          Toast({
            message: '最多可选' + this.voteData.limit + '项'
          })
          return;
        }
        this.hasVoted = true
        this.showVotes = true
        this.btnTxt = '隐藏投票结果'
      }
    },
    
    scrollMove () {
      console.info(this.contentObj.scrollTop, this.postHeight)
      if (this.contentObj.scrollTop >= this.postHeight + 22) {
        this.showFloat = true
        // this.overflowY = 'scroll'
        // this.rmHeight = document.documentElement.offsetHeight + 'px'
      } else {
        this.showFloat = false
        // this.overflowY = 'hidden'
        // this.rmHeight = '100%'
      }
    },
    goReply () {
      let url = '/postdetail/reply/aa'
      this.$router.push(url)
    }
  },
  beforeMount () {
    let that = this;
    that.voteData = {
      question: '1218当天的交易额有多少？',
      total: 100,
      limit: 2,
      options: [{
        'content': '5亿',
        'count': 10,
        'id': 'aa'
      },{
        'content': '10亿',
        'count': 30,
        'id': 'bb'
      },{
        'content': '15亿',
        'count': 50,
        'id': 'cc'
      },{
        'content': '2亿',
        'count': 10,
        'id': 'dd'
      }]
    }
    let total = that.voteData.total
    that.voteData.options.forEach(function(item) {
      item.percentage = (item.count / total * 100) + '%'
    })
    // console.info(that.voteData)
   
  },
  mounted () {
    this.postHeight = document.querySelector('.post-cont').offsetHeight
    this.contentObj = document.querySelector('.scroll')
    this.tabsOffsetTop = document.querySelector('.rm-tabs').offsetTop
    // this.rmHeight = document.documentElement.offsetHeight - 110 + 'px'
    this.rmHeight = document.documentElement.offsetHeight - document.querySelector('.header-bar').offsetHeight - document.querySelector('.rm-tabs').offsetHeight + 20 + 'px'
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/postdetail.scss'

</style>

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
        <p class="p-title">{{thread.title}}</p>
        <p class="p-poster"><img :src="thread.avatar"><span>{{thread.author}}</span></p>
        <p class="p-msg"><span v-html="thread.create_time"></span><span class="post-view">{{thread.views}}</span><span class="post-reply">{{thread.replies}}</span></p>
        <p class="p-content" v-html="thread.message">
        </p>
        <div :class="['vote-cont', {'vote-disable': !voteData.allowvote}]" v-show="voteData && voteData.polloptions && voteData.polloptions.length > 0">
          <!-- <span class="v-question">{{voteData.question}}</span> -->
          <template v-if="+voteData.maxchoices > 1">
            <template v-for="(option, index) in voteData.polloptions">
              <label class="v-answer"  :for="option.polloptionid">
                <input type="checkbox" name="answer" :id="option.polloptionid" :value="option.polloptionid" v-model="selectedOptions" v-if="voteData.allowvote">
                <input type="checkbox" name="answer" :id="option.polloptionid" :value="option.polloptionid" v-model="selectedOptions" disabled v-else>
                <label class="icon-checkbox icon-input" :for="option.polloptionid"></label>{{option.polloption}}
              </label>
               <div v-show="showVotes" class="vn-cont"><i class="vote-nums" ><i class="vote-progress" :style="{width: option.percent + '%'}"></i></i>{{option.percent}}%</div>
            </template>
          </template>
          <template v-else>
            <template v-for="(option, index) in voteData.polloptions">
              <label class="v-answer" :for="option.polloptionid">
                <input type="radio" name="answer" :id="option.polloptionid" :value="option.polloptionid" v-model="picked" v-if="voteData.allowvote">
                <input type="radio" name="answer" :id="option.polloptionid" :value="option.polloptionid" v-model="picked" disabled v-else>
                <label class="icon-radio icon-input" :for="option.polloptionid"></label>{{option.polloption}}
              </label>
              <div v-show="showVotes" class="vn-cont"><i class="vote-nums" ><i class="vote-progress" :style="{width: option.percent + '%'}"></i></i>{{option.percent}}%</div>
            </template>
          </template>
        
          <div class="v-btn" @click="goVote()">{{btnTxt}}</div>
        </div>
      </div>
      <div class="rm-cont" >
        <nav :class="['rm-tabs', {'hideTabs': showFloat}]">
          <a :class="[{'active': tabType === 0}]" @click="triggerTab(0)">回复{{thread.replies}}</a>
          <a :class="[{'active': tabType === 1}]" @click="triggerTab(1)">评分{{thread.total_rate}}</a>
        </nav>
        <div class="rm" :style="{'transform': scrollX, 'height': rmHeight, 'overflow-y': overflowY}">
          <ul class="reply-list rm-list" v-show="tabType === 0" @click="replyClick($event)">
            <li class="reply-row" v-for="(item, index) in replyData.list">
              <div class="rm-u">
                <div class="u-avator">
                  <img :src="item.avatar">
                </div>
                <div class="rm-det">
                  <p><span>{{item.author}}</span><span class="u-vip">LV{{item.group_level}} {{item.group_title}}</span></p>
                  <p class="r-time" v-html="item.dateline"></p>
                </div>
                <i class="icon-msg-big r-event" :data-index="index"></i>
              </div>
              <p class="rm-txt2 rm-txt" v-if="item.reply_info"><span><font class="txt-blue">{{item.reply_info.nickname}}</font><font v-html="item.reply_info.content"></font></p>
              <p class="rm-txt1 rm-txt" v-html="item.message"></p>
            </li>
            <!-- <li class="reply-row">
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
              <p class="rm-txt2 rm-txt"><span><font class="txt-blue">贪吃小和尚</font>我觉的今年肯定超过10亿，立个flat，要v-model 并不关心表单控件初始化所生成的值。因为它会选择 Vue 实例数据来作为具体的值。</p>
              <p class="rm-txt1 rm-txt">太保守了，20亿没问题的！</p></p>
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
             <p class="rm-txt2 rm-txt"><span><font class="txt-blue">贪吃小和尚</font>我觉的今年肯定超过10亿，立个flat，要v-model 并不关心表单控件初始化所生成的值。因为它会选择 Vue 实例数据来作为具体的值。</p>
              <p class="rm-txt1 rm-txt">太保守了，20亿没问题的！</p></p>
            </li> -->
          </ul>
          <ul class="reply-list rm-list" v-show="tabType === 1">
            <li class="reply-row" v-for="(item, index) in MarkData.list">
              <div class="rm-u">
                <div class="u-avator">
                  <img :src="item.avatar">
                </div>
                <div class="rm-det">
                  <p><span>{{item.nickname}}</span><span class="u-vip">LV{{item.group_level}}  {{item.group_title}}</span></p>
                  <p class="r-time" v-html="item.dateline"></p>
                </div>
              </div>
              <p class="rm-txt1 rm-txt"><span v-show="item.extcredits3 && +item.extcredits3 > 0">人气 <font class="txt-blue">{{item.extcredits3}}</font></span><span v-show="item.extcredits1 && +item.extcredits1 > 0">，威望 <font class="txt-blue">{{item.extcredits1}}</font></span><span v-show="item.extcredits2 && +item.extcredits2 > 0">，经验 <font class="txt-blue">{{item.extcredits2}}</font></span></p>
              <p class="rm-txt3 rm-txt">{{item.reason}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
      <div class="post-foot">
        <div class="f-container" @click="pfClickFunc($event)">
          <span class="f-reply pf-evt" data-type="reply">发表回复…</span>
          <i class="icon-zan pf-evt" data-type="fav"></i>
          <i class="icon-mark pf-evt"  data-type="mark"></i>
          <i class="icon-share pf-evt" data-type="share"></i>
        </div>
      </div>
      <nav class="rm-tabs float-tabs" v-show="showFloat">
        <a :class="[{'active': tabType === 0}]" @click="triggerTab(0)">回复{{thread.replies}}</a>
        <a :class="[{'active': tabType === 1}]" @click="triggerTab(1)">评分{{thread.total_rate}}</a>
      </nav>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import service from '../services'
import Util from '../js/Util.js'
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
      // hasVoted: false,
      btnTxt: '投票',
      postHeight: 0,
      tabsOffsetTop: 0,
      contentObj: null,
      showFloat: false,
      rmHeight: '100%',
      overflowY: 'scroll',
      isScrollActive: true,
      thread: {}, //帖子内容
      replyData: { //回复内容
        curPage: 1,
        totalPage: 1,
        list: []
      }, 
      MarkData: { //评分内容
        curPage: 1,
        totalPage: 1,
        list: []
      },
      formhash: '' //用于验证数据合法性
    }
  },
  computed: {
  },
  // watch: {
  //   '$route' (to, from) {
  //     console.info('watch-----', from, to)
  //     if(from.name === 'main') {
  //       this.getPostData(1)
  //     }
  //   }
  // },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    triggerTab (type) {
      this.tabType = type
      // let num = +type * (-100)
      // this.scrollX = 'translateX(' + num + '%)'
      if(type === 0 && (!this.replyData.list || this.replyData.list.length === 0)) {
        this.getPostData(1)
      }else if(type === 1 && this.MarkData.list.length === 0) {
        this.getMarkList(1)
      }
    },
     percentage (count, total) {
      return (count / total * 100) + "%"
    },
    goVote () {
      let that = this
      console.info(that.selectedOptions, that.picked)
      if (that.voteData.allowvote) {
        if (that.selectedOptions.length > +that.voteData.maxchoices) {
          Toast({
            message: '最多可选' + that.voteData.maxchoices + '项'
          })
          return
        }
        let pollanswers = []
        if (+that.voteData.maxchoices > 1) {
          pollanswers = that.selectedOptions
        } else {
          if (that.picked) {
            pollanswers.push(that.picked)
          }
        }
        if (pollanswers.length === 0) {
          Toast({
            message: '请选择选项'
          })
          return
        }
        service.postData('/app/index.php', {
          version: 4,
          module: 'pollvote',
          fid: that.thread.fid,
          tid: that.thread.tid,
          pollsubmit: 'yes',
          pollanswers: pollanswers
        }).then((response) => {
          console.info('goVote----', response)
          let _body = response.body
          if (_body.code === '200' && _body.data) {
            that.showVotes = true
            that.btnTxt = '隐藏投票结果'
            that.voteData.allowvote = 0
            that.voteData.polloptions = _body.data.special_poll
          } else {
            let msg = '请求失败，请稍后重试'
            if (_body.message) {
              msg = _body.message
            }
            Toast({
              message: msg
            })
          }
        }, (response) => {
          console.info('goVote----fail---', response)
        })

      } else {
        if (that.showVotes) {
          that.showVotes = false
          that.btnTxt = '显示投票结果'
        } else {
          that.showVotes = true
          that.btnTxt = '隐藏投票结果'
        }
      }
     
    },
    
    scrollMove () {
      // console.info(this.contentObj.scrollTop, this.postHeight)
      return
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
    pfClickFunc (e) {
       let obj = Util.getElemetByTarget(e.target, 'pf-evt', 'f-container')
       if (obj) {
        let type = obj.dataset.type
        if (type === 'reply') {
          //回复
          this.goReply()
        } else if (type === 'fav') {
          //收藏
          if (+this.thread.yes_fav) {
            Toast({
              message: '取消收藏'
            })
          } else {
            Toast({
              message: '收藏成功'
            })
          }
        } else if (type === 'mark') {
          //评分
          this.goMark()
        } else {
          //分享
        }
       }
    },
    goReply () {
      let param = Util.getSessionStorage('reply')
      if (!param) {
        param = {
          avatar: this.thread.avatar,
          author: this.thread.author,
          message: this.thread.title,
          // pid: this.thread.pid,
          tid: this.thread.tid,
          fid: this.thread.fid
        }
        Util.setSessionStorage('reply', JSON.stringify(param))
      }
      let url = '/postdetail/reply/' + this.thread.tid
      this.$router.push(url)
    },
    goMark () {
      let that = this
      service.postData('/app/index.php', {
        version: 4,
        module: 'threadrate',
        action: 'rate',
        tid: that.thread.tid,
        pid: that.thread.pid,
        formhash: that.formhash
      }).then((response) => {
        console.info('goMark---', response.body)
        let _body = response.body
        if (_body.code === '200' && _body.data) {
          Util.setSessionStorage('markData', JSON.stringify(_body.data))
          Util.setSessionStorage('formhash', _body.data.formhash)
          let url = '/postdetail/mark/' + that.thread.tid + '/' +  that.thread.pid
          this.$router.push(url)
        } else {
          let msg = '请求失败，请稍后重试'
          if (_body.message) {
            msg = _body.message
          }
          Toast({
            message: msg
          })
        }
      }, (response) => {
        console.info('init fail-----', response)
      })



      /* let param = {
         tid: this.thread.tid,
         pid: this.thread.pid,
         // formhash: this.formhash
       }
       // Util.setSessionStorage('formhash', this.formhash)
       let url = '/postdetail/mark/' + JSON.stringify(param)
       this.$router.push(url)*/
    },
    getPostData (page) {
      let that = this
      let tid = this.$route.params.id
      // tid = '147680'
        // console.info('id---', this.$route.params.id)
      service.postData('/app/index.php', {
        version: 4,
        module: 'viewthread',
        tid: tid,
        page: page,
        ordertype: 1
      }).then((response) => {
        console.info('get post detail ----', response.body)
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          that.thread = data.thread
          that.replyData = {
              curPage: data.pager.cur_page,
              totalPage: data.pager.total_page,
              list: data.postlist
            }
            // console.info("vote-----", that.voteData.polloptions)
          if (data.special_poll) {
            that.voteData = data.special_poll
            that.voteData.allowvote = +that.voteData.allowvote
            if (!that.voteData.allowvote) {
              that.btnTxt = '显示投票结果'
                // that.showVotes = true
              if (+that.voteData.maxchoices === 1) {
                for (let opt of data.special_poll.polloptions) {
                  // console.info('opt---',opt)
                  if (opt.selected === '1') {
                    that.picked = opt.polloptionid
                    break
                  }
                }
              } else {
                for (let opt of data.special_poll.polloptions) {
                  if (opt.selected === '1') {
                    that.selectedOptions.push(opt.polloptionid)
                  }
                }
              }
            }
          }
          that.formhash = data.formhash
          Util.setSessionStorage('formhash', this.formhash)
        } else {
          let msg = '请求失败，请稍后重试'
          if (_body.message) {
            msg = _body.message
          }
          Toast({
            message: msg
          })
        }
      }, (response) => {
        console.info('get post data fail------', response)
      })
    },
    getMarkList (page) {
      let that = this
      service.postData('/app/index.php', {
        version: 4,
        module: 'threadrate',
        action: 'viewratings',
        tid: that.thread.tid,
        pid: that.thread.pid,
        // tid: '145086',
        // pid: '1253506',
        formhash: that.formhash
      }).then((response) => {
        console.info('get mark data ----', response.body)
        let _body = response.body
        if(_body.code === '200') {
          let data = _body.data
          that.MarkData.list = data.logs
        }else{
          let msg = '请求失败，请稍后重试'
          if(_body.message) {
            Toast({
              message: msg
            })
          }
        }
      }, (response) => {
        console.info('get mark data faild---', response)
      })
    },
    replyClick (e) {
      // console.info(e.target)
      let obj = e.target
      if(!obj) return
      let index = obj.dataset.index
      let item = this.replyData.list[index]
      // console.info(obj.dataset.index, this.replyData.list[index])
      if(!item) return
      let param = {
        avatar: item.avatar,
        author: item.author,
        message: item.message,
        tid: item.tid,
        pid: item.pid,
        fid: this.thread.fid
      }
      Util.setSessionStorage('reply', JSON.stringify(param))
      this.goReply()
    }
  },
  beforeMount () {
    let that = this;
    that.getPostData(1)
  },
  mounted () {
    this.postHeight = document.querySelector('.post-cont').offsetHeight
    this.contentObj = document.querySelector('.scroll')
    this.tabsOffsetTop = document.querySelector('.rm-tabs').offsetTop
    // this.rmHeight = document.documentElement.offsetHeight - 110 + 'px'
    this.rmHeight = document.documentElement.offsetHeight - document.querySelector('.header-bar').offsetHeight - document.querySelector('.rm-tabs').offsetHeight + 20 + 'px'
  },
  activated () {
    // this.getPostData(1)
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/postdetail.scss'

</style>

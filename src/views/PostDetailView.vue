<template>
  <div class="detail-view">
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
    <list :config.once="ScrollConfig" @init="onInitList" @refresh="onRefreshList" @loadmore="onLoadMore" ref="detailList">
      <div class="scroll-wrapper" slot="scrollContent" id="hotScroll" @tap="onTapTagA">
      <div class="pc-container">
      <div class="post-cont">
        <p class="p-title">{{thread.title}}</p>
        <p class="p-poster"><img :src="thread.avatar"><span>{{thread.author}}</span></p>
        <p class="p-msg">
          <span v-html="thread.create_time"></span>
          <span class="post-view">
            <span class="icon-view"></span>
            <span>{{thread.views}}</span>
          </span>
          <span class="post-reply">
            <span class="icon-reply"></span>
            <span>{{thread.replies}}</span>
          </span>
         <!--  <span class="post-view">{{thread.views}}</span>
          <span class="post-reply">{{thread.replies}}</span> -->
        </p>
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
        
          <div class="v-btn" @tap="goVote()">{{btnTxt}}</div>
        </div>
      </div>
      </div>
      <div class="rm-cont" v-show="getDataDone">
        <nav :class="['rm-tabs', {'hideTabs': showFloat}]">
          <div :class="[{'active': tabType === 0}, 'ft-btn']" @tap="triggerTab(0)">回复({{thread.replies}})</div>
          <div :class="[{'active': tabType === 1}, 'ft-btn']" @tap="triggerTab(1)">评分({{thread.total_rate}})</div>
        </nav>
        <div class="rm">
          <ul class="reply-list rm-list" v-show="tabType === 0" @tap="replyClick($event)" :style="{'min-height': replyListHeight + 'rem'}">
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
            <!-- <section class="error-container" >
                <div class="ec-cont">
                    <i class="icon-pai-null"></i>
                    <span class="ec-txt" >这里空空如也！</span>
                </div>
            </section> -->
            <tips :config="replyTipsConfig"></tips>
          </ul>
          <ul class="mark-list rm-list" v-show="tabType === 1" :style="{'min-height': markListHeight + 'rem'}">
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
            <tips :config="markTipsConfig"></tips>
          </ul>
          
        </div>
      </div>
      </div>
      </list>

      <nav class="rm-tabs float-tabs" v-show="showFloat">
        <div :class="[{'active': tabType === 0}, 'ft-btn']" @click="triggerTab(0)">回复({{thread.replies}})</div>
        <div :class="[{'active': tabType === 1}, 'ft-btn']" @click="triggerTab(1)">评分({{thread.total_rate}})</div>
      </nav>
    </div>
    </div>
      <div class="post-foot">
        <div class="f-container" @click="pfClickFunc($event)">
          <span class="f-reply pf-evt" data-type="reply">发表回复…</span>
          <span :class="['pf-icon', 'pf-evt', {'active': +thread.yes_fav}]" data-type="fav"><i class="icon-zan"></i><span class="i-txt">收藏</span></span>
          <span class="pf-icon pf-evt" data-type="mark"><i class="icon-mark"></i><span class="i-txt">评分</span></span>
         <!--  <i :class="['pf-evt', +thread.yes_fav ? 'icon-zan-active': 'icon-zan']" data-type="fav" ></i>
          <i class="icon-mark pf-evt"  data-type="mark" ></i> -->
          <!-- <i class="icon-share pf-evt" data-type="share"></i> -->
        </div>
      </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Tips from '../components/Tips.vue'
import Services from '../services'
import List from "components/listview"
import Validate from '../js/lib/validate.js'
// import Util from '../js/Util.js'
export default {
  name: 'postDetail',
  components: {
    Zheader,
    Toast,
    List,
    Tips
  },
  data () {
    return {
      // scrollX: 'translateX(0)',
      tabType: 0,
      showVotes: false,
      voteData: {},
      selectedOptions: [], //复选框选中内容
      picked: "", //单选框选中内容
      // hasVoted: false,
      btnTxt: '投票',
      showFloat: false,
      rmHeight: '0',
      replyListHeight: 0, //回复列表高度
      markListHeight: 0, //评分列表高度
      // overflowY: 'scroll',
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
      ScrollConfig: {
        wrapper: 'detailScroll',
        mutationObserver: true,
        refresh: true,
        loadmore: true
      },
      myScroller: null,
      getDataDone: false, //进入页面请求数据是否完成
      scrollReply: 0, //回复列表滚动位置
      scrollMark: 0,//评分列表滚动位置
      markTipsConfig: { //情感图信息
        noData: false,
        text: ''
      },
      replyTipsConfig: { //情感图信息
        noData: false,
        text: ''
      },
      requesting: false, //是否正在请求数据
      formhash: '' //用于验证数据合法性
    }
  },
   watch: {
    $route:function(to, from) {
      let that = this
      if(to.name == 'postdetail') { //如果变化是在帖子详情
          if (!Validate.checkLogin()) {
          Validate.getLoginInfo(function(result) {
           that.getPostData(1)
          })
        }else{
          that.getPostData(1)
        }
      }
    }
  },
  computed: {
    calculateHeight () {
      //动态计算列表高度，防止切换tab时跳动
      let obj = this.tabType === 0 ? document.querySelector('.mark-list') : document.querySelector('.reply-list')
      if (obj) {
        let h = Util.pxToRemAdapt(obj.clientHeight)
        h = h < this.rmHeight ? h : this.rmHeight
          //600为情感图最小高度
        return h > Util.pxToRem(600) ? h : Util.pxToRem(600)
      } else {
        return 0
      }
    },
    calculateY () {
      //切换tab时计算滚动条距离
      let obj = document.querySelector('.pc-container')
      let baseY = 0
      if (obj) {
        baseY = obj.clientHeight
      }
      let scrollY = this.tabType === 0 ? this.scrollReply : this.scrollMark
      //显示浮动tab时，如果当前切换的tab的滚动位置大于基准位置，则返回基准位置
      if (this.showFloat) {
        if (scrollY > -baseY) {
          return -baseY
        } else {
          return scrollY
        }
       
      } else {
        return scrollY
      }
      
    }
  },

  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    triggerTab (type) {
      //切换显示评论列表/评分列表 type为0表示为评论列表，1表示为评分列表
      this.tabType = type
      if (type === 0) {
        //计算回复列表高度，防止tab切换时跳动
        
        (this.replyListHeight === this.calculateHeight) || (this.replyListHeight = this.calculateHeight)
        if (!this.replyData.list || this.replyData.list.length === 0) {
          this.getPostData(1)
        } else {
          this.$refs.detailList.refresh()
            //tab置顶时滚动条滚动到上次位置
          let scrollY = this.calculateY
          // this.showFloat && this.myScroller.scrollTo(0, this.scrollReply, 0)
          this.showFloat && this.myScroller.scrollTo(0, scrollY, 0)
        }
        this.$refs.detailList.loadmore = this.replyData.curPage <= this.replyData.totalPage
      } else if (type === 1) {
       
        (this.markListHeight === this.calculateHeight) || (this.markListHeight = this.calculateHeight)

        if (!this.MarkData.list || this.MarkData.list.length === 0) {
          this.getMarkList(1)
        } else {
          this.$refs.detailList.refresh()
          let scrollY = this.calculateY
          // this.showFloat && this.myScroller.scrollTo(0, this.scrollMark, 0)
          this.showFloat && this.myScroller.scrollTo(0, scrollY, 0)
        }
        this.$refs.detailList.loadmore = false
      }
    },
     /*percentage (count, total) {
      return (count / total * 100) + "%"
    },*/
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
        Services.postData('/app/index.php', {
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
            Toast({
              message: _body && _body.message || '请求失败，请稍后重试'
            })
          }
        }, (response) => {
          // console.info('goVote----fail---', response)
          Toast({
            message: response.body && response.body.message || '请求失败，请稍后重试'
          })
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
    pfClickFunc (e) {
      let obj = Util.getElemetByTarget(e.target, 'pf-evt', 'f-container')
      let that = this
      if (obj) {
        let type = obj.dataset.type
        if (Validate.checkLogin()) {
          if (type === 'reply') {
            //回复
            that.goReply()
          } else if (type === 'fav') {
            //收藏
            that.goTriggerFav()
          } else if (type === 'mark') {
            //评分
            that.goMark()
          } else {
            //分享
          }
        } else {
          Validate.openLogin()
        }

      }
    },
    goTriggerFav() {
      let that =  this
      let reqParam = {}
      if (+that.thread.yes_fav) {
        reqParam = {
          module: 'member',
          action: 'delete_favorite_thread',
          tid: that.thread.tid
        }
      } else {
        reqParam = {
          module: 'favthread',
          id: that.thread.tid
        }
      }

      Services.postData('/app/index.php', reqParam).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          if (+that.thread.yes_fav) {
            that.thread.yes_fav = 0
            Toast({
              message: '取消收藏'
            })
          } else {
            that.thread.yes_fav = 1
            Toast({
              message: '收藏成功'
            })
          }
        } else {
          Toast({
            message: _body && _body.message || '请求失败，请稍后重试'
          })
        }
      }, (response) => {
        // console.info('goTriggerFav-------fail--', response)
        Toast({
          message: response.body && response.body.message || '请求失败，请稍后重试'
        })
      })
    },
   
    goReply (param) {
      // let param = Util.getSessionStorage('reply')
      if (!param) {
        param = {
          avatar: this.thread.avatar,
          author: this.thread.author,
          message: this.thread.title,
          pid: '',
          tid: this.thread.tid,
          fid: this.thread.fid
        }
      }
      Util.setSessionStorage('reply', JSON.stringify(param))
      let url = '/postdetail/reply/' + this.thread.tid
      this.$router.push(url)
    },
    goMark () {
      let that = this
      Services.postData('/app/index.php', {
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
          Toast({
            message: _body && _body.message || '请求失败，请稍后重试'
          })
        }
      }, (response) => {
        // console.info('init fail-----', response)
        Toast({
          message: response.body && response.body.message || '请求失败，请稍后重试'
        })
      })
     
    },
    getPostData(page, notLoader) {
      let that = this
      if (that.requesting) {
        return
      } else {
        that.requesting = true
      }
      
      let tid = this.$route.params.id
        // console.info('id---', this.$route.params.id)
      if (page > that.replyData.totalPage) {
        that.$refs.detailList.refresh() //刷新list
        that.$refs.detailList.loadmore = false
        return
      }
      Services.postData('/app/index.php', {
        version: 4,
        module: 'viewthread',
        tid: tid,
        page: page,
        ordertype: 1,
        notLoader: notLoader
      }).then((response) => {
        console.info('get post detail ----', response.body)
        let _body = response.body
        
        let _tid = window.location.hash.split('?')[0].split('/')[2]  //获取浏览器地址栏 tid

        if(_body.data.tid !== _tid) { //如果帖子id不一致则不渲染数据
          return
        }

        if (_body.code === '200') {
          let data = _body.data
            //最后一页不再触发loadmore事件
          that.$refs.detailList.loadmore = +data.pager.cur_page < +data.pager.total_page
          that.replyData.curPage = +data.pager.cur_page + 1
          that.replyData.totalPage = +data.pager.total_page
          if (page === 1) {
            that.thread = data.thread
            that.replyData.list = data.postlist
            if (!data.postlist || data.postlist.length < 1) {
              that.replyTipsConfig = {
                noData: true,
                text: '沙发空缺中~'
              }
            } else {
              that.replyTipsConfig.noData = false
            }

            //显示投票数据
            if (data.special_poll) {
              that.voteData = data.special_poll
              that.voteData.allowvote = +that.voteData.allowvote
              if (!that.voteData.allowvote) {
                that.btnTxt = '显示投票结果'
                  // that.showVotes = true
                if (+that.voteData.maxchoices > 1) {
                  //多选选中
                  for (let opt of data.special_poll.polloptions) {
                    if (opt.selected === '1') {
                      that.selectedOptions.push(opt.polloptionid)
                    }
                  }
                } else {
                  //单选选中
                  for (let opt of data.special_poll.polloptions) {
                    // console.info('opt---',opt)
                    if (opt.selected === '1') {
                      that.picked = opt.polloptionid
                      break
                    }
                  }
                }
              }
            }

          } else {
            that.replyData.list = that.replyData.list.concat(data.postlist)
          }
          // console.info("vote-----", that.voteData.polloptions)

          that.formhash = data.formhash
          Util.setSessionStorage('formhash', this.formhash)
            // that.replyListHeight = Util.pxToRemAdapt(document.querySelector('.reply-list').clientHeight)
          that.replyListHeight = that.calculateHeight
          that.$refs.detailList.refresh() //刷新list
          that.getDataDone = true
        } else {
          Toast({
            message: _body && _body.message || '请求失败，请稍后重试'
          })
          that.$refs.detailList.refresh() //刷新list
          that.$refs.detailList.loadmore = false
        }
        that.requesting = false
      }, (response) => {
        // console.info('get post data fail------', response)
        Toast({
          message: response.body && response.body.message || '请求失败，请稍后重试'
        })
        that.$refs.detailList.refresh() //刷新list
        that.$refs.detailList.loadmore = false
        that.requesting = false
      })
    },
    getMarkList (page) {
      let that = this
      Services.postData('/app/index.php', {
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
          if (!data.logs || data.logs.length < 1) {
            that.markTipsConfig = {
              noData: true,
              text: '还没有人进行评分哦！'
            }
          } else {
            that.markTipsConfig.noData = false
          }
          that.$refs.detailList.refresh()
        }else{
          Toast({
            message: _body && _body.message || '请求失败，请稍后重试'
          })
        }
      }, (response) => {
        // console.info('get mark data faild---', response)
        Toast({
          message: response.body && response.body.message || '请求失败，请稍后重试'
        })
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
      // Util.setSessionStorage('reply', JSON.stringify(param))
      this.goReply(param)
    },

    onInitList (scroller) {
      // console.info('scroller--------', scroller)
      let that = this
      let postHeight = 0
      let postCont = document.querySelector('.pc-container') //帖子内容部分高度
      // let modifyNum = Util.pxToPx(20) //修正数值
      let modifyNum = 0 //修正数值
      that.myScroller = scroller
      scroller.on('scroll', function() {
        // that.isScrolling = true
        // console.info(scroller.y, -postHeight)
        postHeight = postCont.offsetHeight + modifyNum
        if (scroller.y <= -postHeight && postHeight > 0) {
          that.showFloat = true
        } else {
          that.showFloat = false
        }
        if(that.tabType === 0) {
          that.scrollReply = scroller.y
        }else{
          that.scrollMark = scroller.y
        }
      })
      // scroller.on('scrollEnd', function() {
      //   setTimeout(function() { //延迟刷新isScrolling状态，因为scroll还会触发多一次
      //     that.isScrolling = false;
      //   }, 100)
      // })

    },
    reset() {
      this.tabType = 0
      this.showVotes = false
      this.replyData = { //回复内容
        curPage: 1,
        totalPage: 1,
        list: []
      },
      this.MarkData = { //评分内容
        curPage: 1,
        totalPage: 1,
        list: []
      }
      this.markTipsConfig = { //情感图信息
        noData: false,
        text: ''
      }
      this.replyTipsConfig = { //情感图信息
        noData: false,
        text: ''
      }
    },
    onRefreshList () {
      console.info('onRefreshList-------')
      this.reset()
      this.getPostData(1, true)
    },
    onLoadMore () {
      console.info('onLoadMore-------')
      this.getPostData(this.replyData.curPage, true)

    },
    onTapTagA(e) {
      //拦截a标签
      let that = this
      let target = e.target;
      if (target.tagName.toLocaleLowerCase() !== 'a') return;
      e.preventDefault();
      // console.log("preventDefault2");
      // let _url = $(e.currentTarget).attr("href"),
      let _url = target.getAttribute('href'),
        reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,
        regresult = reg.exec(_url),
        result = {
          "url": regresult[0],
          "scheme": regresult[1],
          "slash": regresult[2],
          "host": regresult[3],
          "port": regresult[4],
          "path": regresult[5],
          "query": regresult[6],
          "hash": regresult[7]
        };
      // console.log(result);
      //只有域名为tuandai.com的才能跳转
      if (/[0-9.\-A-Za-z]+.tuandai.com$/.test(result.host)) {
        if (result.host === "bbs.tuandai.com") { //若是bbs的就进行站内跳转，否则就跳出去
          if (result.query) {
            if (result.query.indexOf("mod=viewthread") != -1) { //帖子详情 http://bbs.tuandai.com/forum.php?mod=viewthread&tid=17222 tid=17222
              let tid = that.getParam(result.query, "tid")
              that.$router.push('/postdetail/' + tid)
                // router.go({
                //   name: 'postdetail',
                //   params: {
                //     'tid': tid
                //   }
                // });
              return

            } else if (result.query.indexOf("mod=redirect&goto=findpost") != -1) { //帖子详情  http://bbs.tuandai.com/forum. php?mod=redirect&goto=findpost&ptid=29385&pid=296863 tid=29385
              let tid = that.getParam(result.query, "ptid");
              that.$router.push('/postdetail/' + tid)
              return;
            } else if (result.query.indexOf("mod=forumdisplay") != -1) { //版块列表 http://bbs.tuandai.com/forum.php?mod=forumdisplay&fid=2  2代表版块id
              let fid = that.getParam(result.query, "fid");
              that.$router.push('/sessionlist/' + fid)
              return;
            }

          } else {
            // if(result.path.indexOf("space-uid") != -1  ) { //用户空间(touch没有对应的页面) 所以不跳转
            //  return;
            // }
            let params = result.path.split("-");
            if (params[0] == "forum") { //版块列表 http://bbs.tuandai.com/forum-2-1.html  2代表版块id
              let fid = params[1];
              that.$router.push('/sessionlist/' + fid)
              return;
            } else if (params[0] == "thread") { //帖子详情  http://bbs.tuandai.com/thread-25619-1-1.html tid = 25619
              let tid = result.path.split("-")[1];
              that.$router.push('/postdetail/' + tid)

            }
            //其他情况例如：用户空间，社区会员 touch没有 所以不跳转
          }
          // console.log(tid);
          // return;
          // router.go({
          //    name: 'postdetail',
          //    params: {
          //      'tid': tid
          //    }
          //  });

        } else {
          window.location.href = _url;
        }
      }

    },
    getParam(str, key) {
      let params = str.split("&");
      let value = "";
      for (let i = 0; i < params.length; i++) {
        let arr = params[i].split("=");
        console.log(arr);
        if (arr[0] == key) {
          value = arr[1];
          break;
        }
      }
      return value;
    }
  },
  beforeMount () {
    let that = this;
    // let uid = Util.getSessionStorage('uid')
    // let isLogined_cookie = Validate.getCookie('voHF_b718_auth')
    if (!Validate.checkLogin()) {
      Validate.getLoginInfo(function(result) {
       that.getPostData(1)
      })
    }else{
      that.getPostData(1)
    }
  },
  mounted () {
    /*
      .header-bar: 90
      .rm-tabs: 80
      .post-foot: 94
      margin-bottom: 20
    */
    this.rmHeight = Util.pxToRemAdapt(document.querySelector('.scroll').clientHeight - Util.pxToPx(284))
    // this.baseY = document.querySelector('.pc-container').clientHeight
    console.info(this.rmHeight)
      
    // this.getPostData(1)
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/postdetail.scss'

</style>

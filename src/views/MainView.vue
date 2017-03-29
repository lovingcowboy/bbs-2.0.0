<template>
  <div class="main-view">
  <!-- <zheader 
    :header-title="'团粉圈'" 
    :has-back="false" 
    :has-rightbtn="false"
    :prevent-back="true"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader>  -->
    <div class="scroll" :class="{'scroll-active': isScrollActive}">
    <div class="content">
      <div class="u-info">
        <div :class="[{'has-unread': hasUnRead&&isLogin}, {'u-welcome' : !isLogin}, 'avator-cont']" :data-content="unReadNum" @click="goMyCenter()">
          <!-- <img src="../images/pai.png" class="u-avator" v-show="isLogin"> -->
          <img :src="userInfo.avatar" class="u-avator" v-show="isLogin">
        </div>
        <div class="u-det">
          <p class="u-name">{{userInfo.nickname}}</p>
          <p class="u-data" v-if="isLogin"><span>LV{{userInfo.group_level}}{{userInfo.group_title}}</span><span>{{userInfo.credits}}积分</span><span>{{userInfo.extcredits1}}威望</span></p>
          <p class="u-data" v-else><span>{{userInfo.total_members}}会员</span><span>{{userInfo.total_post}}帖子</span></p>
        </div>
        <div class="u-sign">
          <div v-show="isLogin && !isSigned" @click="sign" class="btn-blue">社区签到</div>
          <div v-show="!isLogin" class="btn-blue" @click="goLogin">注册/登录</div>
          <div class="sign-done btn-grey" v-show="isLogin && isSigned">
            <span class="icon icon-signed"></span>
            <font>已签到</font>
          </div>
        </div>
      </div>
      <div class="tabs">
        <span :class="[{'active': tabType === 0}, 'tab']" @click="triggerTab(0)">热门</span>
        <span :class="[{'active': tabType === 1}, 'tab']" @click="triggerTab(1)">最新</span>
        <span :class="[{'active': tabType === 2}, 'tab']" @click="triggerTab(2)">精华</span>
        <span class="tab-module" @click="triggerModules(1)"><i class="icon-module"></i><i>板块</i></span>
      </div>
      <div class="s-container" :style="{height: sHeight + 'rem', transform: scrollX}">
      <div class="scroll-list">
      <list :config.once="hotScrollConfig" @init="onInitList" @refresh="onRefreshList" @loadmore="onLoadMore" ref="hotList">
        <div class="scroll-wrapper" slot="scrollContent" id="hotScroll">
        <div class="recommend-cont">
          <div class="r-title">
            <span>小编推荐</span>
            <span @tap="goRecomment">更多<i class="icon-arrow-grey"></i></span>
          </div>
          <ul class="swiper-container" >
            <li class="recomment-item recomment-bg" v-for="(item, index) in recommentPosts" :data-id="item.tid" :style="{'background-color': item.bgcolor}" @tap="goDetail(item.tid, 'recomment')">
              <div class="rt-container"><span>{{item.subject}}</span></div>
            </li>
          </ul>
        </div>
        <ul class="post-list" @tap="listClickFunc($event)">
          <post-item v-for="(item, index) in hotList" :data="item">
            <!-- <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.authorid" class="c-event">
                <img :src="item.avatar"><font >{{item.nickname, 6 | ellipsisText}}</font><font v-if="item.first == '0'">回复了帖子</font><font v-else>发表了帖子</font>
              </span>
              <span v-html="item.dateline"></span>
            </div> -->
            <div class="item-message c-event" slot="itemMessage" data-type="userclick" :data-id="item.authorid" >
                <div class="item-u">
                    <img :src="item.avatar" class="i-avator">
                    <font class="i-name">{{item.nickname, 3 | ellipsisText}}</font>
                    <font v-if="item.first == '0'">回复了帖子</font>
                    <font v-else>发表了帖子</font>
                    <font>|</font>
                    <font v-html="item.dateline"></font>
                </div>
                <div class="item-m">
                    <div class="post-view">
                        <i class="icon-view"></i>
                        <span>{{item.views}}</span>
                    </div>
                    <div class="post-reply">
                        <i class="icon-reply"></i>
                        <span>{{item.replies}}</span>
                    </div>
                </div>
            </div>

          </post-item>
        </ul>
        </div>
        </list>
        
      </div>
      <div class="scroll-list">
      <list :config.once="newScrollConfig" @init="onInitList" @refresh="onRefreshList" @loadmore="onLoadMore" ref="newList">
        <div class="scroll-wrapper" slot="scrollContent" id="newScroll">
        <ul class="post-list" @tap="listClickFunc($event)">
          <post-item v-for="item in newList" :data="item">
            <!-- <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.authorid" class="c-event">
                <img :src="item.avatar"><font>{{item.nickname, 6 | ellipsisText}}</font><font v-if="item.first == '0'">回复了帖子</font><font v-else>发表了帖子</font>
              </span>
              <span v-html="item.dateline"></span>
            </div> -->
            <div class="item-message c-event" slot="itemMessage" data-type="userclick" :data-id="item.authorid">
                <div class="item-u">
                    <img :src="item.avatar" class="i-avator">
                    <font class="i-name">{{item.nickname, 3 | ellipsisText}}</font>
                    <font v-if="item.first == '0'">回复了帖子</font>
                    <font v-else>发表了帖子</font>
                    <font>|</font>
                    <font v-html="item.dateline"></font>
                </div>
                <div class="item-m">
                    <div class="post-view">
                        <i class="icon-view"></i>
                        <span>{{item.views}}</span>
                    </div>
                    <div class="post-reply">
                        <i class="icon-reply"></i>
                        <span>{{item.replies}}</span>
                    </div>
                </div>
            </div>
          </post-item>
        </ul>
        </div>
        </list>
      </div>
      <div class="scroll-list">
      <list :config.once="essenceScrollConfig" @init="onInitList" @refresh="onRefreshList" @loadmore="onLoadMore" ref="essenceList">
        <div class="scroll-wrapper" slot="scrollContent" id="essenceScroll">
        <ul class="post-list" @tap="listClickFunc($event)">
          <post-item v-for="item in essenceList" :data="item">
            <!-- <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.authorid" class="c-event">
                <img :src="item.avatar"><font>{{item.nickname, 6 | ellipsisText}}</font><font v-if="item.first == '0'">回复了帖子</font><font v-else>发表了帖子</font>
              </span>
              <span v-html="item.dateline"></span>
            </div> -->
            <div class="item-message c-event" slot="itemMessage" data-type="userclick" :data-id="item.authorid">
                <div class="item-u">
                    <img :src="item.avatar" class="i-avator">
                    <font class="i-name">{{item.nickname, 3 | ellipsisText}}</font>
                    <font v-if="item.first == '0'">回复了帖子</font>
                    <font v-else>发表了帖子</font>
                    <font>|</font>
                    <font v-html="item.dateline"></font>
                </div>
                <div class="item-m">
                    <div class="post-view">
                        <i class="icon-view"></i>
                        <span>{{item.views}}</span>
                    </div>
                    <div class="post-reply">
                        <i class="icon-reply"></i>
                        <span>{{item.replies}}</span>
                    </div>
                </div>
            </div>
          </post-item>
        </ul>
        </div>
        </list>
      </div>
      </div>
    </div>
    </div>
      <i class="post-add" @click="goPost"></i>
      <section class="message-dialog" v-show="showModulesContainer">
        <div class="masker" @click="triggerModules(0)"></div>
        <transition name="slide" v-on:before-enter="beforeEnter" v-on:after-leave="afterLeave">
          <ul class="module-list" @click="goModuleList($event)" v-show="showModules">
            <li class="p-module" data-id="29">
              <i class="icon-module icon-module-invest"></i>
              <span class="module-txt">投资交流</span>
            </li>
            <li class="p-module" data-id="2">
              <i class="icon-module icon-module-hot"></i>
              <span class="module-txt">热门活动</span>
            </li>
            <li class="p-module" data-id="25">
              <i class="icon-module icon-module-question"></i>
              <span class="module-txt">有问必答</span>
            </li>
            <li class="p-module" data-id="65">
              <i class="icon-module icon-module-suggest"></i>
              <span class="module-txt">团粉建言</span>
            </li>
            <li class="p-module" data-id="27">
              <i class="icon-module icon-module-speak"></i>
              <span class="module-txt">畅所欲言</span>
            </li>
            <li class="p-module" data-id="68">
              <i class="icon-module icon-module-news"></i>
              <span class="module-txt">财经新闻</span>
            </li>
            <li class="p-module" data-id="43">
              <i class="icon-module icon-module-td-news"></i>
              <span class="module-txt">团贷动态</span>
            </li>
            <!-- <li class="p-module" data-id="44">
              <i class="icon-module icon-module-video"></i>
              <span class="module-txt">团贷视频</span>
            </li> -->
            <li class="p-module" data-id="67">
              <i class="icon-module icon-module-ceo"></i>
              <span class="module-txt">CEO专栏</span>
            </li>
          </ul>
        </transition>
      </section>
  </div>
</template>

<script>
// import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
import Services from '../services'
// import Util from '../js/Util.js'
import List from "components/listview"
import Validate from '../js/lib/validate.js'
import {ellipsisText, uniq, isApp} from '../filters'
import Loader from '../components/loader'

export default {
  name: 'mainView',
  components: {
    // Zheader,
    Toast,
    PostItem,
    List
  },
  data() {
    return {
      isScrollActive: true,
      hasUnRead: false,
      unReadNum: 0,
      isLogin: false,
      isSigned: false,
      tabType: 0,
      userInfo: {},
      recommentPosts: [],
      sHeight: 0,
      scrollX: 'translateX(0)',
      hotList: [],
      newList: [],
      essenceList: [],
      showModules: false,
      showModulesContainer: false,
      pageData: {
        hot: {
          curPage: 1,
          totalPage: 1
        },
        new: {
          curPage: 1,
          totalPage: 1
        },
        essence: {
          curPage: 1,
          totalPage: 1
        }
      },
      hotScrollConfig: {
        wrapper: 'hotScroll',
        mutationObserver: true,
        refresh: true,
        loadmore: true,
        status: 1 //列表数据状态-0：空数据；1-正常；-1：错误
      },
      newScrollConfig: {
        wrapper: 'newScroll',
        mutationObserver: true,
        refresh: true,
        loadmore: true,
        status: 1
      },
      essenceScrollConfig: {
        wrapper: 'essenceScroll',
        mutationObserver: true,
        refresh: true,
        loadmore: true,
        status: 1
      },
      loader: null,
      listRequesting: false,
      infoRequesting: false,
      isDev: true //是否是开发环境
      
    }
  },
  computed: {
    isApp() {
      return isApp()
    }
  },
  watch: {
    $route:function(to, from) {
      if(to.name == 'main') { //如果变化是在首页
        this.getHeadData()
        
        // 增加主动刷新list
        this.$refs.hotList && this.$refs.hotList.refresh()
        this.$refs.newList && this.$refs.newList.refresh()
        this.$refs.essenceList && this.$refs.essenceList.refresh()
      }

    }
  },
  methods: {
    headerRightBtnFun() {
      console.info('11111')
    },
    triggerTab(type) {
      //tab切换
      this.tabType = type
      let num = +type * (-100)
      this.scrollX = 'translateX(' + num + '%)'
        // console.info('scrollX----', this.scrollX)
      let param = {
        version: 4,
        module: 'forum',
        page: 1
      }
      if (type === 0) {
        this.isDev || MtaH5.clickStat("homehot")
        if (this.hotList.length < 1) {
          param.action = 'hot_threads'
          this.getListData(param)
        }

      } else if (type === 1) {
        this.isDev || MtaH5.clickStat("homenew")
        if (this.newList.length < 1) {
          param.action = 'new_posts'
          this.getListData(param)
        }

      } else if (type === 2) {
        this.isDev || MtaH5.clickStat("homeselected")
        if (this.essenceList.length < 1) {
          param.action = 'digest_threads'
          this.getListData(param)

        }
      }
    },
    sign () {
      //签到
      let that = this
      that.isDev || MtaH5.clickStat("signin")
      Services.postData('/app/index.php', {
        version: 4,
        module: 'member',
        action: 'sign'
      }).then((response) => {
        console.info('sign-----', response)
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data.member
          that.userInfo.group_level = data.group_level
          that.userInfo.group_title = data.group_name
          that.userInfo.credits = data.credit
          that.userInfo.extcredits1 = data.extcredits1
          that.isSigned = true
          Toast({
            message: '签到成功，积分+' + data.add_credit + '，威望+' + data.add_extcredits1,
            position: 'top'
          })
        } else {
          let msg = ''
          if (_body.message) {
            msg = _body.message
          } else {
            msg = '请求失败，请稍后重试'
          }
          Toast({
            message: msg,
            position: 'top'
          })
        }
      }, (response) => {
         Toast({
            message: response && response.message || '请求失败，请稍后重试',
            position: 'top'
          })
        // console.info('sign fail-----', response)
      })
    },
    goDetail(id, type) {
      //跳转到帖子详情
      // console.info('id------', id)
      if (type === 'recomment') {
        this.isDev || MtaH5.clickStat("homerecommend")
      } else {
        switch (this.tabType) {
          case 0:
            this.isDev || MtaH5.clickStat("hotarticle")
            break
          case 1:
            this.isDev || MtaH5.clickStat("newarticle")
            break
          case 2:
            this.isDev || MtaH5.clickStat("selectedarticle")
            break
        }
      }
      var url = '/postdetail/' + id
      this.$router.push(url)
    },
    goMyCenter() {
      //跳转到我的个人中心
      this.isDev || MtaH5.clickStat("myavatar")
      if (this.isLogin) {
        var url = '/centermy'
        this.$router.push(url)
      }
    },
    goUserCenter(id) {
      //跳转到其他人的个人中心
      this.isDev || MtaH5.clickStat("otheravatar")
      var url = '/centerother/' + id
      this.$router.push(url)
    },
    goPost() {
      //跳转到发表帖子
      if (this.isLogin) {
        this.isDev || MtaH5.clickStat("homepost")
        this.$router.push('/post')
      } else {
        Validate.openLogin()
      }
    },
    listClickFunc(e) {
      // 列表点击事件
      // console.info(e.target,e.target.getAttribute('dataid'))
      let obj = Util.getElemetByTarget(e.target, 'c-event', 'post-list')
        // let parentObj = e.target.parentElement
        // let type = obj.getAttribute('data-type')
        // let id = obj.getAttribute('data-id')
      if (!obj) return
      let type = obj.dataset.type
      let id = obj.dataset.id
      if (!type) {
        type = e.target.getAttribute('data-type')
        id = e.target.getAttribute('data-id')
      }
      if (type === 'userclick') {
        this.goUserCenter(id)
      } else if (type === 'itemclick') {
        this.goDetail(id)
      }
    },
    triggerModules(type) {
      if (type === 0) {
        this.showModules = false
      } else {
        this.isDev || MtaH5.clickStat("zonelist")
        this.showModules = true
      }
    },
    goModuleList(e) {
      let _module = Util.getElemetByTarget(e.target, 'p-module', 'p-module')
      if (_module) {
        let moduleId = _module.dataset.id
        console.info(moduleId)
        switch(+moduleId) {
          case 29:
          //投资交流
          this.isDev || MtaH5.clickStat("zoneinvest")
          break;
          case 2:
          //热门活动
          this.isDev || MtaH5.clickStat("zoneactivity")
          break;
          case 25:
          //有问必答
          this.isDev || MtaH5.clickStat("zoneqa")
          break;
          case 65:
          //团粉建言
          this.isDev || MtaH5.clickStat("zonesugestion")
          break;
          case 27:
          //畅所欲言
          this.isDev || MtaH5.clickStat("zonefreechat")
          break;
          case 68:
          //财经新闻
          this.isDev || MtaH5.clickStat("zonefinancialnews")
          break;
          case 43:
          //团贷动态
          this.isDev || MtaH5.clickStat("zonetuandainews")
          break;
          case 67:
          //CEO专栏
          this.isDev || MtaH5.clickStat("zoneceo")
          break;
         
        }
        let url = '/sessionlist/' + moduleId
        this.$router.push(url)
        this.showModules = false
      }

    },
    beforeEnter() {
      this.showModulesContainer = true
    },
    afterLeave() {
      // console.info('afterLeave-----', new Date().getTime())
      this.showModulesContainer = false
    },
    goRecomment() {
      this.isDev || MtaH5.clickStat("morerecommend")
      this.$router.push('/recomment')
    },
    getHeadData() {
      //获取用户登录数据
      let that = this
      let loginToken = Util.getParam('t')
      console.info('getHeadData--loginToken--', loginToken)
      if(!loginToken) {
        loginToken = Util.getSessionStorage('bbs_token');
      }
      /*Vue.http.options.before = function() {
        that.infoRequesting = true
        that.loader.show()
      }*/
      that.infoRequesting = true
      if (that.loader) {
        that.loader.show()
      } else {
        that.loader = Loader()
        that.loader.show()
      }
      Services.postData('/app/index.php', {
        'version': 4,
        'module': 'forum',
        'action': 'index_top',
        'v_token': loginToken || 0,
        'notLoader': false
      }).then((response) => {
        console.info('getHeadData----', response)
        let _body = response.body
        if (_body.code === '200') {
          that.userInfo = _body.data.list
          if (that.userInfo.is_login === '1') {
            that.isLogin = true
            if(that.userInfo.uid) {
              Util.setSessionStorage('uid', that.userInfo.uid)
            }

            that.hasUnRead = that.userInfo.notice && (+that.userInfo.notice) > 0
            that.unReadNum = +that.userInfo.notice > 99 ? '99+' : that.userInfo.notice

            /*if (that.userInfo.notice && (+that.userInfo.notice) > 0) {
              that.hasUnRead = true
              // 超过99显示99+
              that.unReadNum = +that.userInfo.notice > 99 ? '99+' : that.userInfo.notice
            }*/
          } else {
            that.userInfo.nickname = '欢迎来到团粉圈~'
            that.isLogin = false
          }
          if (that.userInfo.is_sign === '1') {
            that.isSigned = true
          }
        } else {
          that.isLogin = false
          Toast({
            message: _body && _body.message || '请求失败，请稍后重试'
          })
        }
        that.infoRequesting = false
        console.info('infoRequesting=' + that.infoRequesting, '---listRequesting=' + that.listRequesting)
        that.hideLoader()
      }, (response) => {
        that.isLogin = false
        console.info('getHeadData---fail---', response)
        that.infoRequesting = false
        that.hideLoader()
        Toast({
          'message': response.body && response.body.message || '请求失败，请稍后重试'
        });
      })

    },
    hideLoader () {
      !this.infoRequesting && !this.listRequesting && this.loader.hide()
    },
    goLogin() {
      if (!this.isLogin) {
        Validate.openLogin()
      }
    },
    getListData(param) {
      //获取列表数据
      let that = this
      if (param.action === 'hot_threads') {
        if (that.pageData.hot.curPage > that.pageData.hot.totalPage) {
          that.$refs.hotList.refresh()
          that.$refs.hotList.loadmore = false
          return;
        }
      } else if (param.action === 'new_posts') {
        if (that.pageData.new.curPage > that.pageData.new.totalPage) {
          that.$refs.newList.refresh()
          that.$refs.newList.loadmore = false
          return;
        }
      } else {
        if (that.pageData.essence.curPage > that.pageData.essence.totalPage) {
          that.$refs.essenceList.refresh()
          that.$refs.essenceList.loadmore = false
          return;
        }
      }
      // Vue.http.options.before = function() {
      //   that.listRequesting = true
      // }
      that.listRequesting = true
      if (that.loader) {
        that.loader.show()
      } else {
        that.loader = Loader()
        that.loader.show()
      }
      Services.postData('/app/index.php', param).then((response) => {
        // console.info('getListData----', response.body)
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          if (param.action === 'hot_threads') {
            //热门

            if (that.pageData.hot.curPage === 1) {
              //第一页数据加载
              that.recommentPosts = data.list.recommend_threads
              that.hotList = data.list.hot_threads

            } else {
              //页数大于1时添加数据
              // that.hotList = that.hotList.concat(data.list.hot_threads)
              that.hotList = uniq(that.hotList.concat(data.list.hot_threads), "tid"); //去重
              that.hotScrollConfig.status = 1
            }
            // 判断是否有加载更多
            that.$refs.hotList.loadmore = +data.pager.cur_page < +data.pager.total_page;
            that.$refs.hotList.refresh() //刷新list
            if (that.pageData.hot.curPage <= that.pageData.hot.totalPage) {
              that.pageData.hot = {
                curPage: +data.pager.cur_page + 1,
                totalPage: +data.pager.total_page
              }
            }


          } else if (param.action === 'new_posts') {
            //最新
            if (that.pageData.new.curPage === 1) {
              that.newList = data.list

            } else {
              // that.newList = that.newList.concat(data.list)
              that.newList = uniq(that.newList.concat(data.list), "tid"); //去重
              that.newScrollConfig.status = 1
            }
            that.$refs.newList.loadmore = +data.pager.cur_page < +data.pager.total_page
            that.$refs.newList.refresh()
            if (that.pageData.new.curPage <= that.pageData.new.totalPage) {
              that.pageData.new = {
                curPage: +data.pager.cur_page + 1,
                totalPage: +data.pager.total_page
              }
            }
          } else {
            //精华
            if (that.pageData.essence.curPage === 1) {
              that.essenceList = data.list

            } else {
              // that.essenceList = that.essenceList.concat(data.list)
              that.essenceList = uniq(that.essenceList.concat(data.list), "tid"); //去重
              that.essenceScrollConfig.status = 0
            }
            that.$refs.essenceList.loadmore = +data.pager.cur_page < +data.pager.total_page
            that.$refs.essenceList.refresh()
            if (that.pageData.essence.curPage <= that.pageData.essence.totalPage) {
              that.pageData.essence = {
                curPage: +data.pager.cur_page + 1,
                totalPage: +data.pager.total_page
              }
            }


          }
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
          let refsObj = null
          switch (param.action) {
            case 'hot_threads':
              refsObj = that.$refs.hotList
              break;
            case 'new_posts':
              refsObj = that.$refs.newList
              break;
            case 'digest_threads':
              refsObj = that.$refs.essenceList
              break;
          }
          if (refsObj) {
            refsObj.refresh()
              // refsObj.loadmore = false
          }

        }
        that.listRequesting = false
        that.hideLoader()
      }, (response) => {
        console.info('getListData fail------', response)
        Toast({
          'message': response.body && response.body.message || '请求失败，请稍后重试'
        });
        let refsObj = null
        switch (param.action) {
          case 'hot_threads':
            refsObj = that.$refs.hotList
            break;
          case 'new_posts':
            refsObj = that.$refs.newList
            break;
          case 'digest_threads':
            refsObj = that.$refs.essenceList
            break;
        }
        if (refsObj) {
          refsObj.refresh()
            // refsObj.loadmore = false
        }
        that.listRequesting = false
        that.hideLoader()
      })
    },
    onInitList () {

    },
    onRefreshList () {
      //list舒心
      let param = {
        version: 4,
        module: 'forum',
        page: 1,
        notLoader: true
      }

      if (this.tabType === 0) {
        this.pageData.hot.curPage = 1
         param.action = 'hot_threads'
      } else if (this.tabType === 1) {
        this.pageData.new.curPage = 1
        param.action = 'new_posts'
      } else {
        this.pageData.essence.curPage = 1
         param.action = 'digest_threads'
      }
      this.getListData(param)
      // this.triggerTab(this.tabType)
    },
    onLoadMore () {
      // list加载下一页
      console.info('loadmore-----')
      let param = {
        version: 4,
        module: 'forum',
        notLoader: true
      }

      if (this.tabType === 0) {
        if(this.pageData.hot.curPage > this.pageData.hot.total_page) {
          return
        }
        param.page = this.pageData.hot.curPage
        param.action = 'hot_threads'
      } else if (this.tabType === 1) {
        if(this.pageData.new.curPage > this.pageData.new.total_page) {
          return
        }
        param.page = this.pageData.new.curPage
        param.action = 'new_posts'
      } else {
        if(this.pageData.essence.curPage > this.pageData.essence.total_page) {
          return
        }
        param.page = this.pageData.essence.curPage
        param.action = 'digest_threads'
      }
      this.getListData(param)
    },
    calculateHeight() {
      //动态计算列表容器高度
      this.sHeight = Util.pxToRemAdapt(document.querySelector('.scroll').clientHeight - document.querySelector('.s-container').offsetTop /*- document.querySelector('.header-bar').clientHeight*/);
    }
  },
  /*activated() {
    // debugger
    console.log('activated');
    this.getHeadData()
  },*/
  mounted() {
    let that = this
      /*//动态计算列表容器高度
      // this.sHeight = Util.pxToRemAdapt(document.documentElement.clientHeight - document.querySelector('.s-container').offsetTop -90);
      this.sHeight = Util.pxToRemAdapt(document.querySelector('.scroll').clientHeight - document.querySelector('.s-container').offsetTop -document.querySelector('.header-bar').clientHeight);*/
    that.calculateHeight()
    //当横屏时 重新计算最小高度 
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, that.calculateHeight, false);
    let param = {
        version: 4,
        module: 'forum',
        action: 'hot_threads',
        page: 1
      }
    that.getHeadData()

    that.getListData(param)

    /*that.$refs.hotList && that.$refs.hotList.refresh()
    that.$refs.newList && that.$refs.newList.refresh()
    that.$refs.essenceList && that.$refs.essenceList.refresh()*/

  }

}
</script>

<style lang="scss" scoped>
@import '../sass/mainview.scss'

</style>

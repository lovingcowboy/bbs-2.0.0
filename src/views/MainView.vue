<template>
  <div class="v1-view">
  <zheader 
    :header-title="'团粉圈'" 
    :has-back="false" 
    :has-rightbtn="false"
    :prevent-back="true"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">
    <div class="content">
      <div class="u-info">
        <div :class="[{'has-unread': hasUnRead&&isLogin}, {'u-welcome' : !isLogin}, 'avator-cont']" :data-content="unReadNum" @click="goMyCenter()">
          <!-- <img src="../images/pai.png" class="u-avator" v-show="isLogin"> -->
          <img :src="userInfo.avatar" class="u-avator" v-show="isLogin">
        </div>
        <div class="u-det">
          <p class="u-name">{{userInfo.nickname}}</p>
          <p class="u-data" v-if="isLogin"><span>{{userInfo.user_level}}大侠</span><span>{{userInfo.credits}}积分</span><span>{{userInfo.extcredits1}}威望</span></p>
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
        <span class="tab-module" @click="triggerModules(1)"><i class="icon-module"></i>板块</span>
      </div>
      <div class="s-container" :style="{height: sHeight + 'rem', transform: scrollX}">
      <div class="scroll-list">
        <div class="recommend-cont">
          <div class="r-title">
            <span>小编推荐</span>
            <span @click="goRecomment">更多<i class="icon-arrow-grey"></i></span>
          </div>
          <ul class="swiper-container">
            <li class="recomment-item recomment-bg" v-for="(item, index) in recommentPosts" :data-id="item.tid">
              <span>{{item.subject}}</span>
            </li>
          </ul>
        </div>
        <ul class="post-list" @click="listClickFunc($event)">
          <post-item v-for="(item, index) in hotList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.tid" class="c-event">
                <img :src="item.avatar"><font>{{item.nickname}}</font><font v-if="item.first == '0'">回复了帖子</font><font v-else>发表了帖子</font>
              </span>
              <span v-html="item.dateline"></span>
            </div>
          </post-item>
        </ul>
      </div>
      <div class="scroll-list">
        <ul class="post-list">
          <post-item v-for="item in newList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.tid" class="c-event">
                <!-- <img src="../images/pai.png"><font>{{item.name}}</font>{{item.act}} -->
                <img :src="item.avatar"><font>{{item.nickname}}</font><font v-if="item.first == '0'">回复了帖子</font><font v-else>发表了帖子</font>
              </span>
              <span v-html="item.dateline"></span>
            </div>
          </post-item>
        </ul>
      </div>
      <div class="scroll-list">
        <ul class="post-list">
          <post-item v-for="item in essenceList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.tid" class="c-event">
                <img :src="item.avatar"><font>{{item.nickname}}</font><font v-if="item.first == '0'">回复了帖子</font><font v-else>发表了帖子</font>
              </span>
              <span v-html="item.dateline"></span>
            </div>
          </post-item>
        </ul>
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
            <li class="p-module" data-id="44">
              <i class="icon-module icon-module-video"></i>
              <span class="module-txt">团贷视频</span>
            </li>
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
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
import service from '../services'
import Util from '../js/Util.js'
import Validate from '../js/lib/validate.js'
export default {
  name: 'mainView',
  components: {
    Zheader,
    Toast,
    PostItem
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
      }
    }
  },
  computed: {},
  methods: {
    headerRightBtnFun() {
      console.info('11111')
    },
    triggerTab(type) {
      this.tabType = type
      let num = +type * (-100)
      this.scrollX = 'translateX(' + num + '%)'
        // console.info('scrollX----', this.scrollX)
      let param = {
        version: 4,
        module: 'forum',
        page: 1
      }
      if (type === 0 && this.hotList.length < 1) {
        param.action = 'hot_threads'
        this.getListData(param)
      } else if (type === 1 && this.newList.length < 1) {
        param.action = 'new_posts'
        this.getListData(param)
      } else if (type === 2 && this.essenceList.length < 1) {
        param.action = 'digest_threads'
        this.getListData(param)
      }
    },
    sign () {
      // Toast({
      //   message: '签到成功，积分+3，威望+5'
      // })
      let that = this
      service.postData('/app/index.php', {
        version: 4,
        module: 'member',
        action: 'sign'
      }).then((response) => {
        console.info('sign-----', response)
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data.member
          that.userInfo.user_level = data.group_level
          that.userInfo.credits = data.credit
          that.userInfo.extcredits1 = data.extcredits1
          that.isSigned = true
          Toast({
            message: '签到成功，积分+' + data.credit + '，威望+' + data.extcredits1
          })
        } else {
          let msg = ''
          if (_body.message) {
            msg = _body.message
          } else {
            msg = '请求失败，请稍后重试'
          }
          Toast({
            message: msg
          })
        }
      }, (response) => {
        console.info('sign fail-----', response)
      })
    },
    goDetail(id) {
      // console.info('id------', id)
      var url = '/postdetail/' + id
      this.$router.push(url)
    },
    goMyCenter() {
      var url = '/centermy'
      this.$router.push(url)
    },
    goUserCenter(id) {
      var url = '/centerother/' + id
      this.$router.push(url)
    },
    goPost() {
      if (this.isLogin) {
        this.$router.push('/post')
      } else {
        validate.openLogin()
      }
    },
    listClickFunc(e) {
      // console.info(e.target.parentElement
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

        this.showModules = true
      }
    },
    goModuleList(e) {
      let _module = Util.getElemetByTarget(e.target, 'p-module', 'p-module')
      if (_module) {
        let moduleId = _module.dataset.id
        console.info(moduleId)
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
      this.$router.push('/recomment')
    },
    getHeadData() {
      let that = this
      let loginToken = Util.getParam('t')
      service.postData('/app/index.php', {
        'version': 4,
        'module': 'forum',
        'action': 'index_top',
        'v_token': loginToken
      }).then((response) => {
        console.info('getHeadData----', response)
        let _body = response.body
        if (_body.code === '200') {
          that.userInfo = _body.data.list
          if (that.userInfo.is_login === '1') {
            that.isLogin = true
            if (that.userInfo.notice && (+that.userInfo.notice) > 0) {
              that.hasUnRead = true
              that.unReadNum = that.userInfo.notice
            }
          } else {
            that.userInfo.nickname = '欢迎来到团粉圈~'
          }
          if (that.userInfo.is_sign === '1') {
            that.isSigned = true
          }
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
        console.info('2222', response)
      })

    },
    goLogin() {
      if (!this.isLogin) {
        Validate.openLogin()
      }
    },
    getListData(param) {
      let that = this
      service.postData('/app/index.php', param).then((response) => {
        console.info('getListData----', response.body)
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          if (param.action === 'hot_threads') {
            //热门
            that.hotList = data.list.hot_threads
            that.recommentPosts = data.list.recommend_threads
            that.pageData.hot = {
              curPage: data.pager.cur_page,
              totalPage: data.total_page
            }

          } else if (param.action === 'new_posts') {
            //最新
            that.newList = data.list
            that.pageData.new = {
              curPage: data.pager.cur_page,
              totalPage: data.pager.total_page
            }
          } else {
            //精华
            that.essenceList = data.list
            that.pageData.essence = {
              curPage: data.pager.cur_page,
              totalPage: data.pager.total_page
            }

          }
        } else {
          let msg = '请求失败，请稍后重试'
          if(_body.message) {
            msg = _body.message
          }
          Toast({
            message: msg
          })
        }
      }, (response) => {
        console.info('getListData fail------', response)
      })
    }
  },
  activated() {
    let that = this
    that.getHeadData()
    /*let param = {
      version: 4,
      module: 'forum',
      action: 'hot_threads',
      page: 1
    }
    console.info('test----', that.hotList)
    that.getListData(param)*/
    // console.info('juan----', Validate.getCookie('tuandaiw'))
  },
  mounted() {
    let that = this
    this.sHeight = Util.pxToRemAdapt(document.documentElement.clientHeight - document.querySelector('.s-container').offsetTop -90);
    let param = {
      version: 4,
      module: 'forum',
      action: 'hot_threads',
      page: 1
    }
    that.getListData(param)
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/mainview.scss'

</style>

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
          <img src="../images/pai.png" class="u-avator" v-show="isLogin">
          <!-- <img :src="userInfo.avator" class="u-avator" v-show="isLogin"> -->
        </div>
        <div class="u-det">
          <p class="u-name">团小贷</p>
          <p class="u-data"><span>LV2大侠</span><span>125积分</span><span>66威望</span></p>
        </div>
        <div class="u-sign">
          <div v-show="isLogin && !isSigned" @click="sign()" class="btn-blue">社区签到</div>
          <div v-show="!isLogin" class="btn-blue">注册/登录</div>
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
      <div class="s-container" :style="{height: sHeight + 'px', transform: scrollX}">
      <div class="scroll-list">
        <div class="recommend-cont">
          <div class="r-title">
            <span>小编推荐</span>
            <span>更多<i class="icon-arrow-grey"></i></span>
          </div>
          <ul class="swiper-container">
            <li class="recomment-item recomment-bg" v-for="(item, index) in recommentPosts">
              <span>{{item.title}}</span>
            </li>
          </ul>
        </div>
        <ul class="post-list" @click="listClickFunc($event,0)">
          <post-item v-for="(item, index) in hotList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.id" class="c-event">
                <img src="../images/pai.png"><font>{{item.name}}</font>{{item.act}}
              </span>
              <span>{{item.time}}</span>
            </div>
          </post-item>
          <!-- <li class="post-row" v-for="item in hotList">
            <div class="item-title">
              <span>
                <img src="../images/pai.png"><font>{{item.name}}</font>{{item.act}}
              </span>
              <span>{{item.time}}</span>
            </div>
            <div class="item-desc">
              <div :class="['post', {'no-img': !item.hasImg}]">
                <p>{{item.pTitle}}</p>
                <p>{{item.pDesc}}</p>
              </div>
              <div class="p-img" v-show="item.hasImg">
                <img src="../images/img.png">
              </div>
            </div>
            <div class="item-message">
              <span class="post-view">{{item.view}}</span>
              <span class="post-reply">{{item.reply}}</span>
            </div>
          </li> -->
          <!-- <li class="post-row">
            <div class="item-title">
              <span>
                <img src="../images/pai.png"><font>神采飞扬</font>发表了帖子
              </span>
              <span>32分钟前</span>
            </div>
            <div class="item-desc">
              <div class="post">
                <p>团贷网大踏步走在紧拥监管，跨越发展之路上</p>
                <p>如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！</p>
              </div>
              <div class="p-img">
                <img src="../images/img.png">
              </div>
            </div>
            <div class="item-message">
              <span class="post-view">1234</span>
              <span class="post-reply">789</span>
            </div>
          </li>
          <li class="post-row">
            <div class="item-title">
              <span>
                <img src="../images/pai.png"><font>神采飞扬</font>发表了帖子
              </span>
              <span>32分钟前</span>
            </div>
            <div class="item-desc">
              <div class="post no-img">
                <p>团贷网大踏步走在紧拥监管，跨越发展之路上</p>
                <p>如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！</p>
              </div>
            </div>
            <div class="item-message">
              <span class="post-view">1234</span>
              <span class="post-reply">789</span>
            </div>
          </li> -->
        </ul>
      </div>
      <div class="scroll-list">
        <ul class="post-list">
          <post-item v-for="item in newList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.id" class="c-event">
                <img src="../images/pai.png"><font>{{item.name}}</font>{{item.act}}
              </span>
              <span>{{item.time}}</span>
            </div>
          </post-item>
        </ul>
      </div>
      <div class="scroll-list">
        <ul class="post-list">
          <post-item v-for="item in essenceList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.id" class="c-event">
                <img src="../images/pai.png"><font>{{item.name}}</font>{{item.act}}
              </span>
              <span>{{item.time}}</span>
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
            <li class="p-module" data-id="0">
              <i class="icon-module icon-module-invest"></i>
              <span class="module-txt">投资交流</span>
            </li>
            <li class="p-module" data-id="1">
              <i class="icon-module icon-module-hot"></i>
              <span class="module-txt">热门活动</span>
            </li>
            <li class="p-module" data-id="2">
              <i class="icon-module icon-module-question"></i>
              <span class="module-txt">有问必答</span>
            </li>
            <li class="p-module" data-id="3">
              <i class="icon-module icon-module-suggest"></i>
              <span class="module-txt">团粉建言</span>
            </li>
            <li class="p-module" data-id="4">
              <i class="icon-module icon-module-speak"></i>
              <span class="module-txt">畅所欲言</span>
            </li>
            <li class="p-module" data-id="5">
              <i class="icon-module icon-module-news"></i>
              <span class="module-txt">财经新闻</span>
            </li>
            <li class="p-module" data-id="6">
              <i class="icon-module icon-module-td-news"></i>
              <span class="module-txt">团贷动态</span>
            </li>
            <li class="p-module" data-id="7">
              <i class="icon-module icon-module-video"></i>
              <span class="module-txt">团贷视频</span>
            </li>
            <li class="p-module" data-id="8">
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
import Util from '../js/Util.js'
export default {
  name: 'mainView',
  components: {
    Zheader,
    Toast,
    PostItem
  },
  data () {
    return {
      isScrollActive: true,
      hasUnRead: false,
      unReadNum: 0,
      isLogin: true,
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
      showModulesContainer: false
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
      let num = +type * (-100)
      this.scrollX = 'translateX(' + num + '%)'
      // console.info('scrollX----', this.scrollX)
    },
    sign () {
      Toast({
        message: '签到成功，积分+3，威望+5'
      })
    },
    goDetail (id) {
      // console.info('id------', id)
      var url = '/postdetail/' + id
      this.$router.push(url)
    },
    goMyCenter () {
      var url = '/centermy'
      this.$router.push(url)
    },
    goUserCenter (id) {
      var url = '/centerother/' + id
      this.$router.push(url)
    },
    goPost () {
      this.$router.push('/post')
    },
    listClickFunc (e) {
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
    triggerModules (type) {
      if (type === 0) {
        this.showModules = false
      } else {

        this.showModules = true
      }
    },
    goModuleList (e) {
      let _module = Util.getElemetByTarget(e.target, 'p-module', 'p-module')
      if (_module) {
        let moduleId = _module.dataset.id
        console.info(moduleId)
        let url = '/sessionlist/' + moduleId
        this.$router.push(url)
        this.showModules = false
      }

    },
    beforeEnter () {
      this.showModulesContainer = true
    },
    afterLeave () {
      // console.info('afterLeave-----', new Date().getTime())
      this.showModulesContainer = false
    }
  },
  beforeMount () {
    let that = this
    that.hasUnRead = true
    that.unReadNum = parseInt(Math.random() * 100)
    for (let i = 0; i < 10; i++) {
      let post = {
        title: '团贷新手攻略' + (i * 10)
      }
      that.recommentPosts.push(post)
    }
  },
  mounted () {
    let that = this
    this.sHeight = document.documentElement.clientHeight - document.querySelector('.s-container').offsetTop
    for (let i = 0; i < 5; i++) {
      let item = {
        name: '神采飞扬',
        act: '发表了帖子',
        time: i * 10 + '分钟前',
        pTitle: '团贷网大踏步走在紧拥监管，跨越发展之路上',
        pDesc: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
        view: 12 * i,
        reply: 25 * i,
        id: i * 10
      }
      if ( i === 1) {
        item.hasImg = true
      }
      that.hotList.push(item)
      that.newList.push(item)
      that.essenceList.push(item)
    }
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/mainview.scss'

</style>

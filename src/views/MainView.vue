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
        <span class="tab-module" ><i class="icon-module"></i>板块</span>
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
        <ul class="post-list">
          <post-item v-for="(item, index) in hotList" :data="item" v-on:onItemClick="goDetail(item.id)">
            <div class="item-title" slot="itemhead">
              <span @click="goUserCenter(item.id)">
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
          <post-item v-for="item in newList" :data="item"></post-item>
        </ul>
      </div>
      <div class="scroll-list">
        <ul class="post-list">
          <post-item v-for="item in essenceList" :data="item"></post-item>
        </ul>
      </div>
      </div>
    </div>
    </div>
      <i class="post-add" @click="goPost"></i>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
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
      essenceList: []
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
        pDesc: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
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

<template>
  <div class="sessionlist-view">
    <zheader 
      :header-title="'团粉圈'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content wrapper" id="outerWrapper">
        <!-- <div class="listwrap wrapper" id="outerWrapper"> -->
          <ul class="scroller">
            <div class="content-header">
              <div class="session-name">{{session}}</div>
              <div class="btn-wrapper" @click="onSwitchAllList">
                <div class="btn btn-all" :class="{'active': isListAllActive}">全部</div>
                <div class="btn btn-essence" :class="{'active': !isListAllActive}">精华</div>
              </div>
            </div>
            <div class="list-all" v-show="isListAllActive">
              <div class="list-top">
                <div class="top-item post-row">
                  <font class="top-label">置顶</font><font class="post-title">4100万的善捐款到底值不值？？</font>
                </div>
                 <div class="top-item post-row">
                  <font class="top-label">置顶</font><font class="post-title">红包不在多，能匹配合适资金用上最好。红包不在多，能匹配合适资金用上最好。</font>
                </div>
              </div>
              <div class="btn-wrapper sticky-header" @click="onSwitchList" :style="{visibility: showFloat == true ? 'hidden' : 'visible'}">
                <div class="btn-newpost" :class="{'active': isListNewpostActive}">最新发表</div>
                <div class="btn-newreply" :class="{'active': !isListNewpostActive}">最新回复</div>
              </div>          
              <ul class="list-newpost post-list">
                <post-item v-for="(item, index) in newPostList" :data="item">
                  <div class="item-title" slot="itemhead">
                    <span data-type="userclick" :data-id="item.id">
                      <img src="../images/pai.png"><font>{{item.name}}</font><font class="level">{{item.level}}</font>
                    </span>
                    <span>{{item.time}}</span>
                  </div>
                </post-item>
              </ul>
              <ul class="list-newreply post-list">
                <post-item v-for="(item, index) in newReplyList" :data="item">
                <div class="item-title" slot="itemhead">
                  <span data-type="userclick" :data-id="item.id" >
                    <img src="../images/pai.png"><font>{{item.name}}</font><font class="level">{{item.level}}</font>
                  </span>
                  <span>{{item.time}}</span>
                </div>
              </post-item>
              </ul>
            </div>
            <ul class="list-essence post-list" v-show="!isListAllActive">
              <post-item v-for="(item, index) in essenceList" :data="item">
              <div class="item-title" slot="itemhead">
                <span data-type="userclick" :data-id="item.id" >
                  <img src="../images/pai.png"><font>{{item.name}}</font><font class="level">{{item.level}}</font>
                </span>
                <span>{{item.time}}</span>
              </div>
            </post-item>
            </ul>
          </ul>
          <div class="btn-wrapper sticky-header sticky" :style="{visibility: showFloat == true ? 'visible' : 'hidden'}" @click="onSwitchList">
            <div class="btn-newpost" :class="{'active': isListNewpostActive}">最新发表</div>
            <div class="btn-newreply" :class="{'active': !isListNewpostActive}">最新回复</div>
          </div>
        </div>
      <!-- </div> -->

    </div>
   
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
import IScroll from '../js/lib/iscroll-probe_my.js';
export default {
  name: 'mission',
  components: {
    Zheader,
    Toast,
    PostItem
  },
  data () {
    return {
      isScrollActive: true,
      session: '投资交流',
      showFloat: false,
      isListAllActive: true,
      isListNewpostActive: true,
      newPostList: [],
      newReplyList: [],
      essenceList: []
    }
  },
  methods: {
   onSwitchAllList(e) { //切换全部、精华列表
    let that = this;
    let target = e.target;
    let prevClass = target._prevClass;
    if(prevClass.indexOf("btn-essence") !== -1) {
      this.isListAllActive = false;
    } else if(prevClass.indexOf("btn-all") !== -1) {
      this.isListAllActive = true;
    }
 
    setTimeout(function() { //延迟刷新iscroll
      that.outerIScroll && that.outerIScroll.refresh();
    }, 200)
      
   },
   onSwitchList(e) {  //切换最新发表跟最新回复
      let target = e.target;
      let prevClass = target._prevClass;
      if(prevClass.indexOf("btn-newpost") !== -1) {
        this.isListNewpostActive = true;
      } else if(prevClass.indexOf("btn-newreply") !== -1) {
        this.isListNewpostActive = false;
      }
   },
   initOuterScroller() {
    let that = this;
    that.outerIScroll = new IScroll("#outerWrapper", {
      probeType: 2,
      click: false,
      tap: true,
      disableMouse: true,
      disablePointer: true
    });

    that.outerIScroll.on('scroll', function() {
      if(!that.isListAllActive) {  //如果不是在全部列表页面，则不做操作
        return;
      }
      if(Math.abs(this.y) >= Util.pxToPx(316)) {
      
        that.showFloat = true
       
      } else {

        that.showFloat = false
       
      }
    });
   }
  },
  mounted() {
    this.initOuterScroller();
  },
  beforeMount () {
    let that = this
    for (let i = 0; i < 2; i++) {
      let item = {
        name: '神采飞扬',
        level: 'LV2 大咖',
        time: i * 10 + '分钟前',
        pTitle: '团贷网大踏步走在紧拥监管，跨越发展之路上',
        pDesc: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
        view: 12 * i,
        reply: 25 * i,
        id: i * 10
      }
      that.newPostList.push(item)
      that.newReplyList.push(item)
      that.essenceList.push(item)
    }

    
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/sessionlist.scss";


</style>

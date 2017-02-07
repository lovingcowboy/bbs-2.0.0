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
      <div class="content">
        <list :config.once="scrollConfig" @init="onIniList" @refresh="onRefreshList" @loadmore="onLoadMore" ref="list">
          <div class="scroll-wrapper" slot="scrollContent">
            <div class="content-header">
              <div class="session-name">{{session}}</div>
              <div class="btn-wrapper" @click="onSwitchAllList">
                <div class="btn btn-all" :class="{'active': isListAllActive}">全部</div>
                <div class="btn btn-essence" :class="{'active': !isListAllActive}">精华</div>
              </div>
            </div>
            <div class="list-all" v-show="isListAllActive">
              <div class="list-top">
               <!--  <div class="top-item post-row">
                  <font class="top-label">置顶</font><font class="post-title">4100万的善捐款到底值不值？？</font>
                </div>
                 <div class="top-item post-row">
                  <font class="top-label">置顶</font><font class="post-title">红包不在多，能匹配合适资金用上最好。红包不在多，能匹配合适资金用上最好。</font>
                </div>
                <div class="top-item post-row">
                  <font class="top-label">置顶</font><font class="post-title">4100万的善捐款到底值不值？？</font>
                </div> -->
              </div>
              <div class="btn-wrapper sticky-header" @tap="onSwitchList" :style="{visibility: showFloat == true ? 'hidden' : 'visible'}">
                <div class="btn-newpost" :class="{'active': isListNewpostActive}">最新发表</div>
                <div class="btn-newreply" :class="{'active': !isListNewpostActive}">最新回复</div>
              </div>
              <ul class=" post-list list-newpost" v-show="isListNewpostActive">
                <post-item v-for="(item, index) in newPostList" :data="item">
                  <div class="item-title" slot="itemhead">
                    <span data-type="userclick" :data-id="item.id">
                      <img src="../images/pai.png"><font>{{item.name}}</font><label class="level">{{item.level}}</label>
                    </span>
                    <span>{{item.time}}</span>
                  </div>
                </post-item>
              </ul>

              <ul class="list-newreply post-list" v-show="!isListNewpostActive">
                <post-item v-for="(item, index) in newReplyList" :data="item">
                  <div class="item-title" slot="itemhead">
                    <span data-type="userclick" :data-id="item.id">
                      <img src="../images/pai.png"><font>{{item.name}}</font><label class="level">{{item.level}}</label>
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
                  <img src="../images/pai.png"><font>{{item.name}}</font><label class="level">{{item.level}}</label>
                </span>
                <span>{{item.time}}</span>
              </div>
            </post-item>
            </ul>
          </div>
        </list>    
        
        <div class="btn-wrapper sticky-header sticky" :style="{visibility: showFloat == true ? 'visible' : 'hidden'}" @click="onSwitchList">
            <div class="btn-newpost" :class="{'active': isListNewpostActive}">最新发表</div>
            <div class="btn-newreply" :class="{'active': !isListNewpostActive}">最新回复</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
import Util from '../js/Util.js'
import List from "components/listview"
export default {
  name: 'mission',
  components: {
    Zheader,
    Toast,
    PostItem,
    List
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
      essenceList: [],
      // isLoading: false,
      scrollConfig: {
        wrapper: 'sessionWrapper',
        mutationObserver: true,
        refresh: true,
        loadmore: true
      }
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
      let that = this;
      if(!that.showFloat) { //当没置顶时
        that.newPostY = that.newReplyY = that.outerIScroll.y;
      } else {  //置顶时
        if(!that.isListNewpostActive) { //因为isListNewpostActive延迟切换，所以为切换前逻辑
          that.newPostY = that.newPostY > -that.switchListSt ? -that.switchListSt : that.newPostY;
        } else {
          that.newReplyY = that.newReplyY > -that.switchListSt ? -that.switchListSt : that.newReplyY;
        }
      }
      
      let time = 0;
      setTimeout(function() { //延迟切换isListNewpostActive
        if(prevClass.indexOf("btn-newpost") !== -1) { //最新发表
          if(that.isListNewpostActive && that.showFloat) {  //如果已经在最新发表则回到最新发表头部
            that.newPostY = -that.switchListSt;
            time = 800;
          }

          that.isListNewpostActive = true;
       
          setTimeout(function() {
            if(that.outerIScroll) { //刷新iscroll，并滑动到记录位置
              that.outerIScroll.refresh();
              if(!that.isScrolling) {
                that.outerIScroll.scrollTo(0, that.newPostY, time);
              }
            }
          }, 200)

        } else if(prevClass.indexOf("btn-newreply") !== -1) { //最新回复
          if(!that.isListNewpostActive && that.showFloat) {  //如果已经在最新发表则回到最新发表头部
            that.newReplyY = -that.switchListSt;
            time = 800;
          }

          that.isListNewpostActive = false;

          setTimeout(function() {
            if(that.outerIScroll) { //刷新iscroll，并滑动到记录位置
              that.outerIScroll.refresh();
              that.outerIScroll.scrollTo(0, that.newReplyY, time);
            }
          }, 200)
        }

      }, 10)
      
   },
   onIniList(scroller) {
    let  that = this;
    that.outerIScroll = scroller;
    let listTopEl = document.querySelector(".list-top");
    let listTopH = Util.pxToRemAdapt(listTopEl ? listTopEl.clientHeight : 0);
    // 计算最新发表、最新回复的位置 换算成rem 92为内容header高度 20为间距 
    that.switchListSt =  Util.remToPx(listTopH + Util.pxToRem(92 + 20 + 20));
    
    // 置顶的y轴位置   
    this.topY = that.switchListSt + Util.pxToRemAdapt(document.querySelector(".sticky-header").clientHeight);
    // 保存最新发表跟最新回复的位置
    this.newPostY = this.newReplyY = -that.switchListSt;

    that.outerIScroll.on('scroll', function() {
      that.isScrolling = true;
      if(!that.isListAllActive) {  //如果不是在全部列表页面，则不做操作
        return;
      }

      if(this.y - 1 < -that.switchListSt) { //置顶条件
        that.showFloat = true
        
      } else {
        that.showFloat = false
      }
      that.isListNewpostActive ? that.newPostY = this.y : that.newReplyY = this.y;  //记录位置


    }); 

    that.outerIScroll.on('scrollEnd', function() {
      setTimeout(function() { //延迟刷新isScrolling状态，因为scroll还会触发多一次
        that.isScrolling = false;
      }, 100)

    })
   },

   onRefreshList() {   // TODO: 刷新数据
    let that = this;
    setTimeout(function() {
      that.$refs.list.refreshDone();
    }, 2000)
   },

   onLoadMore() { // TODO: 加载更多数据
      let that = this;
      setTimeout(function() {
        let hasmore = false;
        for (let i = 0; i < 6; i++) {
          let item = {
            name: '神采飞扬',
            level: 'LV2 大咖',
            time: i * 10 + '分钟前',
            subject: '团贷网大踏步走在紧拥监管，跨越发展之路上',
            message: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
            views: 12 * i,
            replies: 25 * i,
            id: i * 10
          }
          that.newPostList.push(item)
          that.essenceList.push(item)
        }
        that.$refs.list.loadMoreDone(hasmore); //参数表示是否还有更多数据
      }, 2000)
   }
  },
  mounted() {
   
  },
  beforeMount () {
    let that = this
    for (let i = 0; i < 6; i++) {
      let item = {
        name: '神采飞扬',
        level: 'LV2 大咖',
        time: i * 10 + '分钟前',
        subject: '团贷网大踏步走在紧拥监管，跨越发展之路上',
        message: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
        views: 12 * i,
        replies: 25 * i,
        id: i * 10
      }
      that.newPostList.push(item)
      that.essenceList.push(item)
    }

    for (let i = 0; i < 5; i++) {
      let item = {
        name: '神采飞扬',
        level: 'LV2 大咖',
        time: i * 10 + '分钟前',
        subject: 'replie' + i,
        message: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
        views: 12 * i,
        replies: 25 * i,
        id: i * 10
      }

      that.newReplyList.push(item)

    }

    
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/sessionlist.scss";


</style>

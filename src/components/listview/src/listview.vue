<template>
  <div class="listwrap wrapper" :id="config.wrapper" :class="{'refreshing':isRefresh || !config.refresh}" @touchend="listentToTouchEnd">
    <ul class="scroller">
     <section  class="pull-el pull-refresh" v-show="config.refresh">
        <div class="arrow-wrapper" v-show="pulldown" >
          <span v-bind:class="['scroll-icon-arrow', ricon ? 'flip-up' : 'flip-down']"></span>
        </div>
        <div class="loading-wrapper" v-show="refreshicon">
          <span class="icon-loading"></span>
        </div>
      </section>

      <slot name="scrollContent"></slot>

      <section  class="pull-el pull-down" v-show="config.loadmore && loadmore">
        <div class="loading-wrapper" v-show="showmore">
          <span class="icon-loading"></span>
        </div>
      </section>
    </ul>
    <div class="default-ctn" v-show="!hasdata">暂无数据</div>

    <!-- <section class="error-container" v-show="config.status === 0 || config.status === -1">
    <div class="ec-cont">
        <i :class="{'icon-pai-null': config.status === 0, 'icon-pai-error': config.status === -1}"></i>
        <span class="ec-txt" v-show="config.status === 0">这里空空如也！</span>
        <span class="ec-txt" v-show="config.status === -1">小π遇到了一点小问题！</span>
        <div class="ec-btns">
            <i class="ec-reload">刷新</i>
            <i class="ec-main">返回首页</i>
        </div>
    </div>
      </section> -->
  </div>
  
</template>

<style>
 
</style>

<script type="text/babel">
import IScroll from '../../../js/lib/iscroll-probe_my.js';
import Util from '../../../js/Util.js';
import spinner from '../../Spinner.vue'
  export default {
    name: 'listview',
    data () {
      return {
        refreshicon: false, //是否显示刷新图标
        showrefresh: false, //是否显示刷新
        pulldown: false, //是否显示刷新文字
        showmore: false, //是否显示加载更多
        loadmore: true, //是否显示加载更多容器，默认有加载更多
        hasdata: true, //是否有数据
        ricon: false, //是否在可刷新状态
        micon: false,
        isRefresh: false,  //是否刷新中,
        isLoadMore: false   //是否加载更多中,
      }
    },
    props: ['config'],
    methods: {
      init() {
        this.initScroller();
        this.listentToScroll();
        this.listentToScrollEnd();
        this.listentToTouchEnd();

        this.$emit("init", this.myScroll) //初始化完成
      },

      initScroller() {
        let that = this;
        that.myScroll = new IScroll("#" + this.config.wrapper, {
          probeType: 2,
          click: false,
          tap: true,
          disableMouse: true,
          disablePointer: true,
          mutationObserver: this.config.mutationObserver 
        });
       
      },

      listentToScroll() { //监听滑动
        var that = this;
         that.myScroll && that.myScroll.on('scroll', function() {
          if(that.isLoadMore || that.isRefresh) {  //数据加载中状态，不修改任何状态
            return;
          }
          //下拉显示刷新
          let distance = Util.pxToPx(90);

          if(this.y >= -Util.pxToPx(99)) {  //提前显示下拉刷新
            if(this.y > distance) {
              that.ricon = true;
            } else {
              that.ricon = false;
            }

            that.pulldown = true;
            that.refreshicon = false;
          } else if(Math.abs(this.y) >= (Math.abs(this.maxScrollY) - distance) && that.loadmore) { //加载更多
            that.micon = true;
          }

        }); 
      },

      listentToTouchEnd() { //因为修改iscroll 实时触发scroll、scrollEnd事件，所以在下拉刷新改用touchend事件
        let that = this;
       if (that.ricon) { //在可以刷新状态
          that.refreshicon = true;  

          if(that.isRefresh) {  //数据加载中状态，不做任何操作
            return;
          }
          that.isRefresh = true;  //数据加载中状态
  
          // 修改为刷新中状态
          that.ricon = false;
          that.pulldown = false;
          that.refreshicon = true;
          // 刷新中事件
          that.$emit('refresh');
          setTimeout(function() {
             that.myScroll.refresh();
          }, 200)

        }
      },

      listentToScrollEnd() {  //监听滑动结束
        let that = this;

        that.myScroll && that.myScroll.on('scrollEnd', function() {
          if (that.micon) {  //在可以加载更多数据状态
            if(that.isLoadMore) {  //数据加载中状态，不继续加载数据
              return;
            }
            that.isLoadMore = true;
            that.micon = false;
            that.$emit('loadmore');

            setTimeout(function() {
               that.myScroll.refresh();
            }, 200)
          } /*else {
            setTimeout(function() {
              that.myScroll.refresh();
            }, 10)
          }*/
        });
      },
      
      refreshDone() { //刷新数据结束
        let that = this;
        that.isRefresh = false;

        setTimeout(function() {
          // 重置状态
          that.refreshicon  = false;
          that.showrefresh  = false;
          that.pulldown  = false;
          that.showmore = true;
          that.ricon = false;
          that.micon = false;
        }, 200)
      },

      loadMoreDone(hasmore) { //加载更多数据结束
        let that = this;
        that.isLoadMore = false;
        that.micon = false;
        that.showmore = that.loadmore = hasmore;  //是否还有加载更多
         setTimeout(function() {
            that.myScroll && that.myScroll.refresh();
          }, 200)
      },

      onNoData() {
        this.hasdata = false;
        this.showmore = false;
      },

      refresh() { //刷新iscroll
        let that = this;
        if(!that.myScroll) {
          return;
        }

        let scroller =  that.myScroll;

        that.isRefresh = false;
        that.isLoadMore = false;
          
        setTimeout(function() { // 刷新iscroll
          that.myScroll.refresh();
          if(scroller.scroller.clientHeight < scroller.wrapper.clientHeight) {
            that.showmore = false;
          } else {
            that.showmore = true;
          }
        }, 200);

      }
    },
      
    mounted () {
      this.init();
      /*if(this.config.status !== 0 && this.config.status !== -1) {
        this.config.status = 1
      }*/
    }
  }
</script>
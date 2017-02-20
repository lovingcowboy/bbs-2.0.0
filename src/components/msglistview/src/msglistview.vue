<template>
  <div class="listwrap wrapper msg-wrapper" :id="config.wrapper" @touchend="listentToTouchEnd" @touchstart="listentToTouchStart">
    <ul class="scroller">
     <section  class="pull-el pull-down" v-show="loadmore">
        <div class="loading-wrapper">
          <span class="icon-loading"></span>
        </div>
      </section>
      <slot name="scrollContent"></slot>
    </ul>
  </div>
</template>

<style>
 .msg-wrapper {
  top: 0;
 }
</style>

<script type="text/babel">
import IScroll from '../../../js/lib/iscroll-probe_my.js';
import Util from '../../../js/Util.js';
  export default {
    name: 'msglistview',
    data () {
      return {
        micon: false,
        loadmore: false, //是否显示加载更多容器
        isLoadMore: false   //是否加载更多中,
      }
    },
    props: ['config'],
    methods: {
      init() {
        this.initScroller();
        this.listentToScroll();
        this.listentToScrollEnd();

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

        // window.scroller=  that.myScroll;
        // that.myScroll.scrollTo(0, that.myScroll.maxScrollY, 0);
      },

      listentToScroll() { //监听滑动
        
        let that = this;
        
        that.myScroll && that.myScroll.on('scroll', function() {
         
            if(that.touchstart)
              that.micon = this.y > -Util.pxToPx(80);
        })
      },

      listentToTouchStart() {
        this.touchstart = true; 
      },

      listentToTouchEnd() { //因为修改iscroll 实时触发scroll、scrollEnd事件，所以在加载更多改用touchend事件
       // let that = this;
       // // that.myScroll && that.myScroll.on('scrollEnd', function() {
       //  console.log(1231);
       //    if (that.micon && that.loadmore) {  //在可以加载更多数据状态
       //      if(that.isLoadMore) {  //数据加载中状态，不继续加载数据
       //        return;
       //      }
       //      that.isLoadMore = true;
       //      that.micon = false;
       //      that.$emit('loadmore');

       //      setTimeout(function() {
       //         that.myScroll.refresh();
       //      }, 200)
       //    }
        // });
      },

      listentToScrollEnd() {  //监听滑动结束
        let that = this;
        
        that.myScroll && that.myScroll.on('scrollEnd', function() {
         
          if (that.micon && that.loadmore) {  //在可以加载更多数据状态

            if(that.isLoadMore) {  //数据加载中状态，不继续加载数据
              return;
            }

            that.isLoadMore = true;
            that.micon = false;
            that.$emit('loadmore');

            setTimeout(function() {
               that.myScroll.refresh();
            }, 200)
          }
        });
      },
   

      loadMoreDone(hasmore) { //加载更多数据结束
        let that = this;
        
        that.micon = false;
        that.loadmore = hasmore;  //是否还有加载更多
         setTimeout(function() {
            that.myScroll && that.myScroll.refresh();
            setTimeout(function() { //延迟修改状态
              that.isLoadMore = false;
            }, 100)
          }, 200)
      },

      
      refresh(isScrollToEnd) { //刷新iscroll
        let that = this;
        if(!that.myScroll) {
          return;
        }

        let scroller =  that.myScroll;

        let lastMaxScrollY = that.myScroll.maxScrollY;
        setTimeout(function() { // 刷新iscroll
          that.myScroll.refresh();
          setTimeout(function() { //延迟修改状态
            that.isLoadMore = false;
          }, 100)
          
          if(isScrollToEnd) {
            that.myScroll.scrollTo(0, that.myScroll.maxScrollY, 200);
          } else {
            that.myScroll.scrollTo(0, that.myScroll.maxScrollY - lastMaxScrollY, 0);
          }
        }, 200);

      }
    },
      
    mounted () {
      this.init();
    }
  }
</script>
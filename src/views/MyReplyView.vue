<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的回复'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
        <list :config.once="scrollConfig" @init="onInitList"  @loadmore="onLoadMore" ref="list" >
          <div class="scroll-wrapper" slot="scrollContent"  @tap="goPostDetail">
            <div class="reply-item" v-for="(item, index) in myReplyList" :data-id="item.tid">
              <div class="line01 reply-body">{{item.reply | imgFilter}}</div>
              <div class="line02 reply-origin">原贴：{{item.subject}}</div>
              <div class="line03 reply-time">{{item.dateline}}</div>
            </div>

            <!-- <div class="post-item" v-for="(item, index) in myPostList" :data-id="item.id">
             <div class="line01 post-title">
               {{item.subject}}
             </div>
             <div class="line02">
               <div class="post-time">{{item.dateline}}</div>
               <div class="item-message">
                 <span class="post-view">{{item.views}}</span>
                 <span class="post-reply">{{item.replies}}</span>
               </div>
             </div>
            </div> -->
          </div>
        </list> 
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Services from '../services'
import List from 'components/listview'
import Util from '../js/Util.js'
export default {
  components: {
    Zheader,
    Toast,
    List
  },
  data () {
    return {
      isScrollActive: true,
      scrollConfig: {
        wrapper: 'postWrapper',
        mutationObserver: true,
        refresh: false,
        loadmore: true
      },
      myReplyList: []
    }
  },
  filters: {
    imgFilter: function (value) { //替换img标签为"[图片]"
      if (!value) return ''
      return value.replace(/<img[^>]+src=['"]([^'"]+)['"]+>/g, "[图片]");
    }
  },
  methods: {
   getPostList(params) { //获取帖子列表
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

          if(params.page == 1) { //刷新或者第一次加载数据
            that.myReplyList = data.list;
            // that.myReplyList[0].reply = "<img src='https://bbs.tuandai.com/static/image/smiley/default/loveliness.gif'>";
          } else if(params.page > 1) { //加载更多数据
            that.myReplyList = that.myReplyList.concat(data.list);
          }

          /*for (let i = 0; i < 10; i++) {
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
            that.myReplyList.push(item)
          }*/

          //记录页数信息
          that.pager = data.pager;
          if(that.$refs.list) {
            if(that.myReplyList.length == 0) { //无数据
              that.$refs.list.onNoData();
            } else {  //刷新list
               // 判断是否有加载更多
              if(Number(that.pager.cur_page) < Number(that.pager.total_page)) {
                that.$refs.list.loadmore = true; //有加载更多
              } else {
                that.$refs.list.loadmore = false; //有加载更多
                if(Number(that.pager.cur_page) > 1) {
                  Toast({
                    "message": "已全部加载完毕"
                  })
                }
                
              }
            }
            that.$refs.list.refresh();
          }
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
          that.$refs.list.refresh();
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
          that.$refs.list.refresh();
      })
    },

    onInitList(scroller) {
      this.outerScroller = scroller;
    },

    /*onRefreshList() {   // TODO: 刷新数据
      let that = this;
      that.$refs.list.refreshDone();
    },*/

    onLoadMore() {
      let that = this;
      this.params.page = Number(this.pager.cur_page) + 1;
      this.getPostList(this.params);
    },
    goPostDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'reply-item', 'scroll-wrapper');
       
      if (!obj) return;

      let id = obj.dataset && obj.dataset.id 
      
      if(!id) return;

      let url = '/postdetail/' + id
      this.$router.push(url)
    }
  },
  beforeMount () {
    this.params = {
      version: 4,
      module: 'mythread',
      type:'reply',
      page:  1,

    }
    this.getPostList(this.params)
  }
  
  
}
</script>

<style lang="scss" scoped>
@import "../sass/myreply.scss";

   </style>

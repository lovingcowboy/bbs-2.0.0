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
              <div class="line03 reply-time" v-html='item.dateline'></div>
            </div>
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
// import Util from '../js/Util.js'
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
      return value.replace(/<img .*?>/g, "[图片]");
    }
  },
  methods: {
   getPostList(params) { //获取帖子列表
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

        
          that.myReplyList = that.myReplyList.concat(data.list);
         
          //记录页数信息
          that.pager = data.pager;
          if(!that.$refs.list) return;

          // 判断是否有加载更多
          that.$refs.list.loadmore = Number(that.pager.cur_page) < Number(that.pager.total_page);
             
          
          that.$refs.list.refresh();
          
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });

          that.$refs.list && that.$refs.list.refresh();
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
          
          that.$refs.list &&  that.$refs.list.refresh();
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

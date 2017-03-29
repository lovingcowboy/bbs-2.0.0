<template>
  <div class="myreply-view">
    <zheader 
      :header-title="'我的回复'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
        <list :config.once="scrollConfig" @loadmore="onLoadMore();" ref="list" >
          <div class="scroll-wrapper" slot="scrollContent"  @tap="goPostDetail($event);">
            <div class="reply-item" v-for="(item, index) in myReplyList" :data-id="item.tid">
              <div class="line01 reply-body">{{item.reply | imgFilter}}</div>
              <div class="line02 reply-origin">原贴：{{item.subject}}</div>
              <div class="line03 reply-time" v-html='item.dateline'></div>
            </div>
            <tips :config="tipsConfig"></tips>
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
import Validate from '../js/lib/validate.js'
import List from 'components/listview'
import Tips from '../components/Tips.vue'
export default {
  components: {
    Zheader,
    Toast,
    List,
    Tips
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
      myReplyList: [],
      tipsConfig: {
        noData: false,
        text: '您还没有发表过回复哦！'
      },
      hasData: false
    }
  },
  filters: {
    imgFilter: function (value) { //替换img标签为 [图片]
      if (!value) return ''
      return value.replace(/<img .*?>/g, '[图片]');
    }
  },
  methods: {
   getPostList(params) { //获取帖子列表
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body;
        if (_body.code === '200') {
          let data = _body.data;

          that.hasData = true;  //有数据的标识
          
          that.myReplyList = that.myReplyList.concat(data.list)

          that.tipsConfig.noData = that.myReplyList.length == 0;  //是否显示空数据状态

          //记录页数信息
          that.pager = data.pager;

          if(!that.$refs.list) return;

          // 判断是否有加载更多
          that.$refs.list.loadmore = +that.pager.cur_page < +that.pager.total_page;
          //获取浏览器地址栏 routername
          let routerName = window.location.hash.split('?')[0].split('/')[2]  
          console.log(routerName)
          if('myreply' === routerName) { //如果不在该页面则不刷新list
              that.$refs.list.refresh();
          }   
          
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
          //获取浏览器地址栏 routername
          let routerName = window.location.hash.split('?')[0].split('/')[2]  
          if('myreply' === routerName) { //如果不在该页面则不刷新list
               that.$refs.list && that.$refs.list.refresh();
          } 
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });
          //获取浏览器地址栏 routername
          let routerName = window.location.hash.split('?')[0].split('/')[2]  

          if('myreply' === routerName) { //如果不在该页面则不刷新list
               that.$refs.list && that.$refs.list.refresh();
          } 
      })
    },

    onLoadMore() {
      let that = this;
      this.params.page = +this.pager.cur_page + 1;
      this.getPostList(this.params);
    },

    goPostDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'reply-item', 'scroll-wrapper');
       
      if (!obj) return;

      let id = obj.dataset && obj.dataset.id 
      
      if(!id) return;

      let url = '/postdetail/' + id
      this.$router.push(url)
    },

    init() {
      let that = this;
      
      this.params = {
        version: 4,
        module: 'mythread',
        type: 'reply',
        page: 1,
      }
      
      if (!Validate.checkLogin()) {
        Validate.getLoginInfo(function(result) {
          if (result.isLogined === 1) {
            that.getPostList(this.params)
          } else {
            that.$router.push('/main');
            setTimeout(function() {
              Toast('请登录！');
            }, 1000);
          }
        })
      } else {
        that.getPostList(this.params)
      }

      // 重置状态
      that.myReplyList = [];
      that.tipsConfig.noData = false;
      that.$refs.list && that.$refs.list.myScroll.scrollTo(0, 0, 0);
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      //不是从帖子详情跳转回来，或者回来没有数据
      if(from && from.name !== 'postdetail' || !vm.hasData) { 
        vm.init();
      } else {
        vm.$refs.list && vm.$refs.list.refresh();
      }
    })
  }

}
</script>

<style lang="scss" scoped>
@import "../sass/myreply.scss";

   </style>

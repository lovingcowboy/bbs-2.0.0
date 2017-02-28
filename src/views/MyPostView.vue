<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的帖子'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
       <list :config.once="scrollConfig" @loadmore="onLoadMore();" ref="list" >
          <div class="scroll-wrapper" slot="scrollContent"  @tap="goPostDetail($event)">
            <div class="post-item" v-for="(item, index) in myPostList" :data-id="item.tid">
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
import {uniq} from '../filters'
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
      myPostList: [],
      tipsConfig: {
        noData: false,
        text: '您还没有发表过帖子哦！'
      }
    }
  },
  methods: {
    getPostList(params) { //获取帖子列表
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

          that.myPostList = uniq.call(that, that.myPostList.concat(data.list), 'tid');  //去重

          that.tipsConfig.noData = that.myPostList.length == 0;  //是否显示空数据状态

          //记录页数信息
          that.pager = data.pager;

          if(!that.$refs.list) return;

          // 判断是否有加载更多
          that.$refs.list.loadmore = +that.pager.cur_page < +that.pager.total_page;

          that.$refs.list.refresh();
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });

          that.$refs.list && that.$refs.list.refresh();
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });
        
          that.$refs.list && that.$refs.list.refresh();
      })
    },

    onLoadMore() {
      let that = this;
      this.params.page = +this.pager.cur_page + 1;
      this.getPostList(this.params);
    },
    goPostDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'post-item', 'scroll-wrapper');
       
      if (!obj) return;

      let id = obj.dataset && obj.dataset.id 
      
      if(!id) return;

      let url = '/postdetail/' + id
      this.$router.push(url)
    },

    init() {
      let that = this;

      that.params = {
        version: 4,
        module: 'mythread',
        type:'thread',
        page:  1,

      }

      if (!Validate.checkLogin()) {
        Validate.getLoginInfo(function(result) {
          if (result.isLogined === 1) {
            that.getPostList(that.params) 
          } else {
            that.$router.push('/main');
            setTimeout(function() {
              Toast('请登录！');
            }, 1000);
          }

        })
      } else {
        that.getPostList(that.params) 
      } 
      // 重置状态
      that.myPostList = [];
      that.tipsConfig.noData = false;
      that.$refs.list && that.$refs.list.myScroll.scrollTo(0, 0, 0);
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(from && from.name !== 'postdetail') {  //不是从帖子详情跳转回来
        vm.init();
      }
    })
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mypost.scss";


</style>

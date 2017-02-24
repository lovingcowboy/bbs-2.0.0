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
       <list :config.once="scrollConfig" @init="onInitList();"  @loadmore="onLoadMore();" ref="list" >
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
      myPostList: []
    
    }
  },
  methods: {
    getPostList(params) { //获取帖子列表
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

         /* if(params.page == 1) { //刷新或者第一次加载数据
            that.myPostList = data.list;
          } else if(params.page > 1) { //加载更多数据*/
            that.myPostList = that.myPostList.concat(data.list);
          // }


          //记录页数信息
          that.pager = data.pager;

          if(!that.$refs.list) return;

          if(that.myPostList.length == 0) { //无数据
            that.$refs.list.onNoData();
          } 

          // 判断是否有加载更多
          that.$refs.list.loadmore = Number(that.pager.cur_page) < Number(that.pager.total_page);

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

    onInitList(scroller) {
      this.outerScroller = scroller;
    },


    onLoadMore() {
      let that = this;
      this.params.page = Number(this.pager.cur_page) + 1;
      this.getPostList(this.params);
    },
    goPostDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'post-item', 'scroll-wrapper');
       
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
      type:'thread',
      page:  1,

    }
    // this.getPostList(this.params)
    let that = this;
    let uid = Util.getSessionStorage('uid');
    let isLogined_cookie = Validate.getCookie('voHF_b718_auth');
    if (!uid && !isLogined_cookie) {
      Validate.getLoginInfo(function(result) {
        // console.info('result---', result)
        if (result.isLogined === 1) {
          that.getPostList(that.params) 
        } else {
          that.$router.push('/main');
        }

      })
    } else {
      that.getPostList(that.params) 
    } 
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mypost.scss";


</style>

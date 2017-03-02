<template>
  <div class="mycollection-view">
    <zheader 
      :header-title="'我的收藏'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
      <list :config.once="scrollConfig" @loadmore="onLoadMore();" ref="list" >
        <div class="scroll-wrapper post-list" slot="scrollContent" @tap="listClickFunc($evnet);">
          <post-item v-for="(item, index) in collectionList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.authorid" class="c-event">
                <img :src="item.avatar"><font>{{item.author}}</font>
              </span>
              <span v-html="item.dateline"></span>
            </div>
          </post-item>
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
import List from 'components/listview'
// import Util from '../js/Util.js'
import Validate from '../js/lib/validate.js'
import PostItem from '../components/PostItem.vue'
import {uniq} from '../filters'
import Tips from '../components/Tips.vue'
export default {
  components: {
    Zheader,
    Toast,
    List,
    PostItem,
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
      collectionList: [],
      tipsConfig: {
        noData: false,
        text: '您还没有收藏过帖子哦！'
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

          that.collectionList = uniq.call(that, that.collectionList.concat(data.list), 'tid');  //去重
          //记录页数信息
          that.pager = data.pager;

          that.tipsConfig.noData = that.collectionList.length == 0;  //是否显示空数据状态

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

    listClickFunc(e) {
      let obj = Util.getElemetByTarget(e.target, 'c-event', 'post-list')
       
      if (!obj) return
      let type = obj.dataset.type
      let id = obj.dataset.id
      if (!type) return;
      if (type === 'userclick') {
        this.goUserCenter(id)
      } else if (type === 'itemclick') {
        this.goDetail(id)
      }
    },

    goUserCenter(id) {
      var url = '/centerother/' + id
      this.$router.push(url)
    },

    goDetail(id) {
      var url = '/postdetail/' + id
      this.$router.push(url)
    },

    init() {
      let that = this;
      
      that.params = {
        version: 4,
        module: 'myfavthread',
        page:  1,

      }
      
      if (!Validate.checkLogin()) {
        Validate.getLoginInfo(function(result) {
          // console.info('result---', result)
          if (result.isLogined === 1) {
            that.getPostList(that.params);
          } else {
            that.$router.push('/main');
            setTimeout(function() {
              Toast('请登录！');
            }, 1000);
          }

        })
      } else {
        that.getPostList(that.params);
      }
      // 重置状态
      that.collectionList = [];
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
@import "../sass/mycollection.scss";


</style>

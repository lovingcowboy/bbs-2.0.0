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
        <list :config.once="scrollConfig" @init="onInitList" @refresh="onRefreshList();" @loadmore="onLoadMore();" ref="list">
          <div class="scroll-wrapper" slot="scrollContent" @tap="goPostDetail($event);">
            <div class="content-header">
              <div class="session-name">{{session}}</div>
              <div class="btn-wrapper" @tap="onSwitchAllList($event);">
                <div class="btn btn-all" :class="{'active': isListAllActive}">全部</div>
                <div class="btn btn-essence" :class="{'active': !isListAllActive}">精华</div>
              </div>
            </div>
            <div class="list-all" v-show="isListAllActive">
              <div class="list-top" v-show="uiShowTop">
                <div class="top-item post-row" v-for="(item, index) in topList" :data-id="item.tid">
                  <font class="top-label">置顶</font><font class="post-title">{{item.subject}}</font>
                </div>
              </div>
              <div class="btn-wrapper sticky-header" @tap="onSwitchList($event);" :style="{visibility: showFloat == true ? 'hidden' : 'visible'}">
                <div class="btn-newpost" :class="{'active': isListNewpostActive}">最新发表</div>
                <div class="btn-newreply" :class="{'active': !isListNewpostActive}">最新回复</div>
              </div>
              <ul class=" post-list list-newpost" v-show="isListNewpostActive">
                <post-item v-for="(item, index) in newPostList" :data="item">
                  <div class="item-title" slot="itemhead">
                    <span data-type="userclick" :data-id="item.tid">
                      <img :src="item.avatar"><font>{{item.author}}</font>
                      <label class="level">LV{{item.group_level}} {{item.group_title}}</label>
                    </span>
                    <span v-html="item.dateline"></span>
                  </div>
                </post-item>
              </ul>

              <ul class="list-newreply post-list" v-show="!isListNewpostActive">
                <post-item v-for="(item, index) in newReplyList" :data="item">
                  <div class="item-title" slot="itemhead">
                    <span data-type="userclick" :data-id="item.tid">
                      <img :src="item.avatar"><font>{{item.author}}</font>
                      <label class="level">LV{{item.group_level}} {{item.group_title}}</label>
                    </span>
                    <span v-html="item.dateline"></span>
                  </div>
                </post-item>
              </ul>
            </div>
            <ul class="list-essence post-list" v-show="!isListAllActive">
              <post-item v-for="(item, index) in essenceList" :data="item">
              <div class="item-title" slot="itemhead">
                <span data-type="userclick" :data-id="item.tid" >
                  <img :src="item.avatar"><font>{{item.author}}</font>
                  <label class="level">LV{{item.group_level}}  {{item.group_title}}</label>
                </span>
                <span v-html="item.dateline"></span>
              </div>
            </post-item>
            </ul>
          </div>
        </list>    
        
        <div class="btn-wrapper sticky-header sticky" :style="{visibility: showFloat == true ? 'visible' : 'hidden'}" @click="onSwitchList($event);">
            <div class="btn-newpost" :class="{'active': isListNewpostActive}">最新发表</div>
            <div class="btn-newreply" :class="{'active': !isListNewpostActive}">最新回复</div>
        </div>
      </div>
    </div>
    <i class="post-add" @click="goPost();"></i>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
import List from "components/listview"
import Services from '../services'
import {uniq} from '../filters';
import Tips from '../components/Tips.vue'
import Validate from '../js/lib/validate.js'
export default {
  components: {
    Zheader,
    Toast,
    PostItem,
    List,
    Tips
  },
  data () {
    return {
      isScrollActive: true,
      session: '',
      showFloat: false,
      isListAllActive: true,
      isListNewpostActive: true,
      topList: [],
      newPostList: [],
      newReplyList: [],
      essenceList: [],
      newPostPager: null, //记录页数信息
      newReplyPager: null,  //记录页数信息
      essencePager: null, //记录页数信息
      scrollConfig: {
        wrapper: 'sessionWrapper',
        mutationObserver: true,
        refresh: true,
        loadmore: true
      },
      newPostTipsConfig: {
        noData: false,
        text: '这里空空如也'
      },
      newReplyTipsConfig: {
        noData: false,
        text: '这里空空如也'
      },
      essenceTipsConfig: {
        noData: false,
        text: '这里空空如也'
      },
      hasData: false
    }
  },
  computed: {
    uiShowTop: function() {
      return this.topList.length !== 0
    }
  },
  methods: {
    getPostList(params, type, isRefresh) { //获取帖子列表 type为帖子类型
      let that = this;
  
      let pager = null; //记录页面对象
      let postList = null;  //帖子列表
      Services.postData('/app/index.php', params).then((response) => {
        
        let _body = response.body;
        if (_body.code === '200') {
          let data = _body.data;
          
          that.hasData = true;  //有数据的标识

          that.session = data.forum.name;
          //记录页数信息
          pager = data.pager;
          if(+pager.cur_page > +pager.total_page) { //超过页叔
            return false; 
          }

          // 获取置顶
          if(type !== 'essence') {  //不包括精华中的置顶
            let i = 0; let length = data.list.length;
            let topList = []; 
            for(; i < length; i++) {
              if(data.list[i].is_top == 1) {
                topList.push(data.list[i]);
              }
            }
            that.topList = uniq.call(that, that.topList.concat(topList), 'tid');  //去重
          }

          switch(type) {
            case 'newPost':
              postList = that.newPostList;
              break;
            case 'newReply':
              postList = that.newReplyList;
              break;
            case 'essence':
              postList = that.essenceList;
              break;
          }
          // 刷新数据
          if(isRefresh == true) postList = [];

          postList =  postList.concat(data.list);
          
          switch(type) {
            case 'newPost':
              that.newPostList = uniq.call(that, postList, 'tid'); //去重
              that.newPostPager = pager;
              that.newPostTipsConfig.noData = that.newPostList.length == 0;  //是否显示空数据状态
              break;
            case 'newReply':
              that.newReplyList = uniq.call(that, postList, 'tid'); //去重;
              that.newReplyPager = pager;
              that.newReplyTipsConfig.noData = that.newReplyList.length == 0;  //是否显示空数据状态
              break;
            case 'essence':
              that.essenceList = uniq.call(that, postList, 'tid'); //去重;
              that.essencePager = pager;
              that.essenceTipsConfig.noData = that.essenceList.length == 0;  //是否显示空数据状态
              break;
          }
          
          if(!that.$refs.list) return;

          // 判断是否有加载更多
          that.$refs.list.loadmore = +pager.cur_page < +pager.total_page; 

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

    onSwitchAllList(e) { //切换全部、精华列表
      let that = this;
      let target = e.target;
      let prevClass = target._prevClass;
      let pager = null;
      if(prevClass.indexOf('btn-essence') !== -1) { //精华列表
        that.isListAllActive = false;
        pager = that.essencePager;
        if(that.essenceList.length == 0) {
          that.getPostList(that.essenceParams, 'essence');  //获取最新列表
        }
      } else if(prevClass.indexOf('btn-all') !== -1) {  //全部
        that.isListAllActive = true;
        pager = that.isListNewpostActive ? that.newPostPager : that.newReplyPager;
      }
      
      if(!that.$refs.list || !pager) return;
       // 判断是否有加载更多
      that.$refs.list.loadmore = +pager.cur_page < +pager.total_page; 

      that.$refs.list.refresh();
    },

    onSwitchList(e) {  //切换最新发表跟最新回复
      let target = e.target;
      let prevClass = target._prevClass;
      let that = this;
      
      //没点到按钮
      if(!(prevClass.indexOf('btn-newpost') !== -1 || prevClass.indexOf('btn-newreply') !== -1 )) { 
        return;
      }

      if(that.showFloat) {  //置顶时
        if(!that.isListNewpostActive) { //因为isListNewpostActive延迟切换，所以为切换前逻辑
          that.newPostY = that.newPostY > -that.switchListSt ? -that.switchListSt : that.newPostY;
        } else {
          that.newReplyY = that.newReplyY > -that.switchListSt ? -that.switchListSt : that.newReplyY;
        }
      } else { //当没置顶时
        that.newPostY = that.newReplyY = that.outerIScroll.y;
      }
      
      let time = 0;
      let pager = null;
      setTimeout(function() { //延迟切换isListNewpostActive
        if(prevClass.indexOf('btn-newpost') !== -1) { //最新发表
          if(that.isListNewpostActive && that.showFloat) {  //如果已经在最新发表则回到最新发表头部
            that.newPostY = -that.switchListSt;
            time = 800;
          }

          that.isListNewpostActive = true;
          pager = that.newPostPager;
          setTimeout(function() {
            if(that.outerIScroll) { //刷新iscroll，并滑动到记录位置
              that.outerIScroll.refresh();
              if(!that.isScrolling) {
                that.outerIScroll.scrollTo(0, that.newPostY, time);
              }
            }
          }, 200)

        } else if(prevClass.indexOf('btn-newreply') !== -1) { //最新回复
          if(!that.isListNewpostActive && that.showFloat) {  //如果已经在最新发表则回到最新发表头部
            that.newReplyY = -that.switchListSt;
            time = 800;
          }
          
          that.isListNewpostActive = false;
          pager = that.newReplyPager;

          if(that.newReplyList.length == 0) {
            that.getPostList(that.newReplyParams, 'newReply');  //获取最新回复列表
          }

          setTimeout(function() {
            if(that.outerIScroll) { //刷新iscroll，并滑动到记录位置
              that.outerIScroll.refresh();
              if(!that.isScrolling) {
                that.outerIScroll.scrollTo(0, that.newReplyY, time);
              }
            }
          }, 200)
        }

        if(!that.$refs.list || !pager) return;
         // 判断是否有加载更多
        that.$refs.list.loadmore = +pager.cur_page < +pager.total_page; 

        that.$refs.list.refresh();
      }, 10)
    },

    onInitList(scroller) {
      let  that = this;
      that.outerIScroll = scroller;
      let listTopEl = document.querySelector('.list-top');
      // let listTopH = Util.pxToRemAdapt(that.listTopEl ? that.listTopEl.clientHeight : 0);
      // 计算最新发表、最新回复的位置 换算成rem 92为内容header高度 20为间距 
      // that.switchListSt =  Util.remToPx(listTopH + Util.pxToRem(92 + 20 + 20));
      that.switchListSt = [];
      // 置顶的y轴位置   
      this.topY = that.switchListSt + Util.pxToRemAdapt(document.querySelector('.sticky-header').clientHeight);
      // 保存最新发表跟最新回复的位置
      this.newPostY = this.newReplyY = -that.switchListSt;

      that.outerIScroll.on('scroll', function() {
        let listTopH = Util.pxToRemAdapt(listTopEl ? listTopEl.clientHeight : 0);
        // 计算最新发表、最新回复的位置 换算成rem 92为内容header高度 20为间距 
        that.switchListSt =  Util.remToPx(listTopH + Util.pxToRem(92 + 20));
        // debugger
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

    onRefreshList() { //刷新数据
      let that = this;
      
      let type = "";
      let params = null;
      if(that.isListAllActive) {
        if(that.isListNewpostActive) {
          type = 'newPost';
          params = that.newPostParams;
        } else {
          type = 'newReply';
          params = that.newReplyParams;
        }
      } else {
        type = 'essence';
        params = that.essenceParams;
      }

      params.page = 1;

      // 刷新当前版块数据
      that.getPostList(params, type, true);
    },

    onLoadMore() { //加载更多数据
      let that = this;
      
      
      let type = '';
      let params = null;
      let pager = null;
      if(that.isListAllActive) {
        if(that.isListNewpostActive) {
          type = 'newPost';
          params = that.newPostParams;
          pager = that.newPostPager;
        } else {
          type = 'newReply';
          params = that.newReplyParams;
          pager = that.newReplyPager;
        }
      } else {
        type = 'essence';
        params = that.essenceParams;
        pager = that.essencePager;
      }

      params.page = +pager.cur_page + 1;;

      // 加载更多当前版块数据
      that.getPostList(params, type);
    },

    goPostDetail(e) { //帖子详情
      let obj = Util.getElemetByTarget(e.target, 'post-row', 'scroll-wrapper');

      if (!obj) return;

      let id = obj.dataset && obj.dataset.id; 
      
      if(!id) return;

      let url = '/postdetail/' + id
      this.$router.push(url)
    },
    
    goPost() {  //跳转到发表帖子
      if(!Validate.checkLogin()) {
        Validate.openLogin()
      } else {
        this.$router.push('/post')
      }
    },

    init() {
      let that = this

      that.newPostParams = { //最新发表列表参数
        version: 4,
        module: 'forumdisplay',
        fid: that.$route.params.fid,
        filter: 'author',
        orderby: "dateline",
        page: 1
      };

      that.newReplyParams = { //最新回复列表参数
        version: 4,
        module: 'forumdisplay',
        fid: that.$route.params.fid,
        filter: 'lastpost',
        orderby: 'lastpost',
        page: 1
      };

      that.essenceParams = { //精华列表参数
        version: 4,
        module: 'forumdisplay',
        fid: that.$route.params.fid,
        filter: 'digest',
        digest: 1,
        page: 1
      };
      // 获取版块最新发表
      that.getPostList(that.newPostParams, "newPost");

      // 重置状态
      that.showFloat = false;
      that.isListAllActive = true;
      that.isListNewpostActive = true;
      that.topList = [];
      that.newPostList = [];
      that.newReplyList = [];
      that.essenceList = [];
      that.newPostTipsConfig.noData = false;
      that.newReplyTipsConfig.noData = false;
      that.essenceTipsConfig.noData = false;
      that.$refs.list && that.$refs.list.myScroll.scrollTo(0, 0, 0);
      
      // 获取登录状态
      Validate.checkLogin() || Validate.getLoginInfo();
    }
  },
  
  beforeRouteEnter (to, from, next) {
    next(vm => {
      //不是从帖子详情跳转回来，或者回来没有数据
      if(from && from.name !== 'postdetail' || !vm.hasData) { 
        vm.init();
      } 
    })
  }
  
  
}
</script>

<style lang="scss" scoped>
@import "../sass/sessionlist.scss";


</style>

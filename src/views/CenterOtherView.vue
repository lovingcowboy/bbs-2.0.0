<template>
  <div class="center-my-view">
    <zheader 
      :header-title="'个人中心'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
      <div class="content">
        <list :config.once="scrollConfig" @loadmore="onLoadMore();" ref="list" >
          <div class="scroll-wrapper" slot="scrollContent">
            <div class="contetn-header">
              <div class="md01">
                <img class="avatar" :src="userInfo.avatar">
                <div class="userInfo-right">
                  <div class="username">{{userInfo.username}}</div>
                  <div class="other-baseinfo">
                    <div class="row01 baseinfo-row">
                      <div class="post">{{userInfo.threads}}</div>
                      <div class="label">TA的主题</div>
                    </div>
                    <div class="row02 baseinfo-row">
                      <div class="reply">{{userInfo.posts}}</div>
                      <div class="label">TA的回帖</div> 
                    </div>
                    <div class="row03 baseinfo-row">
                      <div class="friends">{{userInfo.friends}}</div>
                      <div class="label">TA的好友</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="level-wrapper">
                <span class="icon-star"></span>
                <div class="level-name">{{userInfo.level_text}}</div>
              </div>
              <div class="md02">
                <div class="integral">
                  <span class="icon-integral"></span>
                  <font>{{userInfo.credits}}积分</font>
                </div>
                <div class="prestige">
                  <span class="icon-prize"></span>
                  <font>{{userInfo.extcredits}}威望</font>
                </div>
                <div class="btn-message" @tap="onSendMsg();">发消息</div>
              </div>
            </div>
            <div class="dynamic" :style="{'min-height': dyListMinHeight + 'rem'}">
              <div class="label">TA的动态</div>
               <ul class="post-list" @tap="goPostDetail($event);">
                <post-item v-for="(item, index) in dynamicList" :data="item" >
                  <div class="item-title" slot="itemhead">
                    <span data-type="userclick" :data-id="item.tid" class="c-event">
                      <img src="../images/pai.png"><font class="author">{{item.author}}</font>{{item.type == "0" ? '回复了帖子' : '发布了帖子'}}
                    </span>
                    <span>{{item.dateline}}</span>
                  </div>
                </post-item>
              </ul>
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
import PostItem from '../components/PostItem.vue'
import Services from '../services'
import List from 'components/listview'
// import Util from '../js/Util.js'
export default {
  components: {
    Zheader,
    Toast,
    List,
    PostItem
  },
  data () {
    return {
      isScrollActive: true,
      scrollConfig: {
        wrapper: 'outerWrapper',
        mutationObserver: true,
        refresh: false,
        loadmore: true
      },
      userInfo: {},
      dynamicList: [],
      dyListMinHeight: 0
    }
  },
  methods: {
    getUserInfo(params) { //获得用户基本信息
      let that = this;

      params.dotype = 'profile';
      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          // console.log(data);
          that.userInfo = data.info;
          let manageforum = data.info.manageforum;

          if(manageforum.status == '1') {  //是版块版本
            let forumList = Object.values(manageforum.forumlist);
            let text = "";
           
            if(forumList.length == 1) {
              text = forumList[0] + '版块的版主';
            } else if(forumList.length > 1) {
              text = forumList[0] + '、' + forumList[1] + '等' +forumList.length + '个版块的版主';
            }
            that.userInfo.level_text = text;
          } else {  //没有版块
            that.userInfo.level_text = 'Lv.' + data.info.grouplevel + ' ' + data.info.grouptitle;
          }

           that.getDynamicList(params);  //获取TA的动态
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });
          // console.log("fail")
      })
    },

    getDynamicList(params) {  //获取TA的动态
      let that = this;

      params.dotype = "thread";
      params.notLoader = true;  //不显示loading
      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          // debugger
          if(params.page == 1) { //刷新或者第一次加载数据
            that.dynamicList = data.list;
          } else if(params.page > 1) { //加载更多数据
            that.dynamicList = that.dynamicList.concat(data.list);
          }

          that.pager = data.pager;
          
          if(!that.$refs.list) return;
          
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
    uiSetListMinHeight() {
      let bodyHeight = Util.getElHeight('body');  //获取最大可视高度
      let headerHeight = Util.getElHeight('.contetn-header');  //获取头部高度
      // debugger
      this.dyListMinHeight = Util.pxToRemAdapt(bodyHeight) -
        (Util.pxToRemAdapt(headerHeight) + Util.pxToRem(20));
    },


    onLoadMore() {  //加载更多
      let that = this;
      this.params.page = Number(this.pager.cur_page) + 1;
      this.getDynamicList(this.params);
    },

    goPostDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'c-event', 'post-list')
       
      if (!obj) return
      let type = obj.dataset.type
      let id = obj.dataset.id
      if (!type) return;


      var url = '/postdetail/' + id
      this.$router.push(url)

    
    },
   
    onSendMsg() { //发送消息 
      let url = '/user/messagedetail/' + this.$route.params.id
      this.$router.push(url)
    },
    
  },
  beforeMount () {
    this.params = {
      version: 4,
      module: 'memberother',
      uid: this.$route.params.id,
      page: 1
    }
    this.getUserInfo(this.params);  //获取用户信息
   
  },
  mounted () {
    this.uiSetListMinHeight();
    
    //当横屏时 重新计算最小高度 
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, this.uiSetListMinHeight, false);
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/centerother.scss";

</style>

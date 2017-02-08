<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的消息'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class='{"scroll-active": isScrollActive}'>   
      <div class="content">
        <div class="tab">
          <div class="tab-item btn-personmsg" :class='{"active": isShowProsonMsg}'  @click='onSwitchMsgList'><font>个人消息</font><span class="message-num" v-show='newpm == "0" ? false : true'>{{newpm}}</span></div>
          <div class="tab-item btn-systemmsg" :class='{"active": !isShowProsonMsg}' @click='onSwitchMsgList'><font>系统消息</font><span class="message-num" v-show='newsystem == "0" ? false : true'>{{newsystem}}</span></div>
        </div>
        <div class="message-list-wrapper" :style="{'height': msgListMinHeight + 'rem'}">
          <list :config.once='personScrollConfig'  @refresh='onRefreshList' @loadmore='onLoadMore' ref='personlist' v-show='isShowProsonMsg'>
            <div class="scroll-wrapper" slot="scrollContent"  @tap='goMessageDetail'>
              <div class="message-person-list" >
                <div class="message-person-item" v-for='(item, index) in personList' :data-id='item.touid'>
                  <div class="left">
                    <img class="avatar" :src='item.avatar' />
                    <span class="point-new" v-show='item.isnew == "1" ? true : false'></span>
                  </div>
                  <div class="right">
                    <div class="username">{{item.tonickname}}</div>
                    <div class="msg-date">{{item.vdateline}}</div>
                    <div class="msg-body">{{item.message}}</div>
                  </div>
                </div>
              </div>
            </div>
          </list> 

          <list :config.once='systemScrollConfig'  @refresh='onRefreshList' @loadmore='onLoadMore' ref='systemlist'  v-show='!isShowProsonMsg'>
            <div class="scroll-wrapper" slot="scrollContent">
            <div class="message-system-list">
              <div class="message-system-item" :class='{"isNew": item.new == "1" ? true : false}' v-for='(item, index) in systemList'>
                  <div class="point-new"></div>
                  <div class="message-content">
                    <div class="msg-body">{{item.note}}</div>
                    <div class="time-wrapper">
                      <div class="msg-date">{{item.dateline}}</div>
                      <!-- <div class="msg-time">10:20</div> -->
                    </div>
                  </div>
              </div>
            </div>
            </div>
          </list>
        </div>
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
      msgListMinHeight: 0,
      isShowProsonMsg: true,
      personScrollConfig: {
        wrapper: 'personMsgWrapper',
        mutationObserver: true,
        refresh: true,
        loadmore: true
      },
      systemScrollConfig: {
        wrapper: 'systemMsgWrapper',
        mutationObserver: true,
        refresh: true,
        loadmore: true
      },
      personList: [],
      systemList: [],
      newpm: 0,
      newsystem: 0,
      fisrtShowSysMsg: true
    }
  },
  methods: {
    uiSetListMinHeight() {
      let bodyHeight = Util.getElHeight("body");  //获取最大可视高度
      let headerHeight = Util.getElHeight("#header");  //获取头部高度
      let tabHeight = Util.getElHeight(".tab");  //获取tab高度

      this.msgListMinHeight = Util.pxToRemAdapt(bodyHeight) -
        (Util.pxToRemAdapt(headerHeight + tabHeight) + Util.pxToRem(20));
    },
    onSwitchMsgList(e) { //切换消息类型 
      let target = e.currentTarget;
      let prevClass = target._prevClass;
      let that = this;
      
      if(that.fisrtShowSysMsg && that.isShowProsonMsg) {  //首次加载系统消息
        that.isShowProsonMsg = false;
        that.fisrtShowSysMsg = false;
        that.getSystemList(that.systemParam);
        return;
      }

      if(prevClass.indexOf("btn-personmsg") !== -1) { //个人消息
          if(that.isShowProsonMsg) {  //如果已经在个人消息 则回到个人消息头部
            setTimeout(function() {
              if(that.outerIScroll) { //刷新iscroll，并滑动到记录位置
                that.outerIScroll.refresh();
                if(!that.isScrolling) {
                  that.outerIScroll.scrollTo(0, 0, 800);
                }
              }
            }, 200)
          } else {
            that.isShowProsonMsg = true;
          }
        } else if(prevClass.indexOf("btn-systemmsg") !== -1) { //系统消息
          if(!that.isShowProsonMsg) {  //如果已经在系统消息 则回到系统消息头部
            that.systemListY = 0;
            setTimeout(function() {
              if(that.outerIScroll) { //刷新iscroll，并滑动到记录位置
                that.outerIScroll.refresh();
                if(!that.isScrolling) {
                  that.outerIScroll.scrollTo(0, 0, 800);
                }
              }
            }, 200)
          } else {
            that.isShowProsonMsg = false;
          }
        }
    },
    getPersonList(param) { //获取个人消息
      let that = this;

      Services.postData('/app/index.php', param).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data;
          // 记录个人消息未读数
          that.newpm = data.newpm;
          // 记录系统消息未读数
          that.newsystem = data.newsystem; 

          if(param.page == 1) { //刷新或者第一次加载数据
            that.personList = data.list;
            // that.$refs.list.refreshDone();
          } else if(param.page > 1) { //加载更多数据
            that.personList = that.personList.concat(data.list);
          }
          /*for (let i = 0; i < 10; i++) {
            let item = {
              avatar: '12312sda.png',
              isnew: '0',
              tonickname:'萱萱宝贝',
              vdateline: '05-30',
              message: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
              plid: i
            }
            that.personList.push(item)
          }*/
          //记录页数信息
          that.personPager = data.pager;
          if(that.$refs.personlist) {
            if(that.personList.length == 0) { //无数据
              // that.$refs.list.onNoData();
            } else {  //刷新list
              // 判断是否有加载更多
              if(Number(that.personPager.cur_page) < Number(that.personPager.total_page)) {
                that.$refs.personlist.loadmore = true; //有加载更多
              } else {
                that.$refs.personlist.loadmore = false; //有加载更多
                if(Number(that.personPager.cur_page) > 1) {
                  Toast({
                    "message": "已全部加载完毕"
                  })
                }
              }
            }

            that.$refs.personlist.refresh();
          }
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
          that.$refs.personlist.refresh();
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
          that.$refs.personlist.refresh();
      })
    },
      
    getSystemList(param) {  //获取系统消息
      let that = this;

      Services.postData('/app/index.php', param).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

          if(param.page == 1) { //刷新或者第一次加载数据
            that.systemList = data.list;
          } else if(param.page > 1) { //加载更多数据
            that.systemList = that.systemList.concat(data.list);
          }

          //记录页数信息
          that.systemPager = data.pager;
          if(that.$refs.systemlist) {
            if(that.systemList.length == 0) { //无数据
              // that.$refs.list.onNoData();
            } else {  //刷新list
               // 判断是否有加载更多
              if(Number(that.systemPager.cur_page) < Number(that.systemPager.total_page)) {
                that.$refs.systemlist.loadmore = true; //有加载更多
              } else {
                that.$refs.systemlist.loadmore = false; //有加载更多
                if(Number(that.systemPager.cur_page) > 1) {
                  Toast({
                    "message": "已全部加载完毕"
                  })
                }
              }
            }

            that.$refs.systemlist.refresh();
          }
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });

          that.$refs.systemlist.refresh();
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });

          that.$refs.systemlist.refresh();
      })
    },

    onRefreshList() {   // 刷新数据
      if(this.isShowProsonMsg) { //个人消息
        this.personParam.page  = 1;
        this.getPersonList(this.personParam);  
      } else {
        this.systemParam.page = 1;
        this.getSystemList(this.systemParam);
      }
    },

    onLoadMore() {
      if(this.isShowProsonMsg) { //个人消息
        this.personParam.page  =  Number(this.personPager.cur_page) + 1;;
        this.getPersonList(this.personParam);  
      } else {
        this.systemParam.page  =  Number(this.systemPager.cur_page) + 1;;
        this.getSystemList(this.systemParam);
      }
    },
    goMessageDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'message-person-item', 'scroll-wrapper');
       
      if (!obj) return;

      let id = obj.dataset && obj.dataset.id 
      
      if(!id) return;

      let url = '/user/messagedetail/' + id

      this.$router.push(url)
    }
  },
  mounted() {
    let that = this;
    this.uiSetListMinHeight();

    //当横屏时 重新计算最小高度 
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, this.uiSetListMinHeight, false);
  },
  beforeMount () {
    this.personParam = {
      version: 4,
      module: 'mypm',
      page:  1,

    }

    this.systemParam = {
      version: 4,
      module: 'system_notice',
      page:  1,

    }
    this.getPersonList(this.personParam)  
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mymessage.scss";


</style>

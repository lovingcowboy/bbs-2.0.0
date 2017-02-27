<template>
  <div class="messagedetail-view">
    <zheader 
      :header-title="tonickname" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}"> 
      <div class="content">
        <msglist :config.once="scrollConfig" @loadmore="onLoadMore();" ref="msglist" >
          <div class="scroll-wrapper dialog-list" slot="scrollContent">
            <div class="dialog-item" v-for="(item, index) in messageList" :data-id="item.tid" :class="item.isself == '1' ? 'right' : 'left'">
              <img class="avatar" :src="item.avatar" />
              <div class="message-body">{{item.message}}</div>
            </div>
          </div>
        </msglist> 
      </div>
    </div>
    <div class="btn-message" @click="onMessage();">发消息</div>
    <div class="message-dialog" v-show="isShowDialog">
      <div class="masker" v-show="isShowDialog"></div>
      <div class="dialog-content">
        <div class="dialog-title">回复</div>
        <textarea class="reply-content" placeholder="请输入…" v-model="messageData"></textarea>
        <div class="btn-wrapper">
          <div class="btn-cancel" @click="onCancel();">取消</div>
          <div class="btn-send" :class="{'disable': isBtnDisable}" @click="onSend();">发送</div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Services from '../services'
import Msglist from 'components/msglistview'
// import Util from '../js/Util.js'
import Validate from '../js/lib/validate.js'
import {uniq} from '../filters'
export default {
  components: {
    Zheader,
    Toast,
    Msglist
  },
  data () {
    return {
      tonickname:"",
      isShowDialog: false,
      isScrollActive: true,
      messageList: [],
      scrollConfig: {
        wrapper: 'msgWrapper',
        mutationObserver: true,
        loadmore: true
      },
      firstPageMsg: [],  //第一页的消息数据,
      messageData: "",
      selfInfo: {}
    }
  },
  computed: {
    isBtnDisable: function() {
      return this.messageData == '';
    }
  },
  methods: {
    getMessageDetail(params) {
      let that = this;
      let isRefresh = false;  //是否刷新list
      Services.postData('/app/index.php', params).then((response) => {
        that.onSetInterval(); //每隔30s拉取一次数据
        
        let _body = response.body;
        that.formhash = _body.data.formhash; //发送消息验证使用
        if (_body.code === '200') {
          let data = _body.data;
          if(+data.pager.cur_page > +data.pager.total_page) { //超过页叔
            return false; 
          }
          //记录页数信息，每隔30s拉取数据的页数不记录
          if(!params.notLoader) 
            that.pager = data.pager;

          that.tonickname = data.tonickname[0];

          if(data.pager.total_page == data.pager.cur_page) { //刷新或者第一次加载数据
            // 记录第一页数据
             if(that.firstPageMsg.length == 0 || that.firstPageMsg.length !== data.list.length) {  
              that.firstPageMsg = data.list;
              that.messageList = that.messageList.concat(data.list);
              isRefresh = true;
            } 
          } else {
             that.messageList =  data.list.concat(that.messageList);
             isRefresh = true;
          }
          that.messageList = uniq.call(that, that.messageList, 'pmid');  //去重

          if(!that.$refs.msglist) return;

          // 判断是否有加载更多
          that.$refs.msglist.loadmore = +that.pager.cur_page - 1 >= +that.pager.next;
             
          let isScrollToEnd = +that.pager.cur_page == +that.pager.total_page ? true : false; //在首次加载则滑动到底部
          if(isRefresh)  //没拉取数据时，不刷新数据
            that.$refs.msglist.refresh(isScrollToEnd);

        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
          
          that.$refs.msglist && that.$refs.msglist.refresh();
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });

          that.$refs.msglist && that.$refs.msglist.refresh();
      })
    },
    onMessage() { //填写消息
      this.isShowDialog = true;
      this.isScrollActive = false;
    },
    onCancel() {
      this.messageData = '';  //清空输入框内容
      this.isShowDialog = false;
      this.isScrollActive = true;
    },
    onSend() {  //发送消息
      let that = this;
      if(that.isBtnDisable) {  //置灰无法提交
        return;
      }

      let params = {
        version: 4,
        module: 'sendpm',
        message: that.messageData,
        uid: that.$route.params.id,
        pmsubmit: 'yes',
        formhash: that.formhash
      }

      Services.postData('/app/index.php', params).then((response) => {

        let _body = response.body

        if (_body.code === '200') {
          let data = _body.data
           
          that.isShowDialog = false;
          that.isScrollActive = true;
          
          // 将消息存入消息列表
          that.selfInfo.message = that.messageData;
          that.selfInfo.pmid = data.list.pmid;
          that.selfInfo.avatar = data.list.member_avatar;
          that.selfInfo.isself = '1'; 
          
          that.firstPageMsg.push(that.selfInfo);

          if(that.firstPageMsg.length > 20) { //超过pageSize，则去除数组首个元素
            that.firstPageMsg.shift();
          }
          that.messageList.push(that.selfInfo);
          that.$refs.msglist.refresh(true);
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
         
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });

          
      })
     
    },

    onLoadMore() {
      let that = this;
      this.params.page = +this.pager.cur_page - 1;
      this.getMessageDetail(this.params);
    },

    onSetInterval() {
      let that = this;

      if(that.interval) return; 

      let params = Util.myExtend(that.params);     
      that.interval = setInterval(function() {  //每隔30s去取消息
        params.notLoader = true;
        params.page = '';
        that.getMessageDetail(params)
      }, 30000)
    }
  },
  beforeMount () {
    let that = this
    that.params = {
      version: 4,
      module: 'viewpm',
      touid: that.$route.params.id,
      page:'' //传空字符串，默认取最后一句数据
    }

    // that.getMessageDetail(that.params);
    let uid = Util.getSessionStorage('uid');
    let isLogined_cookie = Validate.getCookie('voHF_b718_auth');
    if (!uid && !isLogined_cookie) {
      Validate.getLoginInfo(function(result) {
        // console.info('result---', result)
        if (result.isLogined === 1) {
          that.getMessageDetail(that.params);
        } else {
          that.$router.push('/main');
          setTimeout(function() {
            Toast('请登录！');
          }, 1000);
        }

      })
    } else {
      that.getMessageDetail(that.params);
    }
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/messagedetail.scss";
</style>

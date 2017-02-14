<template>
  <div class="messagedetail-view">
    <zheader 
      :header-title="username" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}"> 
      <div class="content">
        <div class="dialog-list">
          <div class="left dialog-item">
            <img class="avatar" src="../images/icon-avatar.png" />
            <div class="message-body">今天打算投多少？</div>
          </div>
          <div class="right dialog-item">
            <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
            <img class="avatar" src="../images/icon-avatar.png" />
          </div>
         
        </div>
      </div>
    </div>
    <div class="btn-message" @click="onMessage">发消息</div>
    <div class="message-dialog" v-show="isShowDialog">
      <div class="masker" v-show="isShowDialog"></div>
      <div class="dialog-content">
        <div class="dialog-title">回复</div>
        <textarea class="reply-content" placeholder="请输入…"></textarea>
        <div class="btn-wrapper">
          <div class="btn-cancel" @click="onCancel">取消</div>
          <div class="btn-send" @click="onSend">发送</div>
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
export default {
  components: {
    Zheader,
    Toast
  
  },
  data () {
    return {
      username:"",
      isShowDialog: false,
      isScrollActive: true
    }
  },
  methods: {
    getMessageDetail(params) {
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          //记录页数信息
          that.pager = data.pager;
          if(params.page == data.pager) { //刷新或者第一次加载数据
            that.myPostList = data.list;
          } else if(params.page > 1) { //加载更多数据
            that.myPostList = that.myPostList.concat(data.list);
          }

          
          if(that.$refs.list) {
            if(that.myPostList.length == 0) { //无数据
              that.$refs.list.onNoData();
            } else {  //刷新list
              setTimeout(function() { 
                that.$refs.list.refresh();
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
              }, 200)
            }
          }
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
      })
    },
    onMessage() { //填写消息
      this.isShowDialog = true;
      this.isScrollActive = false;
    },
    onCancel() {
      this.isShowDialog = false;
      this.isScrollActive = true;
    },
    onSend() {
      // TODO:展示，需要删除
      Toast("发送消息");
      this.isShowDialog = false;
      this.isScrollActive = true;
    }
  },
  beforeMount () {
    this.params = {
      "version": 4,
      "module": "viewpm",
      "touid": this.$route.params.id
    }

    this.getMessageDetail(this.params)
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/messagedetail.scss";
</style>

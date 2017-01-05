<template>
  <div class="changetb-view">
  <zheader 
    :header-title="username" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true">
  </zheader> 
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
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
    </div>
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
    </div>
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
    </div>
     <div class="left dialog-item">
      <img class="avatar" src="../images/icon-avatar.png" />
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
    </div>
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
    </div>
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
    </div>
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
    </div>
     <div class="right dialog-item">
      <div class="message-body">今天打算投多少？今天打算投多少？今天打算投多少？今天打算投多少？</div>
      <img class="avatar" src="../images/icon-avatar.png" />
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

export default {
  name: 'mission',
  components: {
    Zheader,
    Toast
  
  },
  data () {
    return {
      username:"小叮当",
      isShowDialog: false
    }
  },
  methods: {
    onMessage() {
      this.isShowDialog = true;
    },
    onCancel() {
      this.isShowDialog = false;
    },
    onSend() {
      // TODO:展示，需要删除
      Toast("发送消息");
      this.isShowDialog = false;
    }
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/messagedetail.scss";
</style>

<template>
  <div class="changetb-view">
  <zheader 
    :header-title="'我的消息'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true">
  </zheader> 
  <div class="content">
    <div class="tab">
      <div class="tab-item active"><font>个人消息</font><span class="message-num">23</span></div>
      <div class="tab-item"><font>系统消息</font><span class="message-num">11</span></div>
    </div>
    <div class="message-list-wrapper">
      <div class="message-person-list">
        <div class="message-person-item">
          <div class="left">
            <img class="avatar" src='../images/icon-avatar.png' />
            <span class="point-new"></span>
          </div>
          <div class="right">
            <div class="username">小叮当</div>
            <div class="msg-date">10-17</div>
            <div class="msg-body">我觉得投定期理财还是不错的，利率也很合理，打算继续加大投资</div>
          </div>
        </div>
        <div class="message-person-item">
          <div class="left">
            <img class="avatar" src='../images/icon-avatar.png' />
            <span class="point-new"></span>
          </div>
          <div class="right">
            <div class="username">小叮当</div>
            <div class="msg-date">10-17</div>
            <div class="msg-body">我觉得投定期理财还是不错的，利率也很合理，打算继续加大投资</div>
          </div>
        </div>
      </div>
      <div class="message-system-list"></div>
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
      exchangeInfo: {
      prestige:10,
      max_num:9,

    },
    
    }
  },
  methods: {
    
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/myMessage.scss";
</style>

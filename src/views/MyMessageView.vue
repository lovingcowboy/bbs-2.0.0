<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的消息'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
        <div class="tab">
          <div class="tab-item" :class="{'active': isShowProsonMsg}"  @click="onShowMsg('0')"><font>个人消息</font><span class="message-num">23</span></div>
          <div class="tab-item" :class="{'active': !isShowProsonMsg}" @click="onShowMsg('1')"><font>系统消息</font><span class="message-num">11</span></div>
        </div>
        <div class="message-list-wrapper">
          <div class="message-person-list" v-show="isShowProsonMsg">
            <div class="message-person-item" @click="goMessageDetail('1')">
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
            <div class="message-person-item" @click="goMessageDetail('1')">
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
             <div class="message-person-item" @click="goMessageDetail('1')">
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
             <div class="message-person-item" @click="goMessageDetail('1')">
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
             <div class="message-person-item" @click="goMessageDetail('1')">
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
             <div class="message-person-item" @click="goMessageDetail('1')">
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
            <div class="message-person-item" @click="goMessageDetail('1')">
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
             <div class="message-person-item" @click="goMessageDetail('1')">
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
          <div class="message-system-list" v-show="!isShowProsonMsg">
            <div class="message-system-item" :class="{'isNew': isSystemMsgNew}">
                <div class="point-new"></div>
                <div class="message-content">
                  <div class="msg-body">我觉得投定期理财还是不错的，利率也很合理，打算继续加大投资</div>
                  <div class="time-wrapper">
                    <div class="msg-date">2016.09.09</div>
                    <div class="msg-time">10:20</div>
                  </div>
                </div>
            </div>
             <div class="message-system-item" :class="{'isNew': false}">
                <div class="point-new"></div>
                <div class="message-content">
                  <div class="msg-body">我觉得投定期理财还是不错的，利率也很合理，打算继续加大投资</div>
                  <div class="time-wrapper">
                    <div class="msg-date">2016.09.09</div>
                    <div class="msg-time">10:20</div>
                  </div>
                </div>
            </div>
          </div>
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
      isSystemMsgNew: true,
      isScrollActive: true,
      isShowProsonMsg: true,
      exchangeInfo: {
      prestige:10,
      max_num:9,

    },
    
    }
  },
  methods: {
    onShowMsg(type) { //切换消息类型
      switch(type) {
        case "0":
          this.isShowProsonMsg = true;
          break;
        case "1":
          this.isShowProsonMsg = false;
          break;
      }
    },
    goMessageDetail(id) {
      let url = '/user/messagedetail/' + id
      this.$router.push(url)
    }
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mymessage.scss";


</style>

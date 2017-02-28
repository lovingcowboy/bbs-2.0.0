<template>
  <div class="v1-view">
  <zheader 
    :header-title="'评分'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <div class="m-cont">
        <p class="item-type">人气</p>
      <!--   <p class="score">
          <i v-for="(score, index) in scoreList" @click="mark(score, index)" :class="{'active': scoreActive == index}">{{score}}</i>
        </p> -->
        <p class="prestige-container">
          <input type="number"  pattern="[0-9]*" name="prestige" placeholder="请输入人气数量" v-model="markDetail.score" >
        </p>
        <p class="item-type item-ww" v-show="markData.surplus_rate.extcredits1 && +markData.surplus_rate.extcredits1 > 0">威望</p>
        <p class="prestige-container" v-show="markData.surplus_rate.extcredits1 && +markData.surplus_rate.extcredits1 > 0">
          <input type="number"  pattern="[0-9]*" name="prestige" placeholder="请输入威望数量" v-model="markDetail.prestige">
        </p>
        <p class="item-type">留言</p>
        <p class="msg-cont">
          <span class="msg-row">
            <!-- <i class="msg-default">谢谢楼主分享</i>
            <i class="msg-default">加分支持</i> -->
            <i class="msg-default msg-item" v-for="(msg, index) in markData.reasons" @click="pickMsg(msg, index)" :class="{'active': msgActive == index}">{{msg}}</i>
            </span>
            <i class="msg-add msg-item" @click="goAdd">+自定义留言</i>
        </p>
        <div class="btn-blue btn-mark" @click="markPost">评分</div>
      </div>
    </div>
    </div>
    <div class="message-dialog" v-show="isShowDialog">
      <div class="masker" v-show="isShowDialog"></div>
      <div class="dialog-content">
        <div class="dialog-title">添加自定义留言</div>
        <textarea class="reply-content" placeholder="请输入留言" v-model.trim="msgAdd"></textarea>
        <div class="btn-wrapper">
          <div class="btn-cancel" @click="onCancel">取消</div>
          <div class="btn-send" @click="onSave">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import service from '../services'
import Validate from '../js/lib/validate.js'
import Toast from '../components/toast'
export default {
  name: 'mark',
  components: {
    Zheader,
    Toast,
  },
  data () {
    return {
      isScrollActive: true,
      // scoreList: [1,2,3,4,5,6,7],
      // msgList: ['谢谢楼主分享', '加分支持'],
      // selectedMark: 0,
      scoreActive: null,
      // selectedMsg: '',
      msgActive: null,
      isShowDialog: false,
      msgAdd: '',
      markDetail: {
        score: '',
        prestige: '',
        msg: ''
      },
      formhash: '',
      markData: {
        surplus_rate: {}
      }
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun () {
      console.info('11111')
    },
    // mark (score, index) {
    //   // this.selectedMark = score
    //   this.markDetail.score = score
    //   this.scoreActive = index
    // },
    pickMsg (msg, index) {
      // this.selectedMsg = msg
      this.markDetail.msg = msg
      this.msgActive = index
    },
    markPost () {
      console.info('data------', this.markDetail)
      let that = this
      let isCorrect_score = true
      let isCorrect_prestige = true
      if (this.markDetail.score > +this.markData.surplus_rate.extcredits3 || this.markDetail.score < +this.markData.rate_rule.extcredits3.min || this.markDetail.score > +this.markData.rate_rule.extcredits3.max || this.markDetail > +this.markData.rate_rule.extcredits3.mrpd) {
        isCorrect_score = false
      }
      if (!isCorrect_score) {
        Toast({
          message: '当前您的剩余可评分人气数量为' + this.markData.surplus_rate.extcredits3 + '，评分范围为' + this.markData.rate_rule.extcredits3.min + '~' + this.markData.rate_rule.extcredits3.max + '，每日评分上限为' + this.markData.rate_rule.extcredits3.mrpd
        })
        return
      }
      if (this.markData.surplus_rate.extcredits1 && +this.markData.surplus_rate.extcredits1 > 0) {
        if (this.markDetail.prestige > +this.markData.surplus_rate.extcredits1 || this.markDetail.prestige < +this.markData.rate_rule.extcredits1.min || this.markDetail.prestige > +this.markData.rate_rule.extcredits1.max || this.markDetail > +this.markData.rate_rule.extcredits1.mrpd) {
          isCorrect_prestige = false
        }
        if (!isCorrect_score) {
          Toast({
            message: '当前您的剩余可评分威望数量为' + this.markData.surplus_rate.extcredits1 + '，评分范围为' + this.markData.rate_rule.extcredits1.min + '~' + this.markData.rate_rule.extcredits1.max + '，每日评分上限为' + this.markData.rate_rule.extcredits1.mrpd
          })
          return
        }
      }
      /*if(!this.markDetail.msg) {
        Toast({
          message: '请选择留言'
        })
        return
      }*/
      service.postData('/app/index.php', {
        module: 'threadrate',
        action: 'rate',
        tid: that.$route.params.tid,
        pid: that.$route.params.pid,
        formhash: Util.getSessionStorage('formhash'),
        score1: that.markDetail.prestige,
        score2: 0,
        score3: that.markDetail.score,
        reason: that.markDetail.msg,
        ratesubmit: 'yes'
      }).then((response) => {
        console.info('markPost--------', response)
        let _body = response.body
        if (_body.code === '200') {
          window.history.back()
        } else {
          let msg = '请求失败，请稍后重试'
          if (_body.message) {
            msg = _body.message
          }
          Toast({
            message: msg
          })
        }
      }, (response) => {
        console.info('markPost fail-----', response)
      })

      // window.history.back()
    },
    goAdd () {
      this.isShowDialog = true
      this.isScrollActive = false
    },
    onCancel () {
      this.isShowDialog = false
      this.isScrollActive = true
      this.msgAdd = ''
    },
    onSave () {
      this.isShowDialog = false
      this.isScrollActive = true
      this.msgList.push(this.msgAdd)
      this.markDetail.msg = this.msgAdd
      this.msgAdd = ''
      this.msgActive = this.msgList.length - 1
    },
    init () {
      /*let reqParam = this.$route.params.reqParam
      if (!reqParam) {
        return
      }
      reqParam = JSON.parse(reqParam)
      service.postData('/app/index.php', {
        version: 4,
        module: 'threadrate',
        action: 'rate',
        tid: reqParam.tid,
        pid: reqParam.pid,
        formhash: this.formhash
      }).then((response) => {
        console.info('init---', response.body)
        let _body = response.body
        if (_body.code === '200') {

        } else {
          let msg = '请求失败，请稍后重试'
          if (_body.message) {
            msg = _body.message
          }
          Toast({
            message: msg
          })
        }
      }, (response) => {
        console.info('init fail-----', response)
      })*/
    }
  },
  mounted () {
    let that = this
    let _data = Util.getSessionStorage('markData')
    if (_data) {
      this.markData = JSON.parse(_data)
        // this.msgList = markData.reasons
      console.info(this.markData.surplus_rate)
    }
    if (!Validate.checkLogin()) {
      Validate.getLoginInfo(function(result) {
        // console.info('result---', result)
        if (result.isLogined != 1) {
          that.$router.push('/main')
          setTimeout(function() {
            Toast('请登录！')
          }, 1000)
        }

      })
    }
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/mark.scss'

</style>
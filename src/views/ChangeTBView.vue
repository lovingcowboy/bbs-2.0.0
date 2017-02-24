<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'威望兑团币'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}"> 
      <div class="content">
        <div class="tips">3社区威望可兑换1个团币</div>
        <div class="prestige"><font>您的社区威望：{{exchangeInfo.prestige}}</font></div>
        <div class="change-content">
          <div class="change-text">兑换数量<font class="change-maxnum">（最大兑换数量：{{exchangeInfo.max_num}}）</font></div>
          <div class="change-wrapper">
            <input type="number" pattern="[0-9]*"  class="change-input" v-model="exchangeNum" maxlength=20  placeholder="请输入兑换数量"  @input="onInput();" />
            <div class="btn-change-all" @click="onChangeAll();">全部兑换</div>
          </div>
          <div class="change-result-num">可获<font :class="canChange ? 'orange' : ''">{{canChangeNum}}</font>个团币</div>
        </div>
        <div class="btn-exchange" @click="onExchange();">马上兑换</div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
// import Util from '../js/Util.js'
import Validate from '../js/lib/validate.js'
import Services from '../services'
export default {
  components: {
    Zheader,
    Toast
  
  },
  data () {
    return {
      isScrollActive: true,
      exchangeInfo: {},
      exchangeNum: "",
      canChange:false,
      canChangeNum:0
    }
  },
  methods: {
    onChangeTB(params) { //获取威望信息、兑换团币
      let that = this;
      
      Services.postData('/app/index.php', params).then((response) => {
        
        let _body = response.body;

        if (_body.code === '200') {
          let data = _body.data;
          that.exchangeInfo = data.exchange_info;

          that.exchangeNum = '';
          // 主动调输入方法
          that.onInput();

          if(params.submit == 'yes') {  //兑换
            Toast('兑换成功');
          }
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

    onInput() {
      this.canChange = false;
      if(this.exchangeNum.length === 0) {
        this.canChangeNum = 0;
        return;
      }
    
      let value = Number(this.exchangeNum, 10);
     
      if(isNaN(value) || value === 0) {
        Toast('请输入正确的兑换数量');
        this.canChangeNum = 0;
        return;
      }
      
 
      // 最大可兑换数量
      this.exchangeNum = value > this.exchangeInfo.max_num ? this.exchangeInfo.max_num : value;

      if(this.exchangeNum % 3 !== 0) {
        Toast('请输入3的整数倍');
        this.canChangeNum = 0;
        return;
      }

      // 可以兑换的团币值
      this.canChangeNum = parseInt(this.exchangeNum / 3);
      this.canChange = true;
    },

    onChangeAll() {
       // 最大可兑换数量
      this.exchangeNum = this.exchangeInfo.max_num;
      // 主动调输入方法
      this.onInput();
    },

    onExchange() {
      let exchangeNum = Number(this.exchangeNum);
      if(isNaN(exchangeNum) || exchangeNum === 0 || exchangeNum % 3 !== 0) {
        return;
      }
      let params = Util.myExtend(this.params);
      params.submit = 'yes';
      params.prestige = exchangeNum;

      this.onChangeTB(params);
    }
  },
  beforeMount () {
    this.params = {
      version: 4,
      module: 'member',
      action: 'exchange_tuanbi'
    }

    this.onChangeTB(this.params);
    let that = this;
    let uid = Util.getSessionStorage('uid');
    let isLogined_cookie = Validate.getCookie('voHF_b718_auth');
    if (!uid && !isLogined_cookie) {
      Validate.getLoginInfo(function(result) {
        // console.info('result---', result)
        if (result.isLogined === 1) {
          that.onChangeTB(this.params);
        } else {
          that.$router.push('/main');
        }

      })
    } else {
      that.onChangeTB(this.params);
    }
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/changetb.scss";
</style>

<template>
  <div class="changetb-view">
  <zheader 
    :header-title="'威望兑团币'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true">
  </zheader> 
  <div class="content">
    <div class="tips">3社区威望可兑换1个团币</div>
    <div class="prestige"><font>您的社区威望：{{exchangeInfo.prestige}}</font></div>
    <div class="change-content">
      <div class="change-text">兑换数量<font class="change-maxnum">（最大兑换数量：{{exchangeInfo.max_num}}）</font></div>
      <div class="change-wrapper">
        <input class="change-input" type="text" v-model="exchangeNum" maxlength=20 placeholder="请输入兑换数量" @input="onInput">
        <div class="btn-change-all" @click="onChangeAll">全部兑换</div>
      </div>
      <div class="change-result-num">可获<font :class="canChange ? 'orange' : ''">{{canChangeNum}}</font>个团币</div>
    </div>
    <div class="btn-exchange" @click="onExchange">马上兑换</div>
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
     exchangeNum: 0,
    canChange:false,
    canChangeNum:0
    }
  },
  methods: {
    onInput() {
      this.canChange = false;
      if(this.exchangeNum.length === 0) {
        this.canChangeNum = 0;
        return;
      }
    
      let value = Number(this.exchangeNum, 10);
     
      if(isNaN(value) || value === 0) {
        Toast("请输入正确的兑换数量");
        this.canChangeNum = 0;
        return;
      }
      
 
      // 最大可兑换数量
      this.exchangeNum = value > this.exchangeInfo.max_num ? this.exchangeInfo.max_num : value;

      if(this.exchangeNum % 3 !== 0) {
        Toast("请输入3的整数倍");
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
      if(this.exchangeNum === 0) {
        return;
      }
      console.log("马上兑换")
    }
  },
  beforeMount () {

  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/changetb.scss";
</style>

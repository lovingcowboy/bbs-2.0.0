<template>
  <div class="v1-view">
  <zheader 
    :header-title="'团粉圈'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
     <ul class="post-list" @click="listClickFunc($event)">
       <post-item v-for="(item, index) in recommentList" :data="item">
         <div class="item-title" slot="itemhead">
           <span data-type="userclick" :data-id="item.id">
             <img src="../images/pai.png"><font>{{item.name}}</font><font class="level">{{item.level}}</font>
           </span>
           <span>{{item.time}}</span>
         </div>
       </post-item>
     </ul>
    </div>
      
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import PostItem from '../components/PostItem.vue'
import Toast from '../components/toast'
import { isApp, isAndroid } from '../filters'
export default {
  name: 'recomment',
  components: {
    Zheader,
    Toast,
    PostItem
  },
  data () {
    return {
      isScrollActive: true,
      recommentList: []
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun() {
      console.info('11111')
    },
    listClickFunc(e) {
        let obj = Util.getElemetByTarget(e.target, 'c-event', 'post-list')
        if (!obj) return
        let id = obj.dataset.id
        if (!id) {
          id = e.target.getAttribute('data-id')
        }
        let url = '/postdetail/' + id
        this.$router.push(url)
    }
      
  },
  beforeMount () {
    let that = this
    for (let i = 0; i < 5; i++) {
      let item = {
        name: '神采飞扬',
        level: 'LV2 大咖',
        time: i * 10 + '分钟前',
        pTitle: '团贷网大踏步走在紧拥监管，跨越发展之路上',
        pDesc: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
        view: 12 * i,
        reply: 25 * i,
        id: i * 10
      }
      that.recommentList.push(item)
    }
  },
  mounted () {
  }


}
</script>

<style lang="scss" scoped>
// @import '../sass/recomment.scss'

</style>

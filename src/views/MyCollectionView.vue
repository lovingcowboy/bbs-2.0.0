<template>
  <div class="changetb-view">
    <zheader 
      :header-title="'我的收藏'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader>
    <div class="scroll" :class="{'scroll-active': isScrollActive}">   
      <div class="content">
      <ul class="collection-list post-list"  @click="goPostDetail">
        <post-item v-for="(item, index) in collectionList" :data="item">
          <div class="item-title" slot="itemhead">
            <span data-type="userclick" :data-id="item.id">
              <img src="../images/pai.png"><font>{{item.name}}</font>
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
import Toast from '../components/toast'
import PostItem from '../components/PostItem.vue'
export default {
  name: 'mission',
  components: {
    Zheader,
    Toast,
    PostItem
  },
  data () {
    return {
    
      isScrollActive: true,
      collectionList: []
    }
  },
  methods: {
   goPostDetail(e) {
    let obj = Util.getElemetByTarget(e.target, 'post-row', 'post-list');  //获取点击到的帖子item
      if (!obj) return
      let id = obj.dataset.id   //获取到id
      
      var url = '/postdetail/' + id
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
     that.collectionList.push(item);
    }
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mycollection.scss";


</style>

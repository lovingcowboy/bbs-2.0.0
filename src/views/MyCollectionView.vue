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
      <list :config.once="scrollConfig" @init="onInitList"  @loadmore="onLoadMore" ref="list" >
        <div class="scroll-wrapper post-list" slot="scrollContent" @tap="listClickFunc">
          <post-item v-for="(item, index) in collectionList" :data="item">
            <div class="item-title" slot="itemhead">
              <span data-type="userclick" :data-id="item.authorid" class="c-event">
                <img :src="item.avatar"><font>{{item.author}}</font>
              </span>
              <span v-html="item.dateline"></span>
            </div>
          </post-item>
         
        </div>
      </list> 
      <!-- <ul class="collection-list post-list"  @click="goPostDetail">
        <post-item v-for="(item, index) in collectionList" :data="item">
          <div class="item-title" slot="itemhead">
            <span data-type="userclick" :data-id="item.id">
              <img src="../images/pai.png"><font>{{item.name}}</font>
            </span>
            <span>{{item.time}}</span>
          </div>
        </post-item>
      </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Services from '../services'
import List from 'components/listview'
import Util from '../js/Util.js'
import PostItem from '../components/PostItem.vue'
export default {
  components: {
    Zheader,
    Toast,
    List,
    PostItem
  },
  data () {
    return {
      isScrollActive: true,
      scrollConfig: {
        wrapper: 'postWrapper',
        mutationObserver: true,
        refresh: false,
        loadmore: true
      },
      collectionList: []
    }
  },
  methods: {
   getPostList(params) { //获取帖子列表
      let that = this;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

          if(params.page == 1) { //刷新或者第一次加载数据
            that.collectionList = data.list;

          } else if(params.page > 1) { //加载更多数据
            that.collectionList = that.collectionList.concat(data.list);
          }
          /*for (let i = 0; i < 10; i++) {
            let item = {
              name: '神采飞扬',
              level: 'LV2 大咖',
              time: i * 10 + '分钟前',
              subject: '团贷网大踏步走在紧拥监管，跨越发展之路上',
              message: '如果发的红包能匹配合适资金用上，不在乎多少，能用就最好！',
              views: 12 * i,
              replies: 25 * i,
              id: i * 10
            }
            that.collectionList.push(item)
          }*/
          //记录页数信息
          that.pager = data.pager;
          if(that.$refs.list) {
            if(that.collectionList.length == 0) { //无数据
              that.$refs.list.onNoData();
            } else {  //刷新list
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
              
            }
            that.$refs.list.refresh();
          }
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
          that.$refs.list.refresh();
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
          that.$refs.list.refresh();
      })
    },

    onInitList(scroller) {
      this.outerScroller = scroller;
    },
    onLoadMore() {
      let that = this;
      this.params.page = Number(this.pager.cur_page) + 1;
      this.getPostList(this.params);
    },

   /* goPostDetail(e) {
      let obj = Util.getElemetByTarget(e.target, 'post-row', 'scroll-wrapper');
       
      if (!obj) return;

      let id = obj.dataset && obj.dataset.id 
      
      if(!id) return;

      let url = '/postdetail/' + id
      this.$router.push(url)
    }*/
    listClickFunc(e) {
     
      let obj = Util.getElemetByTarget(e.target, 'c-event', 'post-list')
       
      if (!obj) return
      let type = obj.dataset.type
      let id = obj.dataset.id
      if (!type) return;
      if (type === 'userclick') {
        this.goUserCenter(id)
      } else if (type === 'itemclick') {
        this.goDetail(id)
      }
    },
    goUserCenter(id) {
      var url = '/centerother/' + id
      this.$router.push(url)
    },
    goDetail(id) {
      var url = '/postdetail/' + id
      this.$router.push(url)
    }
  },
  beforeMount () {
    this.params = {
      version: 4,
      module: 'myfavthread',
      page:  1,

    }
    this.getPostList(this.params)
  }
  
}
</script>

<style lang="scss" scoped>
@import "../sass/mycollection.scss";


</style>

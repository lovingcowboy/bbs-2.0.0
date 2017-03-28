<template>
  <div class="recomment-view">
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
     <list :config.once="recommentScrollConfig" @init="onInitList" @refresh="onRefreshList" @loadmore="onLoadMore" ref="recList">
      <div class="scroll-wrapper" slot="scrollContent" id="recommentScroll">
      <ul class="post-list" @tap="listClickFunc($event)">
       <post-item v-for="(item, index) in recommentList" :data="item" :line="2">
         <!-- <div class="item-title" slot="itemhead">
           <span data-type="userclick" :data-id="item.authorid" class="c-event">
             <img :src="item.avatar"><font>{{item.nickname ,6 | ellipsisText}}</font><font class="level">LV{{item.group_level}} {{item.group_name}}</font>
           </span>
           <span v-html="item.dateline"></span>
         </div> -->
         <div class="item-message c-event" slot="itemMessage" data-type="userclick" :data-id="item.authorid">
             <div class="item-u">
                 <img :src="item.avatar" class="i-avator">
                 <font class="i-name">{{item.nickname, 3 | ellipsisText}}</font>
                 <font class="level">LV{{item.group_level}} {{item.group_name}}</font>
                 <font>|</font>
                 <font v-html="item.dateline"></font>
             </div>
             <div class="item-m">
                 <div class="post-view">
                     <i class="icon-view"></i>
                     <span>{{item.views}}</span>
                 </div>
                 <div class="post-reply">
                     <i class="icon-reply"></i>
                     <span>{{item.replies}}</span>
                 </div>
             </div>
         </div>
       </post-item>
     </ul>
     </div>
     </list>
    </div>
      
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import PostItem from '../components/PostItem.vue'
import Toast from '../components/toast'
// import { ellipsisText } from '../filters'
import List from "components/listview"
import Services from '../services'

export default {
  name: 'recomment',
  components: {
    Zheader,
    Toast,
    PostItem,
    List
  },
  data () {
    return {
      isScrollActive: true,
      recommentList: [],
      pageData: {
        curPage: 1,
        totalPage: 1
      },
      recommentScrollConfig: {
        wrapper: 'recommentScroll',
        mutationObserver: true,
        refresh: true,
        loadmore: true
      },
      hasData: false
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
      let type = obj.dataset.type
      let id = obj.dataset.id
      if (!type) {
        type = e.target.getAttribute('data-type')
        id = e.target.getAttribute('data-id')
      }
      if (type === 'userclick') {
        //跳转到其他人的个人中心
        var url = '/centerother/' + id
        this.$router.push(url)
      } else if (type === 'itemclick') {
        //跳转到帖子详情
        var url = '/postdetail/' + id
        this.$router.push(url)
      }
    },
    getRecommentList(notLoader) {
      let that = this
      if(that.pageData.curPage > that.pageData.totalPage) {
         that.$refs.recList.refresh()
         that.$refs.recList.loadmore = false
        return
      }
      let reqParam = {
        module: 'forum',
        action: 'editorial_recommend',
        page: that.pageData.curPage,
        notLoader: notLoader
      }

      Services.postData('/app/index.php',reqParam).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          if (that.pageData.curPage === 1) {

            that.recommentList = data.list
          } else {
            that.recommentList = that.recommentList.concat(data.list)
          }
          that.$refs.recList.loadmore = +data.pager.cur_page < +data.pager.total_page
          that.pageData = {
            curPage: +data.pager.cur_page + 1,
            totalPage: +data.pager.total_page
          }
          that.$refs.recList.refresh() //刷新list
          that.hasData = true
        } else {
          let msg = _body && _body.message ||  '请求失败，请稍后重试'
          Toast(msg)
          that.$refs.recList.refresh()
          that.$refs.recList.loadmore = false
        }
      }, (response) => {
        console.info('getRecommentList------fail----', response)
        Toast('请求失败，请稍后重试')
        that.$refs.recList.refresh()
        that.$refs.recList.loadmore = false
      })
    },
    onInitList(scroller) {

    },
    onRefreshList() {
      this.pageData.curPage = 1
      this.getRecommentList(true)
    },
    onLoadMore() {
      this.getRecommentList(true)
    }
  },
  beforeMount() {
    // this.getRecommentList(false)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from && from.name !== 'postdetail' && from.name !== 'centerother' || !vm.hasData) { //不是从帖子详跳转回来
        vm.getRecommentList(false)
        vm.$refs.recList && vm.$refs.recList.myScroll.scrollTo(0, 0, 0)
      } else {
        vm.$refs.recList && vm.$refs.recList.refresh()
      }
    })
  }


}
</script>

<style lang="scss" scoped>
// @import '../sass/recomment.scss'
.content {
  height: 100%;
}
.i-name {
  margin-right: 0 !important;
}
.pi-title {
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
}
</style>

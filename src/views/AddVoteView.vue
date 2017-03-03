<template>
  <div class="p-addvote-view">
  <zheader 
    :header-title="'发帖'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    :hasLeftBtnFunc="false"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <section class="add-vote">
          <div class="v-option v-row" v-for="(opt, index) in addVoteData.options">
              <div @click="delVoteOption(index)"><i class="icon-del"></i></div>
              <div>
                  <input type="text" name="options" placeholder="请输入投票选项信息" v-model.trim="addVoteData.options[index].text" :value="opt.text" />
              </div>
          </div>
          <div class="v-bottom v-row">
              <span class="v-add" @click="addVoteOption">添加选项</span>
              <span class="v-save v-btn" @click="completeAddVote('save')">保存</span>
              <span class="v-cancle v-btn" @click="completeAddVote('cancle')">取消</span>
          </div>
      </section>

     
    </div>
      
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
export default {
  name: 'addVote',
  components: {
    Zheader,
    Toast
  },
  data () {
    return {
      isScrollActive: true,
      addVoteData: {
        title: '',
        options: [{
          id: 0,
          text: ''
        }, {
          id: 1,
          text: ''
        }]
      },
      hasPostVote: false

    }
  },
  computed: {
    
  },
  methods: {
    completeAddVote(type) {
      // console.info(this.addVoteData)
      if (type === 'save') {
        console.info('vote save edit')
        let data = this.addVoteData
        if (data.options.length < 2) {
          Toast({
            message: '至少要有两个投票选项'
          })
          return
        }
        if (data.options.length > 25) {
          Toast({
            message: '最多支持25个选项'
          })
          return
        }
        let flag = true
        for (let opt of data.options) {
          if (opt.text === '') {
            flag = false
            break
          }
        }
        if (!flag) {
          Toast({
            message: '投票选项不可为空'
          })
          return
        }
        Util.setSessionStorage('postVote', JSON.stringify(data))
      }
      window.history.back()
    },
    addVoteOption() {
      //添加投票选项
      let opt = {
        // id: this.addVoteData.options.length,
        text: ''
      }
      this.addVoteData.options.push(opt)
    },
    delVoteOption(id) {
      //删除投票选项
      if (this.addVoteData.options.length <= 2) {
        Toast({
          message: '至少要有两个投票选项'
        })
        return
      }
      this.addVoteData.options = this.addVoteData.options.filter((item, index) => {
        return id != index
      })
      console.info(this.addVoteData.options.length, this.addVoteData.options)
    }
  },
  mounted () {
    let data = Util.getSessionStorage('postVote')
    if(data) {
      this.hasPostVote = true
      this.addVoteData = JSON.parse(data)
    }

  }


}
</script>

<style lang="scss" scoped>
@import '../sass/addVote.scss'

</style>

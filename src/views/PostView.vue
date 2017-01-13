<template>
  <div class="v1-view">
  <zheader 
    :header-title="'发帖'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <div class="pc">
        <p class="p-txt1"><span>选择版块</span><span @click="showRule">发帖规则</span></p>
        <p class="msg-cont">
            <i class="msg-default msg-item" v-for="(item, index) in moduleList" @click="selectModule(item.name, index)" :class="{'active': moduleActive == index}">{{item.name}}</i>
        </p>
        <div class="p-form">
          <div class="p-title">
            <input type="text" name="pTitle" placeholder="帖子标题" class="i-title" v-model.trim="post.title" @input="titleChangeFun" @compositionstart="compositionstartFun" @compositionend="compositionendFun">
          </div>
          <div class="p-content">
            <textarea placeholder="帖子内容" class="i-content" id="postContent" v-model.trim="post.content" @blur="blurFun" ></textarea>
          </div>
        </div>
      </div>
     
    </div>
      <!-- hasVote:是否显示投票图标；imgList：添加图片列表； addImg：是否显示添加图片图标；canAddImg：web端是否可上传图片；emotionClickFunc：点击表情图片事件；imgDelFunc：删除图片事件；btnClickFunc：发表按钮点击事件；addImgFunc：上传图片-->
      <insert-tabs
        :hasVote="true"
        :imgList="imgList"
        :addImg="addImg"
        :canAddImg="canAddImg"
        :postVote="postVote"
        @emotionClickFunc="insertEmo"
        @imgDelFunc="delImg"
        @btnClickFunc="goPost"
        @addImgFunc="addImgFunc"
        @addVoteFunc="addVoteFunc"
      ></insert-tabs>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import InsertTabs from '../components/InsertTabs.vue'
import { isApp, isAndroid } from '../filters'
import lrz from '../js/lib/lrz.js'
import Vue from 'vue'
export default {
  name: 'post',
  components: {
    Zheader,
    Toast,
    InsertTabs
  },
  data () {
    return {
      isScrollActive: true,
      selectPostion: {
        selectionStart: 0,
        selectionEnd: 0
      },
      moduleList: [{
        name: '投资交流',
        id: 0
      }, {
        name: '有问必答',
        id: 1
      }, {
        name: '团粉建言',
        id: 2
      }, {
        name: '畅所欲言',
        id: 3
      }, {
        name: '财经新闻',
        id: 4
      }],
      moduleActive: 0,
      imgList: [],
      post: {
        module: null,
        title: '',
        content: ''
      },
      addImg: true, //是否显示添加图片图标
      canAddImg: true, //web端是否可上传图片
      canPost: true, //是否可发表帖子
      comstart: false,
      postVote: null //发起投票信息
    }
  },
  computed: {
   
  },
  methods: {
    headerRightBtnFun() {
        console.info('11111')
      },
      blurFun(event) {
        let $target = event.currentTarget
        if ($target.selectionStart || $target.selectionStart == '0') {
          this.selectPostion = {
            'selectionStart': $target.selectionStart,
            'selectionEnd': $target.selectionEnd
          }

        }
      },
      insertEmo(code) {
        // console.info('insertEmo-----', code)
        //插入表情
        let that = this
        if (code === "close") {
          let _cont = that.post.content
          that.post.content = _cont.substring(0, _cont.length - 1)
          return
        }
        console.log(that.post.content)
        let $t = document.querySelector('#postContent')
        let startPos = that.selectPostion.selectionStart,
          endPos = that.selectPostion.selectionEnd,
          content = that.post.content
        that.post.content = content.substring(0, startPos) + code + content.substring(endPos, $t.value.length)
        // this.focus()

        Vue.nextTick(function() {
          that.selectPostion = {
            "selectionStart": startPos + code.length,
            "selectionEnd": startPos + code.length
          }
        })
      },
      delImg(i) {
        //删除图片
        let path = this.imgList[i].src
        this.imgList = this.imgList.filter((item, index) => {
          return i != index
        })
        let fileObj = document.querySelector('#file')
        if (path === fileObj.value) {
          fileObj.value = ''
        }
        if (this.imgList.length > 10) {
          this.addImg = false
        } else {
          this.addImg = true
        }
      },
      addImgFunc(e, type) {
        // console.info(e, type)
        if (type === 'app') {
          this.chooseImgFun()
        } else {
          this.chooseImgFunWeb(e)
        }
      },
      chooseImgFun() {
        //app端插入图片
        let that = this
        let _count = 9 - that.imgList.length
        console.info('chooseImgFun----', _count)
        return
        that.execOriginFun(function() {
          Bbsbridge.exec('getThumbnail', _count, function(data) {
            // alert("获取缩略图成功！")
            data = JSON.parse(data)
            if (data.code == 200) {
              let _data = data.data
              _data.forEach((item, i) => {
                item.photoContent = "data:img/jpgbase64," + item.photoContent
              })
              that.imgList = that.imgList.concat(_data)
              if (that.imgList.length >= 9) {
                that.addImg = false
              } else {
                that.addImg = true
              }
            } else {
              Toast('图片选择失败，请重新尝试！')
            }

          })
        })
      },
      chooseImgFunWeb(e) {
        //web端插入图片
        let that = this
        if (e.target.files.length <= 0) {
          return
        }
        // console.log(e.target.files[0],e.target.value)
        let _file_url = e.target.value
        // let _name = e.target.files[0].name

        that.canPost = false
        that.canAddImg = false
        // that.$refs.loading.$emit("show")

        lrz(e.target.files[0], {
            "fieldName": "Filedata"
          })
          .then(function(rst) {
            let _img = {
              "photoID": new Date().getTime(),
              "photoUrl": _file_url,
              "photoContent": rst.base64,
            }
            //如果有这张图片，则不实现
            let _file = that.imgList.filter((item) => {
              return item.photoContent === rst.base64
            })
            if (_file.length > 0) {
              Toast('此图片已存在！')
              that.canPost = true
              that.canAddImg = true
              // that.$refs.loading.$emit("hide")
              return
            }
            that.imgList.push(_img)
            that.canAddImg = true
            return

            var xhr = new XMLHttpRequest()
            // console.log(Config.baseUrl)
            // xhr.withCredentials = true
            xhr.open('POST', "bbs5.tuandai.com/app/index.php")

            xhr.onload = function() {
              if (xhr.status === 200) {
                // 上传成功
                // console.log(xhr.response)
                var data = xhr.response ? JSON.parse(xhr.response) : {}
                if (data.code == 200) {
                  _img.attachID = data.data.aid
                  that.imgList.push(_img)
                  if (that.imgList.length >= 9) {
                    that.addImg = false
                  }
                } else {
                  Toast(data.message)
                }

              } else {
                // 处理其他情况
                Toast("上传失败！")
              }
            }

            xhr.onerror = function() {
              // 处理错误
              Toast("上传失败！")
            }

            xhr.onreadystatechange = function() {
              // console.log(xhr.readyState)
              // if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) console.log(xmlhttp.responseText)
              if (xhr.readyState === xhr.DONE) {
                // console.log("done==========",xhr.status)
                that.canPost = true
                that.canAddImg = true
                that.$refs.loading.$emit("hide")

              }
            }

            xhr.upload.onprogress = function(e) {
              // 上传进度
              var percentComplete = ((e.loaded / e.total) || 0) * 100
              // console.log(percentComplete)
            }

            // 添加参数
            rst.formData.append("version", 4)
            rst.formData.append("module", "forumupload")
            // rst.formData.append("Filedata",rst.file)

            // 触发上传
            xhr.send(rst.formData)
            /* ==================================================== */

            return rst
            // that.imgList.push(_img)
            // if(that.imgList.length > 10) {
            //  that.addImg = false
            // }


          })
          .catch(function(error) {
            console.log(error)
          })
          .always(function() {
            // e.target.value = ''
          })
      },
      execOriginFun: function(callback) {
        if (isAndroid()) { //如果是android,先缓存
          this.saveDataFun(callback)
        } else {
          callback()
        }
      },
      //保存 数据
      saveDataFun: function(callback) {
        let postdata = {
          'module': this.post.module,
          'title': this.post.title,
          'content': this.post.content
        }
        // console.log(postdata)
        Bbsbridge.exec('setSharePreference', {
          'key': 'postdata',
          'value': JSON.stringify(postdata)
        }, function(data) {
          data = JSON.parse(data)
          if (data.code == 200) {
            if (callback) {
              callback()
            }
          } else {
            Toast('自动保存数据失败！')
          }
        })
      },
      titleChangeFun(event) {
        // console.log(this.comstart)
        if (this.comstart) {
          return
        }
        let _title = this.post.title
        _title = _title.replace(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g, "") //不允许输入emoji
        if (_title.length > 80) {
          _title = _title.substring(0, 80)
        }
        this.post.title = _title
      },
      compositionstartFun() {
        this.comstart = true
      },
      compositionendFun() {
        this.comstart = false
      },
      goPost() {
        //发表帖子
        // console.info('goPost-------', this.post)
        window.history.back()
      },
      selectModule(module, index) {
        //选择模块
        this.post.module = module
        this.moduleActive = index
      },
      showRule () {
        //显示发帖规则
      },
      addVoteFunc (data) {
        //添加投票
        this.postVote = data
      },
      preventScroll (status) {
        //阻止页面滑动
        console.info('preventScroll----', typeof status)
        if (status === 0) {
          this.isScrollActive = false
        } else {
          this.isScrollActive = true
        }
      }
  },
  beforeMount () {
    let that = this
  },
  mounted () {
  }


}
</script>

<style lang="scss" scoped>
@import '../sass/post.scss'

</style>

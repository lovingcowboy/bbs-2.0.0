<template>
  <div class="p-post-view">
  <zheader 
    :header-title="'发帖'" 
    :has-back="true" 
    :has-rightbtn="false"
    :prevent-back="false"
    :show="true"
    :hasLeftBtnFunc="true"
    @left-btn-func="leftBtnFunc"
    @right-btn-func="headerRightBtnFun"
    >
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
    <div class="content" >
      <div class="pc">
        <p class="p-txt1"><span>选择版块</span><span @click="showRule"><i class="icon-prule">?</i><i>发帖规则</i></span></p>
        <div class="ml-container">
          <p class="msg-cont" v-if="hasModules">
              <i class="msg-default msg-item" v-for="(item, index) in moduleList" @click="selectModule(item.fid)" :class="{'active': moduleActive == item.fid}">{{item.name}}</i>
          </p>
          <p class="msg-cont" v-else>
            <i class="module-reload msg-default msg-item" @click="reloadModules">点击重新获取</i>
          </p>
        </div>
        <div class="p-form">
          <div class="p-title">
            <input type="text" name="pTitle" placeholder="帖子标题" class="i-title" v-model.trim="post.title" @input="titleChangeFun" @compositionstart="compositionstartFun" @compositionend="compositionendFun">
          </div>
          <div class="p-content">
            <textarea placeholder="帖子内容" class="i-content" id="postContent" v-model.trim="post.content" @blur="blurFun" @input="contentChangeFunc"></textarea>
          </div>
        </div>
      </div>
     
    </div>
      <!-- hasVote:是否显示投票图标；imgList：添加图片列表； addImg：是否显示添加图片图标；canAddImg：web端是否可上传图片；emotionClickFunc：点击表情图片事件；imgDelFunc：删除图片事件；btnClickFunc：发表按钮点击事件；addImgFunc：上传图片 ；showAddVote:是否显示投票选项-->
      <insert-tabs
        :hasVote="true"
        :imgList="imgList"
        :addImg="addImg"
        :canAddImg="canAddImg"
        :postVote="postVote"
        :btnActive="canPost"
        :showAddVote="showAddVote"
        @emotionClickFunc="insertEmo"
        @imgDelFunc="delImg"
        @btnClickFunc="goPost"
        @addImgFunc="addImgFunc"
        @delVoteFunc="delVoteFunc"
        ref="insertTabs"
      ></insert-tabs>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import InsertTabs from '../components/InsertTabs.vue'
import { isApp, isAndroid } from '../filters'
import service from '../services'
import openapi from '../services/openapi.js'
// import Bbsbridge from '../js/lib/bbsbridge.js'
import Loader from '../components/loader'
import Validate from '../js/lib/validate.js'
import MessageBox from '../components/message-box'
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
      moduleList: [],
      moduleActive: 0,
      imgList: [],
      post: {
        fid: '',
        title: '',
        content: ''
      },
      addImg: true, //是否显示添加图片图标
      canAddImg: true, //web端是否可上传图片
      canPost: false, //是否可发表帖子
      comstart: false,
      postVote: null, //发起投票信息
      loader: null,
      hasModules: true,
      showAddVote: false
    }
  },
  computed: {
    isApp() {
      return isApp()
    },
    isNewVersion() {
      return Bbsbridge.isCorrectVersion("4.8.0", "1");
    },
    isEmpty() {
      if (this.post.title.trim().length > 0 && this.post.content.trim().length > 0 && this.post.fid) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    headerRightBtnFun() {
      console.info('11111')
    },
    leftBtnFunc() {
      MessageBox({
          message: '返回后内容不会保存，确定要返回吗？',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(action => {
          console.log(action)
          if (action === 'confirm') {
            window.history.back()
          }
        })
        // window.history.back()
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
      if (this.isEmpty) {
        this.canPost = false
      } else {
        this.canPost = true
      }

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

      Bbsbridge.exec('getThumbnail', _count, function(data) {
        // alert("获取缩略图成功！")
        data = JSON.parse(data)
        if (data.code == 200) {
          let _data = data.data
          _data.forEach((item, i) => {
            item.photoContent = "data:img/jpg;base64," + item.photoContent
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

      /* that.execOriginFun(function() {
         Bbsbridge.exec('getThumbnail', _count, function(data) {
           // alert("获取缩略图成功！")
           data = JSON.parse(data)
           if (data.code == 200) {
             let _data = data.data
             _data.forEach((item, i) => {
               item.photoContent = "data:img/jpg;base64," + item.photoContent
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
       })*/
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
      that.loader.show()

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
            if (!that.isEmpty) {
              that.canPost = true
            }
            that.canAddImg = true
            that.loader.hide()
            return
          }
          // that.imgList.push(_img)
          console.info('rst---', rst)
          that.canAddImg = true

          var xhr = new XMLHttpRequest()
          xhr.open('POST', openapi.domain + '/app/index.php')
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
                Toast({
                  message: data.message
                })
              }

            } else {
              // 处理其他情况
              Toast({
                message: '上传失败！'
              })
            }
          }

          xhr.onerror = function() {
            // 处理错误
            Toast({
              message: '上传失败！'
            })
          }

          xhr.onreadystatechange = function() {
            // console.log(xhr.readyState)
            // if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) console.log(xmlhttp.responseText)
            if (xhr.readyState === xhr.DONE) {
              // console.log("done==========",xhr.status)
              if (!that.isEmpty) {
                that.canPost = true
              }
              that.canAddImg = true
              that.loader.hide()

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

          return rst

        })
        .catch(function(error) {
          console.log(error)
        })
        .always(function() {
          // e.target.value = ''
        })
    },
     /* execOriginFun: function(callback) {
        if (isAndroid()) { //如果是android,先缓存
          this.saveDataFun(callback)
        } else {
          callback()
        }
      },*/
      /*//保存 数据
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
      },*/
    titleChangeFun(event) {
      // console.log(this.comstart)
      if (this.comstart) {
        return
      }
      if (this.isEmpty) {
        this.canPost = false
      } else {
        this.canPost = true
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
    contentChangeFunc() {
      if (this.isEmpty) {
        this.canPost = false
      } else {
        this.canPost = true
      }
    },
    postBtnClickFunc() {
      let that = this
      if (this.isApp && this.isNewVersion) {
        let _photos = [];
        for (let i = 0; i < that.imgList.length; i++) {
          let _photo = {
            "photoID": that.imgList[i].photoID,
            "photoOrder": that.imgList[i].photoOrder
          };
          _photos.push(_photo);
        }

        if (_photos.length <= 0) {
          that.goPost();
          return;
        }

        Bbsbridge.exec('uploadPhoto', _photos, function(data) {
          data = JSON.parse(data);
          if (data.code == 200) {
            let _data = data.data;
            // that.imgList.forEach((img,index)=> {
            //  let _atid = _data.filter((d,index) => {return d.photoID == img.photoID});
            //  img.attachID = _atid[0].attachID});
            // console.log(that.imgList);

            for (let i = 0; i < that.imgList.length; i++) {
              let _atid = _data.filter((img, index) => {
                return img.photoID == that.imgList[i].photoID
              });
              that.imgList[i].attachID = _atid[0].attachID;
            }
            that.goPost();
          } else {
            Toast("上传失败！请稍后再试！");
          }
        });
      } else {
        this.postReply()
      }
    },
    goPost() {
      //发表帖子
      // console.info('goPost-------', this.post, this.postVote)
      let that = this
      let reqParam = {
        module: 'newthread',
        fid: that.post.fid,
        subject: that.post.title,
        message: that.post.content
      }
      if(this.postVote && this.postVote.options.length >1) {
        reqParam.special = 1
        reqParam.maxchoices = 1
        // reqParam.polloption = this.postVote
        let polloption = []
        this.postVote.options.forEach((item) => {
          polloption.push(item.text)
        })
        reqParam.polloption = polloption
      }
      for (let i = 0; i < that.imgList.length; i++) {
        reqParam["attachnew[" + that.imgList[i].attachID + "][description]"] = "";
        reqParam.message = reqParam.message + "[attach]" + that.imgList[i].attachID + "[/attach]";
      }
      service.postData('/app/index.php', reqParam).then((response) => {
          let _body = response.body
          if (_body.code === '200') {
            let url = '/sessionlist/' + reqParam.fid
            that.$router.push(url)
          } else {
            let msg = _body && _body.message ||  '发布失败，请稍候尝试！'
            Toast(msg)
          }
        }, (response) => {
          console.info('goPost------fail----', response)
          Toast("发布失败，请稍候尝试！");
          if (that.isEmpty) {
            that.canPost = false
          } else {
            that.canPost = true
          }
        })
        // window.history.back()
    },
    selectModule(fid) {
      //选择模块
      // console.info('fid-----', fid)
      this.post.fid = fid
      this.moduleActive = fid
      if (this.isEmpty) {
        this.canPost = false
      } else {
        this.canPost = true
      }
    },
    showRule() {
      //显示发帖规则
      // window.location.href = 'https://bbs.tuandai.com/thread-103601-1-1.html'
      var url = '/postdetail/103601'
      this.$router.push(url)
    },
    delVoteFunc(data) {
      //删除投票
      this.postVote = ''
      Util.setSessionStorage('postVote', '')
      // this.postVote = data

    },
    getModuleList() {
      let that = this
      service.postData('/app/index.php', {
        module: 'forum',
        action: 'forum_list',
        type: 'post'
      }).then((response) => {
        let _body = response.body
        if (_body.code === '200' && _body.data) {
          let data = _body.data
          that.moduleList = data.list
          that.hasModules = true
        } else {
          let msg = _body && _body.message ||  '获取版块数据失败'
          Toast(msg)
          that.hasModules = false
        }
      }, (response) => {
        console.info('getModuleList----fail--', response)
        let msg = '获取版块数据失败'
        Toast(msg)
        that.hasModules = false
      })
    },
    reloadModules() {
      this.getModuleList()
    }
      /*preventScroll (status) {
        //阻止页面滑动
        console.info('preventScroll----', typeof status)
        if (status === 0) {
          this.isScrollActive = false
        } else {
          this.isScrollActive = true
        }
      }*/
  },
  activated () {
    let data = Util.getSessionStorage('postVote')
    if (data) {
      this.postVote = JSON.parse(data)

      // this.showAddVote = true
      this.$refs.insertTabs && this.$refs.insertTabs.showVoteFunc()
    }
    Util.setSessionStorage('postVote', '')
  },
  mounted () {
    let that = this
    this.loader = Loader()
      // this.getModuleList()
    if (!Validate.checkLogin()) {
      Validate.getLoginInfo(function(result) {
        // console.info('result---', result)
        if (result.isLogined === 1) {
          that.getModuleList()
        } else {
          that.$router.push('/main')
          setTimeout(function() {
            Toast('请登录！')
          }, 1000)
        }

      })
    } else {
      that.getModuleList()
    }

  }


}
</script>

<style lang="scss" scoped>
@import '../sass/post.scss'

</style>

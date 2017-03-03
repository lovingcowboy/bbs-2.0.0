<template>
  <div class="reply-view">
  <zheader 
    :header-title="'详情'" 
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
      <div class="reply-cont">
        <div class="r-head">
          <img :src="replyData.avatar">
          <span><font>{{replyData.author}}：</font><font v-html="replyData.message"></font></span>
        </div>
        <div class="r-input">
          <textarea :class="['input-area',{'warn': showWarn}]" placeholder="请输入…" v-model.trim="replyData.content" id="inputMsg" @blur="blurFun" @input="inputFunc"></textarea>
        </div>
      </div>
      <!-- hasVote:是否显示投票图标；imgList：添加图片列表； addImg：是否显示添加图片图标；canAddImg：web端是否可上传图片；emotionClickFunc：点击表情图片事件；imgDelFunc：删除图片事件；btnClickFunc：发表按钮点击事件；addImgFunc：上传图片-->
       <insert-tabs
        :hasVote="false"
        :imgList="imgList"
        :addImg="addImg"
        :canAddImg="canAddImg"
        :btnActive="canReply"
        @emotionClickFunc="insertEmo"
        @imgDelFunc="delImg"
        @btnClickFunc="postBtnClickFunc"
        @addImgFunc="addImgFunc"
      ></insert-tabs>
    </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
// import Util from '../js/Util.js'
import InsertTabs from '../components/InsertTabs.vue'
import Vue from 'vue'
import openapi from '../services/openapi.js'
import service from '../services'
// import Bbsbridge from '../js/lib/bbsbridge.js'
import { isApp, isAndroid } from '../filters'
import MessageBox from '../components/message-box'
import Validate from '../js/lib/validate.js'
import Loader from '../components/loader'

export default {
  name: 'reply',
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
      imgList: [],
      addImg: true, //是否显示添加图片图标
      canAddImg: true, //web端是否可上传图片
      comstart: false,
      replyData: {
        content: ''
      },
      showWarn: false, //显示错误提示
      canReply: false,
      loader: null
    }
  },
  computed: {
    isApp() {
      return isApp()
    },
    isNewVersion() {
      return Bbsbridge.isCorrectVersion("4.8.0", "1");
    }
  },
  methods: {
    leftBtnFunc() {
      MessageBox({
        message: '返回后内容不会保存，确定要返回吗？',
        showCancelButton: true,
        closeOnClickModal: false
      }).then(action => {
        console.log(action)
        if(action === 'confirm') {
          window.history.back()
        }
      })
      // window.history.back()
    },
    headerRightBtnFun() {
      console.info('11111')
    },
    blurFun(event) {
      let $target = event.currentTarget;
      if ($target.selectionStart || $target.selectionStart == '0') {
        this.selectPostion = {
          'selectionStart': $target.selectionStart,
          'selectionEnd': $target.selectionEnd
        }

      }
      if (this.replyData.content.trim().length > 0) {
        this.canReply = true
      } else {
        this.canReply = false
      }
    },
    inputFunc () {
      console.info('inputFunc')
      if (this.replyData.content.trim().length > 0) {
        this.canReply = true
      } else {
        this.canReply = false
      }
    },
    insertEmo(code) {
      // console.info('insertEmo-----', code)
      //插入表情
      let that = this
      if (code === "close") {
        let _cont = that.replyData.content
        that.replyData.content = _cont.substring(0, _cont.length - 1)
        return
      }
      // console.log(that.replyData, that.replyData.content)
      let $t = document.querySelector('#inputMsg')
      let startPos = that.selectPostion.selectionStart,
        endPos = that.selectPostion.selectionEnd,
        content = that.replyData.content
      that.replyData.content = content.substring(0, startPos) + code + content.substring(endPos, $t.value.length)
        // this.focus()
      // console.log('22222--', that.replyData.content)
      if (this.replyData.content.trim().length > 0) {
        this.canReply = true
      } else {
        this.canReply = false
      }
      Vue.nextTick(function() {
        that.selectPostion = {
          "selectionStart": startPos + code.length,
          "selectionEnd": startPos + code.length
        }
      })
    },
    addImgFunc(e, type) {
      // console.info(e, type)
      if (type === 'app') {
        this.chooseImgFun()
      } else {
        this.chooseImgFunWeb(e)
      }
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
        /*that.execOriginFun(function() {
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
            that.canPost = true
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
              that.canPost = true
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
    execOriginFun(callback) {
      if (isAndroid()) { //如果是android,先缓存
        this.saveDataFun(callback)
      } else {
        callback()
      }
    },
    /*//保存 数据
    saveDataFun(callback) {
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
    /*//清楚缓存数据
    clearDataFun: function() {
      if (this.isApp && isAndroid() && this.isNewVersion) {
        Bbsbridge.exec("setSharePreference", {
          "key": "postdata",
          "value": "",
        }, function(data) {
          data = JSON.parse(data);
          if (data.code == 200) {
            console.log("setSharePreference--success");
          } else {
            Toast('自动保存数据失败！');
          }
        });
        clearInterval(this.saveData);
        this.saveData = null;
      }
    },*/

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
          that.postReply();
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
            that.postReply();
          } else {
            Toast("上传失败！请稍后再试！");
          }
        });
      } else {
        this.postReply()
      }
    },
    postReply() {
      let that = this
      console.info('postReply-------', this.replyData)

      let reqParam = {
        module: 'sendreply',
        fid: that.replyData.fid,
        tid: that.replyData.tid,
        message: that.replyData.content,
        repquote: that.replyData.pid
      }
      for (let i = 0; i < that.imgList.length; i++) {
        reqParam["attachnew[" + that.imgList[i].attachID + "][description]"] = "";
        reqParam.message = reqParam.message + "[attach]" + that.imgList[i].attachID + "[/attach]";
      }
      service.postData('/app/index.php', reqParam).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          window.history.back()
          Util.setSessionStorage('reply', '')
        } else {
          Toast({
            message: _body && _body.message || '回复失败'
          })
        }
      }, (response) => {
        console.info('postReply------fail---', response)
        Toast({
          message: response.body && response.body.message || '回复失败'
        })
      })
        // window.history.back()
      
    }
  },
  beforeMount () {
    let that = this;
    let param = Util.getSessionStorage('reply')
    if (param) {
      param = JSON.parse(param)
      // console.info(param.message)
      let msg = param.message.replace(/<br \/>/g, '')
      msg = msg.replace(/<img .*?>/g, '[图片]')
      console.info('msg---', msg)
      that.replyData = {
        author: param.author,
        avatar: param.avatar,
        message: msg,
        pid: param.pid,
        tid: param.tid,
        fid: param.fid,
        content: ''
      }
      // Util.setSessionStorage('reply', '')
    }
    that.loader = Loader()
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

<style lang="scss">
@import '../sass/reply.scss'

</style>

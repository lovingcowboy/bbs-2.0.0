<template>
  <div class="center-my-view">
    <zheader 
      :header-title="'个人中心'" 
      :has-back="true" 
      :has-rightbtn="false"
      :prevent-back="false"
      :show="true">
    </zheader> 
    <div class="scroll" :class="{'scroll-active': isScrollActive}">  
      <div class="content">
        <div class="contetn-header">
          <div class="btn-edit edit-btn" v-show="!editing" @click="onEdit();"></div>
          <div class="btn-edit-done edit-btn" v-show="editing" @click="onEditDone();">完成</div>
          <div class="btn-edit-cancel edit-btn" v-show="editing" @click="onCancelEdit();">取消</div>

          <div class="avatar-wrapper">
            <div class="avatar-mask" v-show="editing && isApp" @click="chooseImgFun($event)"></div>
            <div class="avatar-mask" v-show="editing && !isApp">
              <!-- <img class="avatar-edit" src="../images/avatar-edit.png" /> -->
               <input id="file" type="file" accept="image/*" class="avatar-input" @change="chooseImgFunWeb($event)" @click="prevenDefault($event)"/>
            </div>
            <img class="avatar" :src="userInfo.avatar" />
          </div>
          <div class="name-wrapper" :class="isEditing" >
            <input class="name-txt" maxlength="30" :readonly ="editing == true ? readonly : ''" v-model="userInfo.username" />
          </div>
          <div class="level-wrapper">
            <div class="icon-level-wrapper">
              <span class="icon-level">{{userInfo.level}}</span>
            </div>
            <div class="level-name">
              <font>LV{{userInfo.level}}</font>
              <span class="point"></span>
              <font>{{userInfo.level_name}}</font>
            </div>
          </div>
          <div class="md">
            <div class="integral md-item">{{userInfo.credit}}积分</div>
            <div class="line"></div>
            <div class="prestige md-item">{{userInfo.prestige}}威望</div>
          </div>
          <div class="label">还差{{userInfo.disparity}}积分升级成为“{{userInfo.next_level_name}}”</div>
        </div>
        <div class="sign-wrapper">
          <div class="sign-text">已连续签到<font>{{userInfo.series_sign_num}}</font>天</div>
          <div class="sign-btn btn-blue" v-show="userInfo.yes_sign == '1' ? false : true" @click="onSign();">马上签到</div>
          <div class="sign-done btn-grey" v-show="userInfo.yes_sign == '1' ? true : false">
            <span class="icon icon-signed"></span>
            <font>已签到</font>
          </div>
        </div>
        <ul class="ubody"  @click="goUItemDetail($event);">
          <li class="urow" data-url="/user/mypost">
            <span class="icon icon-post"></span>
            <font>我的帖子</font>
            <span class="icon-arrow-right"></span>
          </li>
          <li class="urow" data-url="/user/myreply">
            <span class="icon icon-reply"></span>
            <font>我的回复</font>
            <span class="icon-arrow-right"></span>
          </li>
          <li class="urow" data-url="/user/mymessage">
            <span class="icon icon-message"></span>
            <font>我的消息</font>
            <span class="icon-arrow-right"></span>
          </li>
          <li class="urow" data-url="/user/mycollection">
            <span class="icon icon-heart"></span>
            <font>我的收藏</font>
            <span class="icon-arrow-right"></span>
          </li>

          <li class="urow" data-url="/user/changetb">
            <span class="icon icon-coin"></span>
            <font>威望兑团币</font>
            <span class="icon-arrow-right"></span>
          </li>
        </ul>
        <div class="logoutbtn" @click="uiShowLogout();" v-show="!isApp">退出登录</div>
      </div>
    </div>
    <div class="logout-dialog" v-show="isShowDialog"> 
      <div class="masker" v-show="isShowDialog"></div>
      <div class="dialog-content">
        <div class="dialog-title">确定要退出登录吗</div>
        <div class="btn-wrapper">
          <div class="btn-cancel" @click="onCancel();">取消</div>
          <div class="btn-go"  @click="goLogout();">退出</div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Zheader from '../components/Header.vue'
import Toast from '../components/toast'
import Validate from '../js/lib/validate.js'
import Services from '../services'
import { isApp } from '../filters'
import openapi from '../services/openapi.js'
// import Bbsbridge from '../js/lib/bbsbridge.js'
import Loader from '../components/loader'

export default {
  components: {
    Zheader,
    Toast
  },
  data () {
    return {
      isScrollActive: true,
      userInfo: {},
      editing: false,
      isEditing: "",
      canAddImg: true,
      avatarContent: '',
      loader: null
    }
  },
  computed: {
    isApp() {
      return isApp();
    },
    isNewVersion() {
      return Bbsbridge.isCorrectVersion("4.8.0", "1");
    }
  },
  methods: {
    getUserInfo() { //获得用户信息
      let that = this;
      let params = {
        version: 4,
        module: 'member'
      }

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data
          // console.log(data);
          that.userInfo = data.member;
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
      })
    },
    onEdit() {
      this.editing = true;
      this.isEditing = "editing"
      this.lastNickName = this.userInfo.username; 
    },
    onEditDone() {
      let that = this;
      // this.editing = false;
      // this.isEditing = ""
      let nickname = this.userInfo.username;
      if(nickname == this.lastNickName) return; //没有修改昵称

      let params = {
        version: 4,
        module: 'member',
        action: 'alter_nickname',
        nickname: nickname
      }

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          that.editing = false;
          that.isEditing = ""
          that.userInfo.username = nickname;
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
          // that.userInfo.username = that.lastNickName;
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
          // that.userInfo.username = that.lastNickName;
      })
    },
    onCancelEdit() {
      this.editing = false;
      this.isEditing = ""
      this.userInfo.username = this.lastNickName;
    },
    
    onSign() {
      let that = this;
      let params = {
        version: 4,
        module: 'member',
        action: 'sign'
      }

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          let data = _body.data

          let userInfo = that.userInfo;
          let member = data.member;
          
          userInfo.series_sign_num = member.series_sign_num;
          userInfo.yes_sign = 1;
          userInfo.credit = member.credit;
          userInfo.prestige = member.extcredits1;
          userInfo.next_level_name = member.next_group_name;
          userInfo.level_name = member.group_name;
          userInfo.level_name = member.group_level;
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
      })
    },
    goUItemDetail(e) {  
      
      let obj = Util.getElemetByTarget(e.target, 'urow', 'ubody');  //获取点击对象

      if (!obj) return;

      let url = obj.dataset && obj.dataset.url 
      
      if(!url) return;

      this.$router.push(url);
    },

    onCancel() {  //取消
      this.isShowDialog = false;
      this.isScrollActive = true;
    },

    uiShowLogout() {  //确认是否退出
      this.isShowDialog = true;
      this.isScrollActive = false;
    },

    goLogout() {  //登出
      let that = this;
      let params = {
        version: 4,
        module: 'member',
        action: 'logout'
      }

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          that.$router.push("main")

        
        } else {
          Toast({
            "message": _body && _body.message || "请求失败，请稍后重试"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "请求失败，请稍后重试"
          });
      })
    },
    prevenDefault(e) {
      if (!this.canAddImg) {
        e.preventDefault();
      }
    },
    chooseImgFunWeb(e) {
      //web端插入图片
      let that = this
      if (e.target.files.length <= 0) {
        return
      }
      let _file_url = e.target.value
        // let _name = e.target.files[0].name

      // that.canPost = false
      that.canAddImg = false
        // that.$refs.loading.$emit("show")
      that.loader.show()

      lrz(e.target.files[0], {
          "fieldName": "Filedata"
        })
        .then(function(rst) {
         
          if (that.avatarContent === rst.base64) {
            Toast('此头像已存在！')
            that.canAddImg = true
            that.loader.hide()
            return
          }

          var xhr = new XMLHttpRequest()
          xhr.open('POST', openapi.domain + '/app/index.php')
          xhr.onload = function() {
            if (xhr.status === 200) {
              // 上传成功
              var data = xhr.response ? JSON.parse(xhr.response) : {}
              if (data.code == 200) {
                that.userInfo.avatar = data.data.avatar
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
        
            if (xhr.readyState === xhr.DONE) {
              that.canAddImg = true
              that.loader.hide()

            }
          }

          xhr.upload.onprogress = function(e) {
            // 上传进度
            var percentComplete = ((e.loaded / e.total) || 0) * 100
          }

          // 添加参数
          rst.formData.append("version", 4)
          rst.formData.append("module", "uploadavatar")
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
    chooseImgFun(e) {
      //app端插入图片
      let that = this
        // let _count = 9 - that.imgList.length
        // console.info('chooseImgFun----', _count)
      if (isNewVersion) {
        Bbsbridge.exec('getThumbnail', 1, function(data) {
          // alert("获取缩略图成功！")
          data = JSON.parse(data)
          if (data.code == 200) {
            let thumbnailData = data.data
              // _data.forEach((item, i) => {
              //   item.photoContent = "data:img/jpgbase64," + item.photoContent
              // })
            if (thumbnailData.length > 0) {
              that.onUploadAvatar(_data[0].photoUrl);
              /*Bbsbridge.exec('uploadPhoto', thumbnailData, function(data) {
                data = JSON.parse(data);
                if (data.code == 200) {
                  let _data = data.data;
                  that.userInfo.avatar = _data[0].photoUrl
                } else {
                  Toast("上传失败！请稍后再试！");
                }
              });*/
            } else {
              Toast("图片选择失败，请重新尝试！");
            }
          } else {
            Toast('图片选择失败，请重新尝试！')
          }

        })
      }else{
        Toast('app版本过低，请更新版本！')
      }
    },

    onUploadAvatar(imgData) {
      let that = this;
      let params = {
        version: 4,
        module: 'uploadavatar',
        Filedata: imgData
      }

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          that.userInfo.avatar = data.data.avatar
        } else {
          Toast({
            "message": _body && _body.message || "上传失败！请稍后再试！"
          });
        }
      }, (response) => {
          Toast({
            "message": response.body && response.body.message || "上传失败！请稍后再试！"
          });
      })
    }
   
  },
  beforeMount () {
    // this.onUploadAvatar("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkFGMkFENzNDRkM1MTFFNkI5QTVENTE3NTdERThFN0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkFGMkFENzRDRkM1MTFFNkI5QTVENTE3NTdERThFN0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjA4MDk0NkNGQkUxMUU2QjlBNUQ1MTc1N0RFOEU3QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QUYyQUQ3MkNGQzUxMUU2QjlBNUQ1MTc1N0RFOEU3QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlakFzAAAASLSURBVHjazJlbSBZBFMfHzUooDTKTNKMHs8LUJCP1Le3FoBsZXQmiC5ElFEhEVBRkT1pRdIegopu9lJBdTN9S6WoZlUpJ0cUuRFZUWtr/5H9rtW9v37dfeuDH6rczZ/47M3tm5mzIsJMdyk/rBzLAZJAMEsAwMJD3P4NXoB7cA5WgCrQanbyc76yxED+EpoKVIBcMdln3AygBB8AdN0JDXTSSAgpBjjwgf6sD19hTj8Bz9qRiz8aB0SATZINxYAVYDi6BDaDWqx4No8A1fLAv4BA4Cu677NEksIRiB4AfYK8IRs9+C0RoPIdqPPgJ9oFt4J0KzCLBFrAK9AF3wRyIbTSroFk4mwiuU2QDX5x8D0SKvaevdPqWNqpjTqlJboVKhQoQBcpAGrihvLeb9F3GXi43E6uZDHcpX4YzYAZoUUEyDHcL2zjDNkshNt5OaBjnZBTFLgZtKsgGsW1sq5Rtl0BsmJXQQs4XmdSLugfnIIttZZuN1LDdTGgKQ5C83fOCOdw202AeNeSjV5N9CS1knNwPbqkeMoi9xTAYSk1dhKZyxZFVZavqedtGLVPRq6lGoXlcFo84iJPyQC9JjovGHddDr4qGw9SUp69M/XFtBoO4xNXZjQ53SYq7oxino+qrntmmBD2ZSC0fQbTG4C4iHzgQ+c8S7OfQhjiYq7oe0TZJhGbx3lWHjSwDr8ELsNSFOH/qlfOaFcqwJFbtsPJFwxC6MX/q6ZpSNO7MxR6q3me6pgQRGm2Y7L3NXvD6+2UK5z+feqFQXVO4cWXqUL3YNIPqCItyl/kguR62PVt8Il5esijzZ7Q1BntlE7greJ3poVDdV6VFmVhemzWeu8XGWlSQTW27nGvAcA9ExtJXO32b2Rhe6zXDcTXdokITOMukQ7EHQncCWbrPYgVqsiina6rVDMM6xcb5eu5opCcKAhBZQB+f6dPKdE2VIrSGC78kBxItKj1j4kBeqh1gtR8i81i3g76emRXkpiSJG/hqEfodnON9uzX4NFjLTcUe1ot3IFDPD+xlpCmgLyvTtZRgenzX4+g+XuUph9g42A1mMazN5q7rBP8eCfqSkfztBMvkcrjlXFRk1QB6cwi1KJ44/mycb4MrPK5udtBDFzhVTvPIsJC9+5QHwlb+fY73QllWhvOkA/+bqOUKjyZdUjrjmWQI4R7V6blpBFjA9KMIGcrf37AnKxkxnpjsO7v35gS+NyIsDfdrfeWeijkHG5jBCPpJ1CgUIiOYPRklIQz31pmd6zcyYSUFj3Ou/ReDyL5scxRj+0arBMRXxri3YDo49j/EGkROZ9u56M2vdrknyVRMU515UEkGnLfZsAQqMoJtzGWb03ylH82yeTKZs5kezDFk3by2NPrOYVvZEFnjJu2oi80wzNkqxtBIDwRG0lcVfUsbmWYi7YQq9TeBu4v/53ODUsQ46tYSWbeJvhR9Z0BkveX52sVXkRSu08YsRx2PtNIzj1Xnx4ZPhk1vHA+PmdxgGB9Okrcb9Dhpmwjooc83B7kaBvU7k27dP4iNVr4/iElPB/xB7JcAAwDXvEScfVHfFQAAAABJRU5ErkJggg==");
    // this.getUserInfo();  //获取用户信息
    let that = this
    this.loader = Loader()
    let uid = Util.getSessionStorage('uid')
    let isLogined_cookie = Validate.getCookie('voHF_b718_auth')
    if (!uid && !isLogined_cookie) {
      Validate.getLoginInfo(function(result) {
        // console.info('result---', result)
        if(result.isLogined === 1) {
          that.getUserInfo()
        }else{
          that.$router.push('/main')
          setTimeout(function() {
            Toast('请登录！')
          }, 1000)
        }
        
      })
    } else {
      that.getUserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/centermy.scss";

</style>

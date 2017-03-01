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
      return Bbsbridge.isCorrectVersion('4.8.0', '1');
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
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });
      })
    },
    onEdit() {
      this.editing = true;
      this.isEditing = 'editing'
      this.lastNickName = this.userInfo.username; 
    },
    onEditDone() {
      let that = this;
     
      let nickname = this.userInfo.username;
      if(nickname == this.lastNickName) {//没有修改昵称
        that.editing = false;
        that.isEditing = '';
        return; 
      }
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
          that.isEditing = '';
          that.userInfo.username = nickname;
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
          });
      })
    },
    onCancelEdit() {
      this.editing = false;
      this.isEditing = '';
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

          Toast({
            'message': _body && _body.message || '签到成功'
          });
          
        } else {
          Toast({
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
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
            'message': _body && _body.message || '请求失败，请稍后重试'
          });
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '请求失败，请稍后重试'
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
          'fieldName': 'Filedata'
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
          rst.formData.append('version', 4)
          rst.formData.append('module', 'uploadavatar')
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
      
      if (that.isNewVersion) {
        Bbsbridge.exec('getThumbnail', 1, function(data) {
          data = JSON.parse(data)
          if (data.code == 200) {
            let thumbnailData = data.data
            if (thumbnailData.length > 0) {
              // 去除data:image/png;base64,前缀
              that.onUploadAvatar(_data[0].photoUrl.substring('data:image/png;base64,'.length), 'app');
            } else {
              Toast('图片选择失败，请重新尝试！');
            }
          } else {
            Toast('图片选择失败，请重新尝试！')
          }
        })
      }else{
        Toast('app版本过低，请更新版本！')
      }
    },

    onUploadAvatar(imgData, from) {
      let that = this;
      let params = {
        version: 4,
        module: 'uploadavatar'
      }

      let param = from === 'app' ? 'base64Data' : 'Filedata'; //app上传图片参数与web上传图片参数不一样
      params[param] = imgData;

      Services.postData('/app/index.php', params).then((response) => {
        let _body = response.body
        if (_body.code === '200') {
          that.userInfo.avatar = _body.data.avatar
        } else {
          Toast({
            'message': _body && _body.message || '上传失败！请稍后再试！'
          });
        }
      }, (response) => {
          Toast({
            'message': response.body && response.body.message || '上传失败！请稍后再试！'
          });
      })
    }
   
  },
  beforeMount () {
    let that = this
    this.loader = Loader()
    if (!Validate.checkLogin()) {
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

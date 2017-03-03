<template>
<div>
<div class="insert-tabs">
  <i :class="['icon-emoji', {'active': showEmotion}]" @click="triggerEmotion"></i>
  <i :class="['icon-image', {'active': showImgList}]" @click="triggerImg"></i>
  <i :class="['icon-vote', {'active': showVote}]" v-show="hasVote" @click="triggerVote">（投票）</i>
  <div :class="['btn-send', 'btn-blue', {'btn-disable': !btnActive}]" @click="btnClickFunc">发表</div>
</div>
<section class="emotions" v-show="showEmotion">
  <swipe :auto="0" :speed="100">
    <swipe-item v-for="page in emotions" class="emocont">
      <div v-for="row in page.rows" class="emorow">
        <div v-for="item in row.emotions" :data-code="item.code" @click="emotionClickFunc(item.code)">
          <i :class="['icon-emotion', item.emotion]"></i>
        </div>
      </div>
    </swipe-item>
  </swipe>
</section>
<section id="imgs" class="imgs" v-show="showImgList">
  <ul class="img-container" id="">
    <li v-for="(img, index) in imgList">
      <!-- <img :src="img.photoUrl"> -->
      <img :src="img.photoContent">
      <i class="icon-del" @click="imgDelFunc(index)"></i>
    </li>
    <li class="img-add" v-show="isApp && addImg" @click="addImgFunc($event, 'app')"></li>
    <li class="img-add"  v-show="addImg && !isApp" >
      <input id="file" type="file" accept="image/*"  @change="addImgFunc($event, 'web')" @click="prevenDefault($event)"/>
    </li>
  </ul>
</section>
<section class="show-vote-container" v-show="showVote">
  <ul class="sv-bg" v-if="postVote">
    <!-- <li class="sv-title">{{postVote.title}}</li> -->
    <li class="sv-option" v-for="opt in postVote.options"><i class="sv-radio"></i>{{opt.text}}</li>
    <li class="sv-btns">
      <div class="sv-btn-edit" @click="editVote"><i class="sv-icon-edit"></i><i class="sv-btn-text">编辑</i></div>
      <div class="sv-btn-del" @click="delVote"><i class="sv-icon-del"></i><i class="sv-btn-text">删除</i></div>
    </li>
  </ul>
</section>
<!-- <div class="add-vote-container" v-show="showAddVote">
<div class="avc-scroll">
  <header id="header" class="header-bar"><i class="icon-back" @click="completeAddVote('cancle')"></i>发帖</header>
  <section class="add-vote">
    <div class="v-title">
      <input type="text" name="vtitle" placeholder="请输入投票标题" v-model.trim="addVoteData.title"/>
    </div>
    <div class="v-option v-row" v-for="(opt, index) in addVoteData.options">
      <div @click="delVoteOption(index)"><i class="icon-del"></i></div>
      <div>
        <input type="text" name="options" placeholder="请输入投票选项信息" v-model.trim="addVoteData.options[index].text" :value="opt.text"/>
      </div>
    </div>
    <div class="v-bottom v-row">
      <span class="v-add" @click="addVoteOption">添加选项</span>
      <span class="v-save v-btn" @click="completeAddVote('save')">保存</span>
      <span class="v-cancle v-btn" @click="completeAddVote('cancle')">取消</span>
    </div>
  </section>
</div>
</div> -->
 
</div>
</template>
<script>
import Swipe from '../components/swipe'
import SwipeItem from '../components/swipe-item'
import { isApp } from '../filters'
import Util from '../js/Util.js'
import Toast from '../components/toast'
export default {
	name: 'insertTabs',
  components: {
    Swipe,
    SwipeItem,
    Toast
  },
  data () {
    return {
      showEmotion: false,
      showImgList: false,
      // showAddVote: false,
      showVote: false,
      addVoteData: {
        title: '',
        options: [{
          id: 0,
          text: ''
        },{
          id: 1,
          text: ''
        }]
      },
      emotions: [{
        "pid": "page1",
        "rows": [{
          "rid": "row1",
          "emotions": [{
            "eid": "e11",
            "emotion": "sprite-icon-biggrin",
            "code": ":D"
          }, {
            "eid": "e12",
            "emotion": "sprite-icon-cry",
            "code": ":'("
          }, {
            "eid": "e13",
            "emotion": "sprite-icon-curse",
            "code": ":curse:"
          }, {
            "eid": "e14",
            "emotion": "sprite-icon-dizzy",
            "code": ":dizzy:"
          }, {
            "eid": "e15",
            "emotion": "sprite-icon-funk",
            "code": ":funk:"
          }, {
            "eid": "e16",
            "emotion": "sprite-icon-tongue",
            "code": ":P"
          }, {
            "eid": "e17",
            "emotion": "sprite-icon-huffy",
            "code": ":@"
          }]
        }, {
          "rid": "row2",
          "emotions": [{
            "eid": "e21",
            "emotion": "sprite-icon-sweat",
            "code": ":L"
          }, {
            "eid": "e22",
            "emotion": "sprite-icon-smile",
            "code": ":)"
          }, {
            "eid": "e23",
            "emotion": "sprite-icon-lol",
            "code": ":lol"
          }, {
            "eid": "e24",
            "emotion": "sprite-icon-loveliness",
            "code": ":loveliness:"
          }, {
            "eid": "e25",
            "emotion": "sprite-icon-mad",
            "code": ":Q"
          }, {
            "eid": "e26",
            "emotion": "sprite-icon-sad",
            "code": ":("
          }, {
            "eid": "e27",
            "emotion": "sprite-icon-shocked",
            "code": ":o"
          }]
        }, {
          "rid": "row3",
          "emotions": [{
            "eid": "e31",
            "emotion": "sprite-icon-shutup",
            "code": ":shutup:"
          }, {
            "eid": "e32",
            "emotion": "sprite-icon-shy",
            "code": ":$"
          }, {
            "eid": "e33",
            "emotion": "sprite-icon-sleepy",
            "code": ":sleepy:"
          }, {
            "eid": "e34",
            "emotion": "sprite-icon-titter",
            "code": ";P"
          }, {
            "eid": "e35",
            "emotion": "sprite-icon-kiss",
            "code": ":kiss:"
          }, {
            "eid": "e36",
            "emotion": "sprite-icon-hug",
            "code": ":hug:"
          }, {
            "eid": "e37",
            "emotion": "sprite-icon-close",
            "code": "close"
          }]
        }]
      }, {
        "pid": "page2",
        "rows": [{
          "rid": "row4",
          "emotions": [{
            "eid": "e41",
            "emotion": "sprite-icon-handshake",
            "code": ":handshake"
          }, {
            "eid": "e42",
            "emotion": "sprite-icon-victorry",
            "code": ":victory:"
          }, {
            "eid": "e47",
            "emotion": "sprite-icon-close",
            "code": "close"
          }]
        }]
      }]
    }
  },
  computed: {
    isApp: function() {
      return isApp()
    }
  },
	props: ['hasVote', 'imgList', 'addImg', 'canAddImg', 'postVote', 'btnActive'],
	methods: {
    triggerEmotion() {
      this.showEmotion = !this.showEmotion
      this.showImgList = false
      this.showVote = false
    },
    emotionClickFunc(code) {
      // console.info('code-----', code)
      this.$emit('emotionClickFunc', code)
    },
    triggerImg() {
      this.showEmotion = false
      this.showImgList = !this.showImgList
      this.showVote = false
        // this.$emit('imgClickFunc')
    },
    imgDelFunc(index) {
      this.$emit('imgDelFunc', index)
    },
    btnClickFunc() {
      if (this.btnActive) {
        this.$emit('btnClickFunc')
      }

    },
    prevenDefault(e) {
      console.info('prevenDefault---', this.canAddImg)
      if (!this.canAddImg) {
        e.preventDefault();
      }
    },
    addImgFunc(e, type) {
      console.info('-----addImgFunc')
      this.$emit('addImgFunc', e, type)
    },
    triggerVote() {
      // this.showAddVote = !this.showAddVote
      this.showEmotion = false
      this.showImgList = false
      if (!this.postVote || this.postVote === '') {
        // this.showAddVote = true
        // this.showVote = true
        Util.setSessionStorage('postVote', '')
        this.$router.push('/post/addvote')
      } else {
        this.showVote = !this.showVote
      }
    },
    showVoteFunc () {
      this.showVote = true
    },
    editVote() {
      //编辑投票
      let data = ''
      if (this.postVote) {
        // let data = this.postVote
        data = Util.myExtend(this.postVote);
        this.addVoteData = data
          // this.addVoteData = this.postVote
        Util.setSessionStorage('postVote', JSON.stringify(data))
      }
      // this.showAddVote = true
      // this.showVote =false

      this.$router.push('/post/addvote')
    },
    delVote() {
      //删除投票
      // this.postVote = {
      //   title: '',
      //   options: [{
      //     id: 0,
      //     text: ''
      //   }, {
      //     id: 1,
      //     text: ''
      //   }]
      // }
      // this.$emit('addVoteFunc', '')
      this.$emit('delVoteFunc', '')
      this.showVote = false
    }

	},

  mounted() {
  }

}
</script>
<style lang="scss">
@import "../sass/variables.scss";
@import "../sass/func.scss";
.insert-tabs {
  width: 100%;
  height: pxToRem(90px);
  line-height: pxToRem(90px);
  background-color: $color-white;
  border-top: 1px solid $border-color;
  padding: 0 pxToRem(30px);
  font-size: 0;
  white-space: nowrap;
  position: relative;
  i {
    width: pxToRem(110px);
    height: 100%;
    background-repeat: no-repeat;
    background-position: pxToRem(10px) center;
    vertical-align: text-bottom;
  }
  .icon-image {
    background-image: url('../images/icon-image.png');
    background-size: pxToRem(42px) pxToRem(34px);
    &.active {
      background-image: url('../images/icon-image-selected.png') !important;
    }
  }
  .icon-emoji {
    background-image: url('../images/icon-emoji.png');
    background-size: pxToRem(42px) pxToRem(42px);
    &.active {
      background-image: url('../images/icon-emoji-selected.png') !important;
    }
  }
  .icon-vote {
    background-image: url('../images/icon-vote.png');
    background-size: pxToRem(42px) pxToRem(37px);
    font-size: pxToRem(34px);
    color: $txt-color-grey;
    width: pxToRem(150px);
    padding-left: pxToRem(52px);
    &.active {
      background-image: url('../images/icon-vote-selected.png') !important;
    }
  }
  .btn-send {
    width: pxToRem(100px) !important;
    height: pxToRem(55px) !important;
    line-height: pxToRem(55px) !important;
    position: absolute;
    top: 50%;
    right: pxToRem(30px);
    margin-top: pxToRem(-28px);
  }
}
.triangle {
  position: relative;
  &:before,
  &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
  }
  &:before {
      border-left: pxToRem(16px) solid transparent;
      border-right: pxToRem(16px) solid transparent;
      border-bottom: pxToRem(16px) solid $border-color;
      // left: pxToRem(46px);
      top: pxToRem(-16px);
  }
  &:after {
      border-left: pxToRem(16px) solid transparent;
      border-right: pxToRem(16px) solid transparent;
      border-bottom: pxToRem(16px) solid #fafafa;
      // left: pxToRem(46px);
      top: pxToRem(-14px);
  }
}
.emotions {
      border-radius: pxToRem(5px);
      -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
      // display: flex;
      align-items: center;
      background-color: #fafafa;
      width: 100%;
      // min-height: pxToRem(100px);
      height: pxToRem(420px);
      // padding: pxToRem(56px) pxToRem(52px);
      @extend .triangle;
      &:before, &:after {
        left: pxToRem(46px);
      }
      
  }
  .emocont {
      padding-top: pxToRem(56px);
      box-sizing: border-box;
      .emorow {
          display: flex;
          margin-left: pxToRem(52px);
          margin-right: pxToRem(52px);
          width: pxToRem(646px);
          &:not(:last-child) {
              margin-bottom: pxToRem(58px);
          }
          &>div {
              width: 14.3%;
              text-align: center;
          }
          .icon-emotion {
            margin:0 auto;
          }
         
      }
  }

.imgs {
  width: 100%;
  padding-top: pxToRem(40px);
  background-color: #f2f2f0;
  @extend .triangle;
  &:before, &:after {
    left: pxToRem(150px);
  }
  &:after {
    border-bottom: pxToRem(16px) solid #f2f2f0 !important;
  }
}
.img-container {
  width: 100%;
  font-size: 0;
  li {
    display: inline-block;
    width: pxToRem(146px);
    height: pxToRem(146px);
    margin-left: pxToRem(30px);
    position: relative;
    margin-bottom: pxToRem(30px);
    vertical-align: bottom;
    img {
      width: 100%;
      height: 100%;
    }
    .icon-del {
      position: absolute;
      top: pxToRem(-16px);
      right: pxToRem(-12px);
      width: pxToRem(46px);
      height: pxToRem(44px);
      border: pxToRem(2px) solid $color-white;
    }
  }
  .img-add {
    border: 2px dashed $txt-color-grey;
    font-size: pxToRem(60px);
    color: $txt-color-grey;
    background-image: url('../images/icon-plus.png');
    background-size: pxToRem(50px) pxToRem(50px);
    background-repeat: no-repeat;
    background-position: center;
    #file {
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      opacity:0;
      z-index:9;
    }
  }
}


.icon-del {
  border-radius: 50%;
  background-color: #fa4c2f;
  &:before {
    content: '';
    width: pxToRem(18px);
    height: pxToRem(2px);
    background-color: $color-white;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: pxToRem(-9px);
    // margin-top: pxToRem(-2px);
  }
}

// .add-vote-container {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   right: 0;
//   bottom: 0;
//   background-color: $color-white-light;
//   z-index: 889;
//   padding-top: pxToRem(90px);
//   overflow: hidden;
//   .avc-scroll {
//     width: 100%;
//     height: 100%;
//     overflow: scroll;
//     padding: pxToRem(60px) 0 pxToRem(30px) 0;
//   }
// }
// .add-vote {
//   width: pxToRem(692px);
//   min-height: pxToRem(388px);
//   background-color: $color-white;
//   border-radius: pxToRem(10px);
//   margin: auto;
//   &>div {
//     width: 100%;
//     padding: 0 pxToRem(30px);
//   }
//   input {
//     width: 100%;
//     height: 100%;
//     color: $txt-color-black;
//   }
//   input::-webkit-input-placeholder {
//     color: $txt-color-grey;
//   }
//   .v-title {
//     height: pxToRem(110px);
//     input {
//       font-size: pxToRem(36px);
//       font-weight: bolder;
//     }
//   }
//   .v-icon {
//     width: pxToRem(36px);
//     height: pxToRem(36px);
//     position: absolute;
//     left: 0;
//     top: 50%;
//     margin-top: pxToRem(-18px);
//   }
//   .v-option {
//     font-size: 0;
//     white-space: nowrap;
//     &>div {
//       display: inline-block;
//       height: 100%;
//       vertical-align: bottom;
//     }
//     &>div:first-child {
//       width: pxToRem(60px);
//       position: relative;
//     }
//     &>div:last-child {
//       width: pxToRem(570px);
//     }
//     input {
//       font-size: pxToRem(30px);
//     }
//     .icon-del {
//       @extend .v-icon;
//     }
//   }

//   .v-row {
//     width: 100%;
//     height: pxToRem(90px);
//     line-height: pxToRem(90px);
//     // padding-left: pxToRem(90px);
//     border-top: 1px dashed $border-color;
//   }
//   .v-bottom {
//     font-size: pxToRem($font-size-normal);
//   }
//   .v-add {
//     height: 100%;
//     width: pxToRem(250px);
//     padding-left: pxToRem(60px);
//     position: relative;
//     color: $txt-color-blue;
//     &:before {
//       content: "";
//       background-color: $txt-color-blue;
//       border-radius: 50%;
//       @extend .v-icon;
//       z-index: 100;
//     }
//     &:after {
//       content: "";
//       @include background('../images/icon-plus-white.png', 18px, 18px);
//       position: absolute;
//       left: pxToRem(10px);
//       top: 50%;
//       // margin-left: pxToRem(-9px);
//       margin-top: pxToRem(-9px);
//       z-index: 101; 
//     }
//   }
//   .v-btn {
//     width: pxToRem(120px);
//     text-align: right;
//     float: right;
//   }
//   .v-cancle {
//     color: $txt-color-grey;
//   }
//   .v-save {
//     color: $txt-color-blue;
//   }
// }
.show-vote-container {
  width: 100%;
  padding: pxToRem(30px) 0;
  background-color: #f2f2f0;
  @extend .triangle;
  &:before, &:after {
    left: pxToRem(264px);
  }
  &:after {
    border-bottom: pxToRem(16px) solid #f2f2f0 !important;
  }
  .sv-bg {
    width: pxToRem(690px);
    min-height: pxToRem(360px);
    background-color: $color-white;
    border-radius: pxToRem(10px);
    box-shadow: 0px pxToRem(4px) pxToRem(20px) 0px rgba( 0, 0, 0, .15 );
    margin: auto;
    padding-top: pxToRem(30px);
    &>li {
      width: 100%;
      padding: 0 pxToRem(30px);
    }
  }
  .sv-title {
    font-size: pxToRem($font-size-normal-small);
    color: $txt-color-black;
    font-weight: bolder;
  }
  .sv-option {
    min-height: pxToRem(40px);
    margin-top: pxToRem(50px);
    line-height: pxToRem(40px);
    font-size: pxToRem($font-size-normal-small);
    // padding: 0 pxToRem(30px);
    color: $txt-color-grey-dark;
    .sv-radio {
      width: pxToRem(36px);
      height: pxToRem(36px);
      border-radius: 50%;
      border: pxToRem(2px) solid #e7e7e7;
      margin-right: pxToRem(30px);
      vertical-align: text-bottom;
    }
  }
  .sv-btns {
    margin-top: pxToRem(50px);
    border-top: 1px solid $border-color;
    font-size: 0;
    white-space: nowrap;
    // padding: 0 pxToRem(30px);
    height: pxToRem(90px);
    line-height: pxToRem(90px);
    &>div {
      width: 50%;
      text-align: center;
      font-size: pxToRem($font-size-normal-small);
      display: inline-block;
    }
    i {
      margin-right: pxToRem(20px);
      vertical-align: middle;
    }
    .sv-btn-text {
      line-height: pxToRem($font-size-normal-small);
    }
    .sv-btn-edit {
      color: $txt-color-blue;
    }
    .sv-btn-del {
      color: #fa4c2f;
    }
    .sv-icon-edit {
      @include background('../images/icon-edit-blue.png', 25px, 26px);
    }
    .sv-icon-del {
      @include background('../images/icon-del.png', 30px, 27px);
    }
  }
}




/* emotionsprite */
.emotion-sprite {
  display: block;
  background-image: url('../images/emotionsprite.png');
  background-repeat:no-repeat;
  background-size:pxToRem(360px) pxToRem(360px);
}
.sprite-icon-biggrin {
  @extend .emotion-sprite;
  background-position: pxToRem(-76px) pxToRem(0px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-close {
 @extend .emotion-sprite;
  background-position: pxToRem(-152px) pxToRem(-304px);
  width: pxToRem(62px);
  height: pxToRem(52px);
}
.sprite-icon-cry {
  @extend .emotion-sprite;
  background-position: pxToRem(0px) pxToRem(-76px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-curse {
  @extend .emotion-sprite;
  background-position: pxToRem(-76px) pxToRem(-76px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-dizzy {
  @extend .emotion-sprite;
  background-position: pxToRem(-152px) pxToRem(0px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-funk {
  @extend .emotion-sprite;
  background-position: pxToRem(-152px) pxToRem(-76px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-handshake {
  @extend .emotion-sprite;
  background-position: pxToRem(0px) pxToRem(-152px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-huffy {
  @extend .emotion-sprite;
  background-position: pxToRem(-76px) pxToRem(-152px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-hug {
  @extend .emotion-sprite;
  background-position: pxToRem(-152px) pxToRem(-152px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-kiss {
  @extend .emotion-sprite;
  background-position: pxToRem(-228px) pxToRem(0px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-lol {
  @extend .emotion-sprite;
  background-position: pxToRem(-228px) pxToRem(-76px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-loveliness {
  @extend .emotion-sprite;
  background-position: pxToRem(0px) pxToRem(0px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-mad {
  @extend .emotion-sprite;
  background-position: pxToRem(0px) pxToRem(-228px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-sad {
  @extend .emotion-sprite;
  background-position: pxToRem(-76px) pxToRem(-228px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-shocked {
  @extend .emotion-sprite;
  background-position: pxToRem(-152px) pxToRem(-228px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-shutup {
  @extend .emotion-sprite;
  background-position: pxToRem(-228px) pxToRem(-228px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-shy {
  @extend .emotion-sprite;
  background-position: pxToRem(-304px) pxToRem(0px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-sleepy {
  @extend .emotion-sprite;
  background-position: pxToRem(-304px) pxToRem(-76px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-smile {
  @extend .emotion-sprite;
  background-position: pxToRem(-304px) pxToRem(-152px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-sweat {
  @extend .emotion-sprite;
  background-position: pxToRem(-304px) pxToRem(-228px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-titter {
  @extend .emotion-sprite;
  background-position: pxToRem(0px) pxToRem(-304px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-tongue {
  @extend .emotion-sprite;
  background-position: pxToRem(-228px) pxToRem(-152px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.sprite-icon-victorry {
  @extend .emotion-sprite;
  background-position: pxToRem(-76px) pxToRem(-304px);
  width: pxToRem(56px);
  height: pxToRem(56px);
}
.btn-disable {
  opacity: .3;
}

</style>

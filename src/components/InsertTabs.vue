<template>
<div>
<div class="insert-tabs">
  <i class="icon-image" @click="imgClickFunc"></i>
  <i class="icon-emoji" @click="triggerEmotion()"></i>
  <i class="icon-vote" v-show="hasVote">（投票）</i>
  <div class="btn-send btn-blue" @click="btnClickFunc">发表</div>
</div>
<section id="imgs" class="imgs">
  <ul class="img-container" id="">
    <li>
      <img src="../images/img.png">
      <i class="icon-del">a</i>
    </li>

  </ul>
</section>
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
 <!-- <section id="imgs" v-show="showImgList">
            <ul class="img-container" id="img_container">
              <li v-for="(index,img) in imgList" track-by="photoID">
                  <img :src="img.photoContent">
                  <div class="close-part" @click="delImg(index)">
                    <i class="icon-close"></i>
                  </div>
              </li>
              <li class="add-img" @click="chooseImgFun" v-show="addImg && isApp && isNewVersion">
              </li>
              <li class="add-img"  v-show="addImg && (!isApp || !isNewVersion)" >
                <input id="file" type="file" accept="image/*"  @change="chooseImgFunWeb($event)" @click="prevenDefault($event)"/>
              </li>
          </ul>
          </section> -->
</div>
</template>
<script>
import Swipe from '../components/swipe'
import SwipeItem from '../components/swipe-item'
export default {
	name: 'insertTabs',
  components: {
    Swipe,
    SwipeItem
  },
  data () {
    return {
      showEmotion: false,
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
	props: ['hasVote'],
	methods: {
		triggerEmotion () {
      this.showEmotion = !this.showEmotion
    },
    emotionClickFunc (code) {
      // console.info('code-----', code)
      this.$emit('emotionClickFunc', code)
    },
    imgClickFunc () {
      this.showEmotion = false
      this.$emit('imgClickFunc')
    },
    btnClickFunc () {
      this.$emit('btnClickFunc')
      
    }
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
  }
  .icon-emoji {
    background-image: url('../images/icon-emoji.png');
    background-size: pxToRem(42px) pxToRem(42px);
  }
  .icon-vote {
    background-image: url('../images/icon-vote.png');
    background-size: pxToRem(42px) pxToRem(37px);
    font-size: pxToRem(34px);
    color: $txt-color-grey-light;
    width: pxToRem(150px);
    padding-left: pxToRem(52px);
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
      position: relative;
      // padding: pxToRem(56px) pxToRem(52px);
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
          left: pxToRem(156px);
          top: pxToRem(-16px);
      }
      &:after {
          border-left: pxToRem(16px) solid transparent;
          border-right: pxToRem(16px) solid transparent;
          border-bottom: pxToRem(16px) solid #fafafa;
          left: pxToRem(156px);
          top: pxToRem(-14px);
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
.imgs {
  width: 100%;
  padding-top: pxToRem(40px);
  background-color: transprent;
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
    img {
      width: 100%;
      height: 100%;
    }
    .icon-del {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
.icon-del {
  width: pxToRem(46px);
  height: pxToRem(44px);
  line-height: pxToRem(44px);
  border-radius: 50%;
  border: pxToRem(2px) solid $color-white;
  background-color: #fa4c2f;
  font-size: pxToRem(40px);
  color: $color-white;
  text-align: center;
}


</style>

<template>
<li class="post-row c-event" data-type="itemclick" :data-id="data.tid">
    <slot name="itemhead"></slot>
    <div class="item-desc">
        <div :class="['post', {'no-img': !data.cover || data.cover == ''}]">
            <p data-type="itemclick" :class="{'pi-title': +line > 1}">{{data.subject}}</p>
            <p data-type="itemclick" v-show="data.message">{{data.message}}</p>
        </div>
        <div class="p-img" v-show="data.cover && data.cover != ''">
          <img :src="data.cover" class="img-cover">
        </div>
    </div>
    <slot name="itemMessage"></slot>
   <!--  <div class="item-message">
        <div class="item-u">
            <img :src="data.avatar" class="i-avator">
            <font class="i-name">{{data.nickname, 3 | ellipsisText}}</font>
            <font v-if="data.first == '0'">回复了帖子</font>
            <font v-else>发表了帖子</font>
            <font>|</font>
            <font v-html="data.dateline"></font>
        </div>
        <div class="item-m">
          <div class="post-view">
            <i class="icon-view"></i>
            <span>{{data.views}}</span>
          </div>
          <div class="post-reply">
            <i class="icon-reply"></i>
            <span>{{data.replies}}</span>
          </div>
        </div>
    </div> -->
</li>
</template>
<script>
import {ellipsisText} from '../filters'
export default {
  
	name: 'postItem',
	props: ['data', 'index', 'line'],
	methods: {
		// onItemClick () {
		// 	this.$emit('onItemClick')
		// },
    // onUserClick () {
    //   this.$emit('onUserClick')
    // }
	}
}
</script>
<style lang="scss">
@import "../sass/variables.scss";
@import "../sass/func.scss";
.post-list {
  width: 100%;
  min-height: 100%;
  background-color: $color-white;
  padding-left: pxToRem(30px);
  font-size: 0;
  position: relative;
  // margin-top: pxToRem(20px);
  &>li:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }
   .post-row {
    width: 100%;
    padding: pxToRem(40px) pxToRem(30px) pxToRem(40px) 0;
    white-space: normal;
  }
}

.item-title {
  height: pxToRem(42px);
  line-height: pxToRem(42px);
  white-space: nowrap;
  &>span{
    // font-size: pxToRem(24px);
    font-size: pxToRem($font-size-small);
    color: $txt-color-grey;
    vertical-align: middle;
  }
  &>span:first-child {
    width: 60%;
    font {
      color: $txt-color-black;
      margin-right: pxToRem(10px);
    }
    &>font:last-child {
      color: $txt-color-grey
    }
  }
  &>span:last-child {
    width: 39.9%;
    text-align: right;
  }
  img {
    width: pxToRem(42px);
    height: pxToRem(42px);
    border-radius: pxToRem(42px);
    vertical-align: middle;
    margin-right: pxToRem(20px);
  }
 
}
.item-desc {
  width: 100%;
  // white-space: nowrap;
  // margin: pxToRem(40px) 0;
  margin-bottom: pxToRem(30px);
  font-size: 0;
  .no-img {
    width: 100% !important;
  }
  .post {
    display: inline-block;
    // width: pxToRem(470px);
    width: pxToRem(540px);
    // font-size: pxToRem($font-size-large);
    vertical-align: middle;
    p {
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; 
    }
    &>p:first-child {
      font-size: pxToRem($font-size-normal);
      color: $txt-color-black;
      line-height: pxToRem(48px);
      font-weight: bold;
    }
    &>p:last-child {
      font-size: pxToRem($font-size-small);
      color: $txt-color-grey;
      line-height: pxToRem(34px);
      margin-top: pxToRem(30px);
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;

    }
    .pi-title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
    }
  }

  .p-img {
    display: inline-block;
    // width: pxToRem(240px);
    width: pxToRem(150px);
    text-align: right;
    vertical-align: top;
    white-space: nowrap;
    // position: relative;
    .img-cover {
      width: pxToRem(110px);
      height: pxToRem(110px);
      // background-position: 50% 50%;
      // background-size: cover;
      // background-repeat: no-repeat;
      // margin-left: pxToRem(40px);
      float: right;
    }
  }
}
.item-message {
  width: 100%;
  // color: $txt-color-grey;
  font-size: 0;
  color: #aaa;
  white-space: nowrap;
  * {
    vertical-align: middle;
  }
  div{
    display: inline-block;
  }
  .item-u {
    width: 69.8%;
    .i-avator {
      width: pxToRem(42px);
      height: pxToRem(42px);
      border-radius: pxToRem(42px);
      margin-right: pxToRem(20px);
    }
    font {
      font-size: pxToRem(22px);
      margin-right: pxToRem(20px);
    }
    .i-name {
      color: $txt-color-black;
    }
  }
  .item-m {
    width: 30%;
    text-align: right;
    span {
      font-size: pxToRem(22px);
    }
    i {
      margin-right: pxToRem(4px);
    }
    .post-view {
      margin-right: pxToRem(30px);
    }
  }
  
 
  

  // div {
  //   width: pxToRem(152px);
  //   display: inline-block;
  //   vertical-align: middle;
  //   height: pxToRem(28px);
  //   line-height: pxToRem(28px);
  //   overflow: visible;
  //   span {
  //     font-size: pxToRem($font-size-small);
  //     display: inline-block;
  //     vertical-align: middle;
  //     &:last-child {
  //       margin-left: pxToRem(10px);
  //     }
  //   }
  // } 
}

</style>

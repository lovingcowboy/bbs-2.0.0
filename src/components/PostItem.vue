<template>
<li class="post-row c-event" data-type="itemclick" :data-id="data.tid">
  <slot name="itemhead"></slot>
  <div class="item-desc" >
    <div :class="['post', {'no-img': !data.cover || data.cover == ''}]" >
      <p data-type="itemclick" >{{data.subject}}</p>
      <p data-type="itemclick" >{{data.message}}</p>
    </div>
    <div class="p-img" v-show="data.cover && data.cover != ''">
      <div class="img-cover" :style="{'background-image': 'url('+ data.cover +')'}"></div>
    </div>
  </div>
  <div class="item-message">
    <div class="post-view">
      <span class="icon-view"></span>
      <span>{{data.views}}</span>
    </div>
    <div class="post-reply">
      <span class="icon-reply"></span>
      <span>{{data.replies}}</span>
    </div>
  </div>
</li>
</template>
<script>

export default {
  
	name: 'postItem',
	props: ['data', 'index'],
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
  margin: pxToRem(40px) 0;
  font-size: 0;
  .no-img {
    width: 100% !important;
  }
  .post {
    display: inline-block;
    width: pxToRem(450px);
    // font-size: pxToRem($font-size-large);
    vertical-align: middle;
    p {
      width: 100%;
      word-wrap: break-word;
      word-break: break-all; 
    }
    &>p:first-child {
      font-size: pxToRem($font-size-normal);
      color: $txt-color-black;
      line-height: pxToRem(48px);
      font-weight: bold;
    }
    &>p:last-child {
      font-size: pxToRem($font-size-normal-small);
      color: $txt-color-grey;
      line-height: pxToRem(42px);
      margin-top: pxToRem(30px);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

    }
  }

  .p-img {
    display: inline-block;
    width: pxToRem(240px);
    text-align: right;
    vertical-align: top;
    white-space: nowrap;
    .img-cover {
      width: pxToRem(200px);
      height: pxToRem(200px);
      background-position: 50% 50%;
      background-size: cover;
      background-repeat: no-repeat;
      margin-left: pxToRem(40px);
    }
  }
}
.item-message {
  width: 100%;
  color: $txt-color-grey;
  font-size: 0;
  div {
    width: pxToRem(152px);
    display: inline-block;
    vertical-align: middle;
    height: pxToRem(28px);
    line-height: pxToRem(28px);
    overflow: visible;
    span {
      font-size: pxToRem($font-size-small);
      display: inline-block;
      vertical-align: middle;
      &:last-child {
        margin-left: pxToRem(10px);
      }
    }
  } 
}

</style>

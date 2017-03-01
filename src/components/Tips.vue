<template>
<!-- <section class="error-container" v-show="config.noData"> -->
    <div class="ec-cont" v-show="config.noData">
        <i class="icon-pai-null"></i>
        <span class="ec-txt">{{config.text}}</span>
    </div>
<!-- </section> -->

</template>
<script>

export default {
	name: 'tips',
	props: ['config'],
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
.error-container {
    width: 100%;
    height: 100%;
    min-height: pxToRem(600px);
    background-color: $color-white;
    position: absolute;
    text-align: center;
    left: 0;
    top: 0;
}
    .ec-cont {
        width: 100%;
        // min-height: pxToRem(600px);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -55%);
        text-align: center;
    }
    .icon-pai-null {
        @include background('../images/pai-null.png',
        223px,
        219px);
        display: block;
        margin: auto;
    }
   /*  .icon-pai-error {
        @include background('../images/pai-null.png',
        265px,
        284px);
        display: block;
        margin: auto;
    } */
    .ec-txt {
        width: 100%;
        font-size: pxToRem(30px);
        color: $txt-color-grey;
        // text-align: center;
        margin: pxToRem(40px) auto;
    }
    /* .ec-btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        i {
            width: pxToRem(180px) !important;
            height: pxToRem(70px) !important;
            line-height: pxToRem(70px) !important;
            font-size: pxToRem(30px) !important;
        }
        .ec-reload {
            @extend .btn-blue;
        }
        .ec-main {
            border-radius: pxToRem(10px);
            border: 1px solid $txt-color-blue;
            color: $txt-color-blue;
            margin-left: pxToRem(40px);
            background-image: -ms-linear-gradient( 0deg, rgb(247, 252, 255) 0%, rgb(255, 255, 255) 100%);
            box-shadow: 0px pxToRem(4px) pxToRem(10px) 0px rgba( 25, 166, 255, .2);
        }
    } */

</style>

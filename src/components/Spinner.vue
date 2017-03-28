<template>
  <svg class="spinner" :class="{ show: show }"  viewBox="0 0 44 44">
    <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
  </svg>
</template>

<script>
export default {
  props: ['show']
}
</script>

<style lang="scss">
@import "../sass/variables";
@import "../sass/func";
$offset: 126;
$duration: 1.4s;

.spinner {
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  margin-left: pxToRem(-44px);
  margin-top: pxToRem(-44px);
  opacity:0;
  transition: opacity .15s ease;
  animation: rotator $duration linear infinite;
  // animation-play-state: paused;
  width: pxToRem(88px);
  height: pxToRem(88px);
}
  

.spinner.show {
  opacity: 1;
  // animation-play-state: running;

}
  

@keyframes rotator {
  0% {
    transform: scale(0.5) rotateZ(0deg);
  }
  100% {
    transform: scale(0.5) rotateZ(270deg);
  }
}
@-webkit-keyframes rotator {
  0% {
    transform: scale(0.5) rotateZ(0deg);
  }
  100% {
    transform: scale(0.5) rotateZ(270deg);
  }
}
  

.spinner .path {
  stroke: #dddddd;
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite;

}
  

@keyframes dash {
  0% {
    stroke-dashoffset: $offset;
  }
  50% {
    stroke-dashoffset: ($offset/2);
    transform: rotateZ(135deg);

  }
    
  100% {
    stroke-dashoffset: $offset;
    transform: rotateZ(450deg);
  }
    
}

@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: $offset;
  }
  50% {
    stroke-dashoffset: ($offset/2);
    transform: rotateZ(135deg);
  }
    
  100% {
    stroke-dashoffset: $offset;
    transform: rotateZ(450deg);
  }
    
}
  
</style>

<template lang="html">
  <div class="spinner-box">
    <div class="pulse-container">
      <div class="pulse-bubble pulse-bubble-1"></div>
      <div class="pulse-bubble pulse-bubble-2"></div>
      <div class="pulse-bubble pulse-bubble-3"></div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.spinner-box {
  width: 260px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.pulse-container {
  width: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pulse-bubble {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: $colorBrand;
}
.pulse-bubble-1 {
    animation: pulse .4s ease 0s infinite alternate;
}
.pulse-bubble-2 {
    animation: pulse .4s ease .2s infinite alternate;
}
.pulse-bubble-3 {
    animation: pulse .4s ease .4s infinite alternate;
}
@keyframes pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: .25;
    transform: scale(.75);
  }
}
</style>

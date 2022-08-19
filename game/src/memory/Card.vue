<template>
  <div class="column" :class="{ 'is-danger': active }" @click="clickHandler">
    <div class="card-image">
      <figure class="image is-4by3"
          :style="{display: active ? 'block' : 'none'}"
      >
        <img
          :src="card.img"
          :aria-hidden="!active"
          :alt="active ? card.name : 'Hidden'"
          class="h-full w-full object-full"
        />
      </figure>
        <div
          :aria-hidden="active"
          class="image is-4by3 has-background-info-light"
          :style="{display: active ? 'none' : 'block', height: '100%', width: '100%'}"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';

export default defineComponent({
  props: ["card", "active"],
  watch: {
    props(_){console.log('!!!!',_);this.$forceUpdate()}
  }
});
</script>

<style scoped>
.front {
  transform: rotateY(90deg);
  transition: all ease-in 0.2s;
  position: absolute;
}
.flipped .front {
  transform: rotateY(0deg);
  transition-delay: 0.2s;
}
.back {
  transition: all ease-in 0.2s;
  transition-delay: 0.2s;
}
.flipped .back {
  transform: rotateY(90deg);
  transition-delay: 0s;
}
</style>

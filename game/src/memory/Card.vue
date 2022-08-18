<template>
  <div
    class="card xs:h-24 xs:w-20 xs:justify-center xs:m-2 sm:h-26"
    :class="{ flipped: active }"
    @click="clickHandler"
  >
    <div
      class="imgcon h-full w-full custom-green front shadow-lg flex items-center justify-center"
    >
      <img
        :src="`${card.img}`"
        alt="ac"
        class="h-full w-full object-full xs:h-4/5 xs:w-4/5"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  props: ["card", "active"],
  methods: {
    clickHandler() {
      if (!this.active) {
        this.$emit("click", this.card);
      }
    },
  },
};
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

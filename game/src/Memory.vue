<template>
  <div class="app">
    <div class="lg:flex lg:justify-center lg:flex-col lg:items-center">
      <div
        class="w-screen flex justify-around flex-wrap content-start pt-4 md:px-24 lg:max-w-screen-lg"
      >
        <Card
          v-for="villager in villagers"
          :key="villager.id"
          :card="villager"
          @click="handleClick"
          :active="
            firstPick === villager ||
            secondPick === villager ||
            villager.matched
          "
        />
      </div>
    </div>
    <div
      class="w-full flex justify-center items-center z-0 text-2xl text-gray font-bold"
    >
      Turns: {{ turns }}
    </div>
    <Modal v-show="done" :turns="turns" @click="resetGame" />
  </div>
</template>

<script>
import Card from "./memory/Card";
import Modal from "./memory/Modal";
export default {
  name: "App",
  components: {
    Card,
    Modal,
  },
  data() {
    return {
      images: [
        { img: "dom.png" },
        { img: "filbert.png" },
        { img: "judy.png" },
        { img: "lily.png" },
        { img: "lucky.png" },
        { img: "sherb.png" },
      ],
      villagers: [],
      firstPick: null,
      secondPick: null,
      turns: 0,
      done: false,
    };
  },
  methods: {
    handleClick(card) {
      this.firstPick ? (this.secondPick = card) : (this.firstPick = card);
      if (this.firstPick && this.secondPick) {
        if (this.firstPick.img === this.secondPick.img) {
          const ind1 = this.villagers.indexOf(card);
          const ind2 = this.villagers.indexOf(this.firstPick);
          this.villagers[ind1].matched = true;
          this.villagers[ind2].matched = true;
          this.resetActive();
        } else {
          this.resetActive();
        }
        this.turns++;
      }
      this.checkIfCompleted();
    },
    resetActive() {
      setTimeout(() => {
        Memo;
        this.firstPick = null;
        this.secondPick = null;
      }, 500);
    },
    shuffle() {
      this.villagers.sort(() => Math.random() - 0.5);
    },
    checkIfCompleted() {
      if (this.villagers.every((villager) => villager.matched))
        this.done = true;
    },
    resetGame() {
      this.firstPick = null;
      this.secondPick = null;
      this.turns = 0;
      this.done = false;
      this.villagers.forEach((v) => (v.matched = false));
      setTimeout(() => {
        this.shuffle();
      }, 500);
    },
  },
  mounted() {
    this.villagers = [...this.images, ...this.images].map(
      (villager, index) => ({
        ...villager,
        matched: false,
        id: index,
      })
    );
  },
};
</script>

<style></style>

<template>
  <div
    class="block w-full flex justify-center items-center z-0 text-2xl text-gray font-bold"
    role="status"
    aria-live="polite"
  >
    Turn: {{ turn }}
  </div>
  <div v-for="(row, i) in rows" :key="i" class="columns">
    <Card
      v-for="(card, i) in row"
      :key="i"
      :card="card"
      @click="handleClick(card)"
      :active="
        card.matched ||
        (firstPick && firstPick.row == card.row && firstPick.col == card.col) ||
        (secondPick && secondPick.row == card.row && secondPick.col == card.col)
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

import Card from "../components/MemoryCard.vue";
import { setScore } from "../util";

const CARDS_PER_ROW = 4,
  NUMBER_OF_PAIRS = 6;

interface Card {
  name: string;
  img: string;
  row: number;
  col: number;
  matched: boolean;
}

interface State {
  rows: Card[][];
  firstPick?: Card;
  secondPick?: Card;
  turn: number;
}

// Fisher-Yates
function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export default defineComponent({
  name: "Memory",
  components: {
    Card,
  },
  async setup() {
    const req = await fetch(
      `http://shibe.online/api/shibes?count=${NUMBER_OF_PAIRS}`
    );
    const animals = await req.json();
    const images = animals.map((a: any) => ({
      img: a,
      name: a,
    }));
    const rows = shuffle([...images, ...images])
      .map((image) => ({
        ...image,
        matched: false,
      }))
      .reduce(
        (rows, obj, i): Card[][] =>
          i % CARDS_PER_ROW != 0
            ? rows.slice(0, -1).concat([
                rows[rows.length - 1].concat([
                  {
                    ...obj,
                    row: rows.length - 1,
                    col: rows[rows.length - 1].length,
                  },
                ]),
              ])
            : rows.concat([[{ ...obj, row: rows.length, col: 0 }]]),
        []
      );

    return reactive({
      rows,
      firstPick: undefined,
      secondPick: undefined,
      turn: 0,
    }) as State;
  },
  methods: {
    handleClick(card: Card) {
      if (this.firstPick) this.secondPick = card;
      else this.firstPick = card;

      if (this.firstPick && this.secondPick) {
        if (this.firstPick.img === this.secondPick.img) {
          this.rows[this.firstPick.row][this.firstPick.col].matched = true;
          this.rows[this.secondPick.row][this.secondPick.col].matched = true;
        }
        this.resetActive();
        ++this.turn;
      }
      if (this.rows.every((row) => row.every((card) => card.matched)))
        this.completed();
    },
    resetActive() {
      setTimeout(() => {
        this.firstPick = undefined;
        this.secondPick = undefined;
        // TODO: not ideal
      }, 500);
    },
    async completed() {
      // TODO: compute based on turns
      const result = Math.round((1 / this.turn) * 1337);
      await setScore("memory", result);
    },
  },
});
</script>

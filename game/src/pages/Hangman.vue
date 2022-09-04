<template>
  <div
    class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="350px"
      height="260px"
      viewBox="0 0 350 275"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1="80"
        y1="257"
        x2="260"
        y2="257"
        class="piece"
        :class="strikes > 0 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="100"
        y1="257"
        x2="100"
        y2="40"
        class="piece"
        :class="strikes > 1 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="100"
        y1="40"
        x2="230"
        y2="40"
        class="piece"
        :class="strikes > 2 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="100"
        y1="80"
        x2="130"
        y2="40"
        class="piece"
        :class="strikes > 3 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="230"
        y1="40"
        x2="230"
        y2="70"
        class="piece"
        :class="strikes > 4 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <circle
        cx="230"
        cy="90"
        r="20"
        class="piece"
        :class="strikes > 5 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="230"
        y1="110"
        x2="230"
        y2="170"
        class="piece"
        :class="strikes > 6 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="230"
        y1="140"
        x2="250"
        y2="120"
        class="piece"
        :class="strikes > 7 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="230"
        y1="140"
        x2="210"
        y2="120"
        class="piece"
        :class="strikes > 8 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="230"
        y1="170"
        x2="250"
        y2="200"
        class="piece"
        :class="strikes > 9 ? 'has-text-black' : 'has-text-grey-light'"
      />
      <line
        x1="230"
        y1="170"
        x2="210"
        y2="200"
        class="piece"
        :class="strikes > 10 ? 'has-text-black' : 'has-text-grey-light'"
      />
    </svg>
    <div class="letters my-4">
      <div
        class="letter"
        v-for="letter in wordDisplayLetters"
        :class="{
          'has-text-primary': letter.special || letter.letter != '',
          'has-text-danger': letter.letter == '' && state != 'p',
        }"
      >
        {{ letter.letter ? letter.letter : state != "p" ? letter.meant : "" }}
      </div>
    </div>
    <div v-for="[start, end] in letterBounds">
      <button
        v-for="i in end - start"
        :disabled="state != 'p' || usedLetters.includes(letters[start + i - 1])"
        class="button has-text-grey-darker possibleLetter"
        :class="getStrikethroughClass(letters[start + i - 1])"
        @click="tryLetter(letters[start + i - 1])"
      >
        {{ letters[start + i - 1] }}
      </button>
    </div>
    <button v-if="state == 'l'" class="button is-primary mt-4" @click="reset">
      Retry
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { setScore } from "../util";

const LETTERS = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  PIECES = 10;

enum GameState {
  PLAYING = "p",
  LOST = "l",
  WIN = "w",
}

export default defineComponent({
  async setup() {
    const req = await fetch(
      "https://zoo-animal-api.herokuapp.com/animals/rand"
    );
    const { name } = await req.json(),
      word = name.toUpperCase(),
      wordLetters = word.split("");

    return reactive({
      strikes: 0,
      word: word,
      usedLetters: [],
      letterBounds: [
        [0, 9],
        [9, 19],
        [19, 26],
      ],
      letters: LETTERS,
      state: GameState.PLAYING,
    });
  },
  computed: {
    wordLetters() {
      return this.word.split("");
    },
    wordDisplayLetters() {
      return this.wordLetters.map((letter: string) => {
        const special = !LETTERS.includes(letter);
        return {
          meant: letter,
          letter: special ? letter : "",
          special,
        };
      });
    },
  },
  methods: {
    async tryLetter(letter) {
      if (this.usedLetters.includes(letter)) return;

      this.usedLetters.push(letter);
      let match = false;
      for (let i = 0; i < this.wordDisplayLetters.length; i++)
        if (letter === this.wordLetters[i]) {
          this.wordDisplayLetters.splice(i, 1, { letter, special: false });
          match = true;
        }
      if (!match) ++this.strikes;
      const displayWord = this.wordDisplayLetters
        .map((letter) => letter.letter)
        .join("");
      if (displayWord == this.word) {
        this.state = GameState.WIN;
        // TODO
        const result = Math.round(100 / this.strikes);
        await setScore("hangman", result);
      } else if (this.strikes > PIECES) {
        this.state = GameState.LOST;
      }
    },
    getStrikethroughClass(letter) {
      return this.usedLetters.includes(letter) ? "diagonal-strike" : null;
    },
    async reset() {
      const req = await fetch(
        "https://zoo-animal-api.herokuapp.com/animals/rand"
      );
      const { name } = await req.json();
      this.word = name.toUpperCase();
      this.usedLetters = [];
      this.state = GameState.PLAYING;
      this.strikes = 0;
    },
  },
});
</script>

<style>
.hangman {
  text-align: center;
}

.piece {
  stroke: currentColor;
  fill: none;
  stroke-width: 2px;
}

.letters {
  height: 50px;
}

.letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid;
  margin: 0px 3px 0px 3px;
  font-size: 30px;
  min-width: 30px;
  vertical-align: bottom;
}

.possibleLetter {
  display: inline-block;
  margin: 10px 3px 0px 3px;
  font-size: 30px;
  min-width: 30px;
  cursor: pointer;
}

.diagonal-strike {
  background: linear-gradient(
    to left top,
    transparent 47.75%,
    currentColor 49.5%,
    currentColor 50.5%,
    transparent 52.25%
  );
}
</style>

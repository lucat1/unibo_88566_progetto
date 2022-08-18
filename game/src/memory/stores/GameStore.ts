import { defineStore } from "pinia";
import { ICard, IStatus } from "../IType";
import {
  getHighestRecord,
  saveHighestRecord,
  shuffleAllCards,
} from "../helper";

export interface GameScore {
  nonMatchedPairs: number;
  highestRecord: number;
  status: IStatus;
  cards: ICard[];
  timeCost: number;
  timerId?: NodeJS.Timer;
}

export const useGameStore = defineStore("memory", {
  state: (): GameScore => ({
    nonMatchedPairs: 8,
    highestRecord: getHighestRecord(),
    status: IStatus.READY,
    cards: shuffleAllCards(),
    timeCost: 0,
    timerId: undefined,
  }),
  getters: {
    nonMatchedPairs: (s) => s.nonMatchedPairs,
    highestRecord: (s) => s.highestRecord,
    status: (s) => s.status,
    cards: (s) => s.cards,
    timeCost: (s) => s.timeCost,
  },
  actions: {
    updateStatus(status: IStatus) {
      this.status = status;
      switch (this.status) {
        case IStatus.PLAYING:
          this.timerId = setInterval(() => {
            this.count();
          }, 1000);
          break;
        case IStatus.PASSED:
          clearInterval(this.timerId!);
          this.updateTopScore();
          break;
      }
      if (status === IStatus.PLAYING) {
      }
      if (status === IStatus.PASSED) {
      }
    },
    flipsDelay({ timeout, cards }: { timeout: number; cards: ICard[] }) {
      setTimeout(() => {
        this.flips(cards);
      }, timeout);
    },

    reset() {
      this.$reset();
    },
    count() {
      this.timeCost = this.timeCost + 1;
    },
    flips(cards: ICard[]) {
      this.cards = this.cards.map((c) =>
        cards.some((cc) => cc.id === c.id)
          ? {
              ...c,
              flipped: !c.flipped,
            }
          : c
      );
    },
    updateNonMatchedPairs(payload: number) {
      this.nonMatchedPairs = this.nonMatchedPairs + payload;
    },
    updateTopScore() {
      saveHighestRecord(this.timeCost);
    },
  },
});

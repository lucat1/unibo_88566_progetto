<template>
  <div class="container" @click="doFlip">
    <div class="card" :class="{ flipped: card.flipped }">
      <img v-if="card.name === '8-ball'" class="front" src="../../assets/8-ball.png" />
      <img v-if="card.name === 'baked-potato'" class="front" src="../../assets/baked-potato.png" />
      <img v-if="card.name === 'dinosaur'" class="front" src="../../assets/dinosaur.png" />
      <img v-if="card.name === 'kronos'" class="front" src="../../assets/kronos.png" />
      <img v-if="card.name === 'rocket'" class="vue" ; import { useStore } from "vuex" ; import { ICard, IStatus }
        from "../../IType" ; import { GameStoreKey } from "@/stores" ; import Card from "./Card.vue" ; export default
        defineComponent({ name: "ChessBoard" , components: { Card }, setup: ()=> {
      let lastCard = ref<ICard | null>(null);
        const { state, dispatch, commit } = useStore(GameStoreKey);
        const realtimeStatus = computed(() => state.status);
        const realtimeNonMatchedPairs = computed(() => state.nonMatchedPairs);
        const realtimeCards = computed(() => state.cards);

        const onFlip = (e: ICard) => {
        if (realtimeStatus.value === IStatus.READY) {
        dispatch("updateStatus", IStatus.PLAYING);
        }
        if (!lastCard.value) {
        lastCard.value = e;
        return;
        }
        if (lastCard.value !== e && lastCard.value.name === e.name) {
        lastCard.value = null;
        commit("updateNonMatchedPairs", -1);
        if (!realtimeNonMatchedPairs.value) {
        dispatch("updateStatus", IStatus.PASSED);
        }
        return;
        }

        const savedLastCard = lastCard.value;
        lastCard.value = null;
        dispatch("flipsDelay", {
        timeout: 1000,
        cards: [savedLastCard, e],
        });
        };

        return {
        onFlip,
        cards: realtimeCards,
        };
        },
        });
        </script>

        <style scoped>
          .container {
            width: 100px;
            height: 121px;
            margin-right: 3px;
            cursor: pointer;
            position: relative;
            perspective: 800px;
          }

          .card {
            width: 100%;
            height: 100%;
            transition: transform 1s;
            transform-style: preserve-3d;
          }

          .card.flipped {
            transform: rotateY(180deg);
          }

          .card img {
            display: block;
            height: 100%;
            width: 100%;
            position: absolute;
            backface-visibility: hidden;
          }

          .card .back {
            background: blue;
            transform: rotateY(0deg);
          }

          .card .front {
            background: blue;
            transform: rotateY(180deg);
          }

          @media screen and (max-width: 450px) {
            .container {
              width: 92px;
              height: 111px;
              margin-right: 1px;
            }
          }

          @media screen and (max-width: 380px) {
            .container {
              width: 85px;
              height: 102px;
              margin-right: 1px;
            }
          }

          @media screen and (max-width: 360px) {
            .container {
              width: 70px;
              height: 84px;
              margin-right: 1px;
            }
          }
        </style>

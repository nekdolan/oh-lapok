<script setup>
import { ref, computed } from "vue";
import Card from "./card.vue";
import fullList from "../computed/cards.json";
import _ from "lodash/fp";

const maxDisplay = 24;

const shortList = ref(fullList);
const cardActive = ref(false);
const cardData = ref(null);

const page = ref(1);
const showGallery = ref(false);

let imageLoadedAll = 0;

const maxPage = computed(() => {
  return Math.round(shortList.value.length / maxDisplay);
});

const displayList = computed(() => {
  return _.compose(
    _.first,
    _.at(page.value - 1),
    _.chunk(maxDisplay)
  )(shortList.value);
});

const imageLoaded = () => {
  imageLoadedAll += 1;
  if (imageLoadedAll >= displayList.value.length) {
    setTimeout(function () {
      console.log("SHOW");
      showGallery.value = true;
      imageLoadedAll = 0;
    }, 100);
  } else if (showGallery.value === true) {
    showGallery.value = false;
  }
};

const openCard = (card) => {
  cardData.value = card;
  cardActive.value = true;
};
</script>

<template>
  <card v-model:active="cardActive" :card-data="cardData"></card>
  <n-layout has-sider>
    <n-layout-sider>
      <slot name="header"></slot>
    </n-layout-sider>
    <n-layout-content>
      <n-space justify="end">
        <n-pagination v-model:page="page" :page-count="maxPage" />
      </n-space>
    </n-layout-content>
  </n-layout>
  <n-divider />
  <n-grid
    :x-gap="16"
    :y-gap="14"
    cols="1 s:4 m:6 l:8 xl:12 2xl:12"
    responsive="screen"
    id="gallery"
    :class="showGallery ? 'visible' : 'invisible'"
  >
    <n-grid-item v-for="card in displayList" :key="card.sorszam">
      <n-card
        class="card-item"
        :bordered="false"
        @click="openCard(card)"
        style="border-radius: 7px"
      >
        <template #cover>
          <n-tooltip trigger="hover" :delay="75" :duration="75">
            <template #trigger>
              <img
                :srcset="`${card.kiskep} 143w, ${card.nagykep} 620w`"
                sizes="(max-width: 1280px) 143px, 620px"
                :src="card.kiskep"
                :alt="card.nev"
                @load="imageLoaded(card.nev)"
              />
            </template>
            {{ card.nev }}
          </n-tooltip>
        </template>
      </n-card>
    </n-grid-item>
  </n-grid>
  <n-divider />
  <n-space justify="end" v-show="showGallery">
    <n-pagination v-model:page="page" :page-count="maxPage" />
  </n-space>
</template>

<style>
@keyframes lighten {
  0% {
    filter: brightness(80%);
  }
  100% {
    filter: brightness(100%);
  }
}
#gallery .card-item:hover img {
  filter: brightness(100%);
  cursor: pointer;
  animation: lighten 50ms ease-out;
}
#gallery .card-item {
}
#gallery .card-item img {
  border-radius: 7px;
  filter: brightness(80%);
}
.invisible {
  opacity: 0;
}
.visible {
  opacity: 100;
  transition: opacity 100ms ease-out;
}
</style>

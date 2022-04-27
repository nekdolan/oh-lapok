<script setup>
import { ref, computed, watch } from "vue";
import _ from "lodash/fp";
import { filterCards } from "../search";
import Card from "./card.vue";

const props = defineProps(["searchData", "maxDisplay"]);

const shortList = ref(filterCards({}));
const cardActive = ref(false);
const cardData = ref(null);

const page = ref(1);
const showGallery = ref(false);

let imageLoadedAll = 0;

watch(
  () => props.searchData,
  _.debounce(100, (searchData) => {
    imageLoadedAll = 0;
    page.value = 1;
    shortList.value = filterCards(searchData);
  })
);

watch(page, () => {
  showGallery.value = false;
});

const maxPage = computed(() => {
  return Math.floor(shortList.value.length / props.maxDisplay + 1);
});

const displayList = computed(() => {
  return _.compose(
    _.first,
    _.at(page.value - 1),
    _.chunk(props.maxDisplay)
  )(shortList.value);
});

const imageLoaded = () => {
  imageLoadedAll += 1;
  if (imageLoadedAll >= displayList.value.length) {
    setTimeout(function () {
      showGallery.value = true;
      imageLoadedAll = 0;
    }, 100);
  }
};

const openCard = (card) => {
  cardData.value = card;
  cardActive.value = true;
};
</script>

<template>
  <card v-model:active="cardActive" :card-data="cardData"></card>
  <n-grid cols="2 s:1">
    <n-grid-item>
      <slot name="header"></slot>
    </n-grid-item>
    <n-grid-item>
      <n-space justify="end">
        <n-pagination v-model:page="page" :page-count="maxPage" />
      </n-space>
    </n-grid-item>
  </n-grid>
  <n-divider />
  <n-grid
    :x-gap="16"
    :y-gap="14"
    cols="1 s:4 m:6 l:8 xl:8 2xl:8"
    responsive="screen"
    id="gallery"
    :class="showGallery ? 'visible' : 'invisible'"
  >
    <n-grid-item
      v-for="card in displayList"
      :key="`${card.nev}_${card.kiegeszito}_${card.kaszt}`"
    >
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

<script setup>
import _ from "lodash/fp";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { darkTheme } from "naive-ui";
import { Search12Regular } from "@vicons/fluent";
import Finder from "./components/finder.vue";
import List from "./components/list.vue";
import settings from "./data/settings.json";

const container = ref(null);
const appHeight = ref(480);
const appWidth = ref(640);
let isIframe = false;
let windowHeight = 0;
let windowWidth = 0;

try {
  isIframe =
    window.location !== window.parent.location ||
    document.body.getAttribute("data-imported") !== "false";
} catch (e) {}

const handleAppResize = _.debounce(500, () => {
  if (
    window.innerHeight !== windowHeight ||
    window.innerWidth !== windowWidth
  ) {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    appHeight.value = container.value ? container.value.clientHeight : 480;
    appWidth.value = container.value ? container.value.clientHeight : 640;
  }
});

const maxDisplay = computed(() => {
  return appHeight.value > 1200 ? 24 : appHeight.value > 900 ? 16 : 8;
});

const searchData = _.compose(
  ref,
  _.fromPairs,
  _.map((setting) => [setting.key, setting.default])
)(settings);

const finderActive = ref(false);

function activate() {
  finderActive.value = !finderActive.value;
}

onMounted(() => {
  handleAppResize();
  window.addEventListener("resize", handleAppResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleAppResize);
});
</script>

<template>
  <n-config-provider
    :theme="isIframe ? undefined : darkTheme"
    :style="`background-color: ${isIframe ? 'transparent' : 'black'}; ${
      isIframe ? '' : 'padding: 10px 20px;'
    }`"
  >
    <n-global-style />
    <main ref="container" id="vue-container">
      <finder
        title="Kártya Keresés"
        v-model:active="finderActive"
        v-model:search="searchData"
        :width="appWidth"
      />
      <list :search-data="searchData" :max-display="maxDisplay">
        <template #header>
          <n-button type="primary" @click="activate()">
            <template #icon>
              <n-icon>
                <Search12Regular />
              </n-icon>
            </template>
            Keresés
          </n-button>
        </template>
      </list>
    </main>
  </n-config-provider>
</template>

<style>
@import "./assets/base.css";

#vue-container {
  width: 100%;
}
</style>

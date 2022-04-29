<script setup>
import _ from "lodash/fp";
import { ref } from "vue";
import { darkTheme } from "naive-ui";
import { Search12Regular } from "@vicons/fluent";
import Finder from "./components/finder.vue";
import List from "./components/list.vue";
import settings from "./data/settings.json";

let windowHeight = 0;
let windowWidth = 500;
let isIframe = false;

try {
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  isIframe = window.location !== window.parent.location;
} catch (e) {}

const maxDisplay = windowHeight > 1300 ? 32 : 12;

const searchData = _.compose(
  ref,
  _.fromPairs,
  _.map((setting) => [setting.key, setting.default])
)(settings);

const finderActive = ref(false);

function activate() {
  finderActive.value = !finderActive.value;
}
</script>

<template>
  <n-config-provider
    :theme="isIframe ? undefined : darkTheme"
    :style="`background-color: ${isIframe ? 'transparent' : 'black'}; ${
      isIframe ? '' : 'padding: 10px 20px;'
    }`"
  >
    <n-global-style />
    <header>
      <finder
        title="Kártya Keresés"
        v-model:active="finderActive"
        v-model:search="searchData"
        :width="windowWidth"
      />
    </header>
    <main>
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
</style>

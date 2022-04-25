<script setup>
import { Search12Regular } from '@vicons/fluent'
import Finder from "./components/finder.vue";
import List from "./components/list.vue";
import { ref } from "vue";

const finderActive = ref(false);

function activate() {
  finderActive.value = !finderActive.value;
}
</script>

<template>
  <header></header>
  <main>
    <finder title="Kártya Keresés" v-model:active="finderActive" />
    <list>
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
</template>

<style>
@import "./assets/base.css";
</style>

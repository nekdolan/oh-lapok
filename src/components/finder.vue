<script setup>
import { ref } from "vue";
import settings from "../data/settings.json";
import _ from "lodash/fp";
import search from '../search'

const active = ref(true);

const searchForm = _.compose(
  ref,
  _.fromPairs,
  _.map((setting) => [setting.key, setting.default])
)(settings);

defineProps(["title"]);

function activate() {
  active.value = !active.value;
}

search();

// {
// "label": "",
//     "key": "",
//     "children": [
//   {
//     "label": "",
//     "key": ""
//   }
// ]
// }
</script>
<template>
  <n-button @click="activate()"> ... </n-button>
  <n-drawer v-model:show="active" :width="502" placement="left">
    <n-drawer-content :title="title" closable>
      {{ searchForm }}
      <n-form
        :model="searchForm"
        label-placement="left"
        size="medium"
        label-width="auto"
      >
        <n-form-item
          :label="setting.label"
          v-for="setting in settings"
          :key="setting.key"
        >
          <component
            v-model:value="searchForm[setting.key]"
            :is="setting.component"
            v-bind="setting.props"
            v-if="setting.component"
          />
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

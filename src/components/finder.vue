<script setup>
import _ from "lodash/fp";
import cards from "../computed/cards.json";
import settings from "../data/settings.json";
import { computed, reactive } from "vue";
import { latinize } from "../search";

const props = defineProps(["title", "active", "search", "width"]);
const emit = defineEmits(["update:active", "update:search"]);

const nevList = _.compose(
  _.uniq,
  _.map((card) => card.nev)
)(cards);

const autoCompleteList = computed(() => {
  const value = latinize(props.search.nev);
  return _.filter((nev) => new RegExp(`.*${value}.*`, "i").test(latinize(nev)), nevList);
});

settings[0].props = reactive({
  ...settings[0].props,
  options: autoCompleteList,
});

const initSearch = { ...props.search };
const clear = () => {
  emit("update:search", initSearch);
};
const update = (key, value) => {
  const search = { ...props.search, [key]: value };
  emit("update:search", search);
};
</script>
<template>
  <n-drawer
    :show="active"
    @update:show="$emit('update:active', $event)"
    placement="left"
    :width="Math.min(502, width)"
  >
    <n-drawer-content :title="title" closable>
      <n-form label-placement="left" size="medium" label-width="auto">
        <n-form-item
          :label-placement="width < 502 ? 'top' : 'left'"
          :label="setting.label"
          v-for="setting in settings"
          :key="setting.key"
        >
          <component
            :value="search[setting.key]"
            @update:value="update(setting.key, $event)"
            :is="setting.component"
            v-bind="setting.props"
            v-if="setting.component"
          />
        </n-form-item>
      </n-form>
      <n-button @click="clear">Visszaállítás</n-button>
    </n-drawer-content>
  </n-drawer>
</template>

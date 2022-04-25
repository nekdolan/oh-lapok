<script setup>
import { ref } from "vue";
import settings from "../data/settings.json";
import _ from "lodash/fp";

const searchForm = _.compose(
  ref,
  _.fromPairs,
  _.map((setting) => [setting.key, setting.default])
)(settings);

defineProps(["title", "active"]);
defineEmits(["update:active"]);

</script>
<template>
  <n-drawer
    :show="active"
    @update:show="$emit('update:active', $event)"
    :width="502"
    placement="left"
  >
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

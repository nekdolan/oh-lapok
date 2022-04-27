<script setup>
import { Info12Regular, ArrowCircleLeft12Regular, DismissCircle12Regular } from "@vicons/fluent";
import { ref } from "vue";
import keys from "../computed/keys.json";

defineProps(["active", "cardData"]);
defineEmits(["update:active"]);

const infoActive = ref(false);
const modalActive = ref(false);

</script>
<template>
  <n-modal
    :show="active"
    @update:show="$emit('update:active', $event)"
    :on-after-leave="() => (modalActive = infoActive = false)"
    :on-after-enter="() => (modalActive = true)"
  >
    <n-card
      style="width: 620px; border-radius: 50px"
      title=""
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      v-if="cardData"
    >
      <template #cover>
        <img class="card-image" :src="cardData.nagykep" />
        <div :class="`${infoActive ? 'active' : ''} card-info`">
          <div class="info-button" v-show="modalActive">
            <n-button
              strong
              circle
              :type="infoActive ? 'error' : 'primary'"
              size="large"
              @click="infoActive = !infoActive"
            >
              <n-icon size="60">
                <ArrowCircleLeft12Regular v-if="infoActive" />
                <Info12Regular v-else />
              </n-icon>
            </n-button>
            <n-button
              strong
              circle
              type="error"
              size="large"
              @click="$emit('update:active', false)"
              v-show="modalActive"
            >
              <n-icon size="60">
                <DismissCircle12Regular />
              </n-icon>
            </n-button>
          </div>
          <div class="info" v-show="infoActive">
            Név: <span class="info-data">{{ cardData.nev }}</span> <br />
            Kiegészítő: <span class="info-data">{{ keys[cardData.kiegeszito] }}</span> <br />
            Ritkaság: <span class="info-data">{{ cardData.ritkasag }}</span>
            <br />
            Szint: <span class="info-data">{{ cardData.szint }}</span> <br />
            Főtípus: <span class="info-data">{{ cardData.fotipus }}</span>
            <br />
            Altípus: <span class="info-data">{{ cardData.altipus }}</span>
            <br />
            Kaszt: <span class="info-data">{{ cardData.kaszt }}</span> <br />
            Sorszám: <span class="info-data">{{ cardData.sorszam }}</span>
            <br />
            Illusztrátor:
            <span class="info-data">{{ cardData.illusztrator }}</span> <br />
            Sebzéstípus:
            <span class="info-data">{{ cardData.sebzestipus }}</span> <br />
            Sebzés: <span class="info-data">{{ cardData.sebzes }}</span> <br />
            Páncél: <span class="info-data">{{ cardData.pancel }}</span> <br />
            <template v-if="cardData.felszerelheto">
              Felszerelhető:
              <span class="info-data">{{ cardData.felszerelheto }}</span> <br />
            </template>
            <template v-if="cardData.specialis">
              Speciális:
              <span class="info-data">{{ cardData.specialis }}</span> <br />
            </template>
            Képesség: {{ cardData.kepesseg }}
          </div>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style>
.info {
  padding: 10px 15px;
  font-size: 30px;
  color: white;
}
.info .info-data {
  font-weight: bold;
}
.card-image {
  border-radius: 50px;
}
.info-button {
  position: absolute;
  right: -15px;
  top: -15px;
}
.info-button > * {
  margin-left: 20px;
}
.card-info.active {
  background-color: rgba(0, 0, 0, 0.85);
}
.card-info {
  position: absolute;
  border-radius: 50px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

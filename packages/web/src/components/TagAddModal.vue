<template>
  <ModalBase
    title="Add tag"
    submit-text="Add"
    :show="show"
    @submit="submit"
    @close="$emit('close')"
  >
    <template #icon>
      <PlusIcon />
    </template>
    <template #main>
      <ModalError v-if="error" :error="error" />
      <ModalInput v-model="name" type="text" label="Name" />
      <div class="space-y-2 w-full">
        <p>Variations</p>
        <textarea
          v-model="variations"
          class="w-full px-4 py-2 text-gray-300 transition bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-gray-500 resize-none"
          rows="4"
        />
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./ModalBase.vue";
import ModalInput from "./ModalInput.vue";
import { watch, ref } from "vue";
import { prettyError } from "../global/helpers";
import ModalError from "./ModalError.vue";
import PlusIcon from "../icons/PlusIcon.vue";
import { store } from "../global/store";
import axios from "axios";

const error = ref("");
const name = ref("");
const variations = ref("");

const props = defineProps({
  show: {
    type: Boolean,
  },
});

const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    error.value = "";
    name.value = "";
    variations.value = "Default";
  }
);

const submit = async () => {
  try {
    error.value = "";

    await axios.post("/api/tags", {
      name: name.value,
      variations: variations.value.split("\n"),
    });

    await store.init();
    emit("close");
  } catch (e) {
    error.value = prettyError(e);
  }
};
</script>

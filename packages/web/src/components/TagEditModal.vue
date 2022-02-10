<template>
  <ModalBase
    title="Edit tag"
    submit-text="Edit"
    :show="show"
    @submit="submit"
    @close="$emit('close')"
  >
    <template #icon>
      <PencilIcon />
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
import { watch, ref, PropType } from "vue";
import { prettyError } from "../global/helpers";
import ModalError from "./ModalError.vue";
import axios from "axios";
import { store } from "../global/store";
import PencilIcon from "../icons/PencilIcon.vue";
import { ITag } from "../global/types";

const error = ref("");
const name = ref("");
const variations = ref("");

const props = defineProps({
  show: {
    type: Boolean,
  },
  tag: {
    type: Object as PropType<ITag>,
    default() {
      //
    },
  },
});

const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    error.value = "";
    name.value = props.tag.name;
    variations.value = props.tag.variations.join("\n");
  }
);

const submit = async () => {
  try {
    error.value = "";

    await axios.post(`/api/tags/${props.tag.id}`, {
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

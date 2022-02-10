<template>
  <ModalBase
    :show="show"
    title="Delete tag"
    submit-text="Delete"
    @submit="submit"
    @close="$emit('close')"
  >
    <template #icon>
      <PencilIcon />
    </template>
    <template #main>
      <ModalError v-if="error" :error="error" />
      <p>Confirm deletion of tag ("{{ tag.name }}").</p>
    </template>
  </ModalBase>
</template>

<script lang="ts" setup>
import ModalBase from "./ModalBase.vue";
import PencilIcon from "../icons/PencilIcon.vue";
import { PropType, ref, watch } from "vue";
import { ITag } from "../global/types";
import ModalError from "./ModalError.vue";
import { prettyError } from "../global/helpers";
import axios from "axios";
import { store } from "../global/store";

const error = ref("");

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

const submit = async () => {
  try {
    error.value = "";

    await axios.delete(`/api/tags/${props.tag.id}`);

    await store.init();
    emit("close");
  } catch (e) {
    error.value = prettyError(e);
  }
};

watch(
  () => props.show,
  () => {
    error.value = "";
  }
);
</script>

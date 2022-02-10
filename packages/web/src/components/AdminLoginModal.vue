<template>
  <ModalBase
    title="Admin login"
    submit-text="Login"
    :show="show"
    @submit="submit"
    @close="$emit('close')"
  >
    <template #icon>
      <KeyIcon />
    </template>
    <template #main>
      <ModalError v-if="error" :error="error" />
      <ModalInput v-model="password" type="password" label="Password" />
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./ModalBase.vue";
import KeyIcon from "../icons/KeyIcon.vue";
import ModalInput from "./ModalInput.vue";
import { watch, ref } from "vue";
import { prettyError } from "../global/helpers";
import ModalError from "./ModalError.vue";
import { store } from "../global/store";

const error = ref("");
const password = ref("");

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
    password.value = localStorage.adminPassword;
  }
);

const submit = async () => {
  try {
    localStorage.adminPassword = password.value;

    await store.init();
    emit("close");
  } catch (e) {
    error.value = prettyError(e);
  }
};
</script>

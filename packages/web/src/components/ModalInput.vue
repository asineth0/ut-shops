<template>
  <div class="space-y-2 w-full">
    <p v-if="label">{{ label }}</p>
    <input
      ref="input"
      class="w-full px-4 py-2 text-gray-300 transition bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-gray-500"
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      @input="inputInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const input = ref<HTMLInputElement | null>(null);

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  autocomplete: {
    type: String,
    default: "",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "file"]);

onMounted(() => {
  if (input.value && props.autofocus) {
    input.value.focus();
  }
});

const inputInput = () => {
  if (!input.value) {
    return;
  }

  if (input.value.files) {
    emit("file", input.value.files[0]);

    return;
  }

  emit("update:modelValue", input.value.value);
};
</script>

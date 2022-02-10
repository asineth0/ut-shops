<template>
  <ModalBase
    title="Add item"
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
      <div class="space-y-2 w-full">
        <p>Tag</p>
        <InputList>
          <template #selected>
            {{ tag?.name || "None" }}
          </template>
          <template #items>
            <InputListItem
              v-for="tag2 in store.state.value.tags"
              :key="tag2.id"
              @click="tag = tag2"
            >
              {{ tag2.name }}
            </InputListItem>
          </template>
        </InputList>
      </div>
      <ModalInput v-model="name" type="text" label="Name" />
      <ModalInput v-model="description" type="text" label="Description" />
      <ModalInput v-model="price" type="number" label="Price" />
      <ModalInput type="file" label="Image" @file="image = $event" />
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./ModalBase.vue";
import ModalInput from "./ModalInput.vue";
import { watch, ref, Ref } from "vue";
import { fileToBase64, prettyError } from "../global/helpers";
import ModalError from "./ModalError.vue";
import PlusIcon from "../icons/PlusIcon.vue";
import { store } from "../global/store";
import { ITag } from "../global/types";
import InputList from "./InputList.vue";
import InputListItem from "./InputListItem.vue";
import axios from "axios";

const error = ref("");
const name = ref("");
const description = ref("");
const price = ref("0");
const image: Ref<File | null> = ref(null);
const tag: Ref<ITag | null> = ref(null);

const props = defineProps({
  show: {
    type: Boolean,
  },
});

const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    name.value = "";
    description.value = "";
    price.value = "0";
    image.value = null;

    if (!tag.value) {
      tag.value = store.state.value.tags[0];
    }
  }
);

const submit = async () => {
  try {
    error.value = "";

    if (!tag.value) {
      error.value = "Tag is required";
      return;
    }

    await axios.post("/api/items", {
      tagId: tag.value.id,
      name: name.value,
      description: description.value,
      image: image.value && (await fileToBase64(image.value)),
      price: +price.value,
    });

    await store.init();
    emit("close");
  } catch (e) {
    error.value = prettyError(e);
  }
};
</script>

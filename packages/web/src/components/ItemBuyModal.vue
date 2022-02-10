<template>
  <ModalBase
    :show="show"
    title="Buy item"
    submit-text="Buy"
    @submit="submit"
    @close="$emit('close')"
  >
    <template #icon>
      <ShoppingCartIcon />
    </template>
    <template #main>
      <ModalError v-if="error" :error="error" />
      <ModalInput v-model="username" type="text" label="Username" />
      <ModalInput v-model="amount" type="number" label="Amount" />
      <div class="space-y-2 w-full">
        <p>Variation</p>
        <InputList>
          <template #selected>
            {{ variation }}
          </template>
          <template #items>
            <InputListItem
              v-for="variation2 in usableVariations"
              :key="variation2"
              @click="variation = variation2"
            >
              {{ variation2 }}
            </InputListItem>
          </template>
        </InputList>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts" setup>
import ModalBase from "./ModalBase.vue";
import ShoppingCartIcon from "../icons/ShoppingCartIcon.vue";
import ModalInput from "./ModalInput.vue";
import { PropType, ref, watch } from "vue";
import { IItem } from "../global/types";
import { prettyError } from "../global/helpers";
import ModalError from "./ModalError.vue";
import InputList from "./InputList.vue";
import InputListItem from "./InputListItem.vue";
import { store } from "../global/store";
import axios from "axios";

const props = defineProps({
  show: {
    type: Boolean,
  },
  item: {
    type: Object as PropType<IItem>,
    default() {
      ///
    },
  },
});

const emit = defineEmits(["close"]);

const usableVariations =
  store.state.value.tags.find((tag) => tag.id === props.item.tagId)
    ?.variations || [];

const error = ref("");
const username = ref("");
const amount = ref("");
const variation = ref(usableVariations[0] || "Default");

const submit = async () => {
  try {
    error.value = "";

    await axios.post("/api/order", {
      itemId: props.item.id,
      amount: +amount.value,
      variation: variation.value,
      username: username.value,
    });

    emit("close");
  } catch (e) {
    error.value = prettyError(e);
  }
};

watch(
  () => username.value,
  () => {
    localStorage.username = username.value;
  }
);

watch(
  () => props.show,
  () => {
    username.value = localStorage.username || "";
    amount.value = "1";
  }
);
</script>

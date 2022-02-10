<template>
  <div>
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div
          class="w-16 h-16 rounded-md overflow-hidden bg-gray-800 text-gray-300"
        >
          <img
            v-if="!imageDefault"
            :src="`/api/items/${item.id}/image`"
            @error="imageDefault = true"
          />
          <div v-else class="p-4">
            <ShoppingBagIcon />
          </div>
        </div>
        <div>
          <div class="flex items-baseline space-x-2">
            <p class="font-bold text-xl">{{ item.name }}</p>
            <p class="text-gray-400">${{ item.price }}</p>
          </div>
          <p v-if="item.description" class="text-gray-300">
            {{ item.description }}
          </p>
        </div>
      </div>
      <div class="flex space-x-4">
        <template v-if="store.state.value.adminPassword">
          <div
            class="flex items-center space-x-2 p-2 bg-gray-800 rounded-md text-gray-300 hover:text-white cursor-pointer transition"
            @click="itemDeleteModal = true"
          >
            <TrashIcon class="w-5 h-5" />
            <p class="text-sm">Delete</p>
          </div>
          <div
            class="flex items-center space-x-2 p-2 bg-gray-800 rounded-md text-gray-300 hover:text-white cursor-pointer transition"
            @click="itemEditModal = true"
          >
            <PencilIcon class="w-5 h-5" />
            <p class="text-sm">Edit</p>
          </div>
        </template>
        <div
          class="flex items-center space-x-2 p-2 bg-gray-800 rounded-md text-gray-300 hover:text-white cursor-pointer transition"
          @click="itemBuyModal = true"
        >
          <ShoppingCartIcon class="w-5 h-5" />
          <p class="text-sm">Buy</p>
        </div>
      </div>
    </div>
    <ItemEditModal
      :item="item"
      :show="itemEditModal"
      @close="itemEditModal = false"
    />
    <ItemDeleteModal
      :item="item"
      :show="itemDeleteModal"
      @close="itemDeleteModal = false"
    />
    <ItemBuyModal
      :item="item"
      :show="itemBuyModal"
      @close="itemBuyModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import { IItem } from "../global/types";
import ShoppingBagIcon from "../icons/ShoppingBagIcon.vue";
import ShoppingCartIcon from "../icons/ShoppingCartIcon.vue";
import TrashIcon from "../icons/TrashIcon.vue";
import PencilIcon from "../icons/PencilIcon.vue";
import { store } from "../global/store";
import ItemDeleteModal from "./ItemDeleteModal.vue";
import ItemBuyModal from "./ItemBuyModal.vue";
import ItemEditModal from "./ItemEditModal.vue";

const imageDefault = ref(false);
const itemEditModal = ref(false);
const itemDeleteModal = ref(false);
const itemBuyModal = ref(false);

defineProps({
  item: {
    type: Object as PropType<IItem>,
    default() {
      //
    },
  },
});
</script>

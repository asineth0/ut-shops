<template>
  <div class="hidden">{{ usableItems }}</div>
  <div v-if="usableItems.length">
    <div
      class="flex items-center justify-between flex-1 pb-2 mb-4 border-b border-gray-800"
    >
      <div class="flex items-baseline space-x-2 text-xl">
        <p>{{ tag.name }}</p>
        <p class="text-gray-400">&bull; {{ usableItems.length }}</p>
      </div>
      <div v-if="store.state.value.adminPassword" class="-mr-1 space-x-2 flex">
        <div
          class="rounded-full bg-gray-900 border border-gray-600 p-1 w-6 h-6 text-gray-300 hover:text-white hover:bg-gray-500 cursor-pointer transition"
          @click.stop="tagDeleteModal = true"
        >
          <TrashIcon />
        </div>
        <div
          class="rounded-full bg-gray-900 border border-gray-600 p-1 w-6 h-6 text-gray-300 hover:text-white hover:bg-gray-500 cursor-pointer transition"
          @click.stop="tagEditModal = true"
        >
          <PencilIcon />
        </div>
      </div>
    </div>
    <div class="space-y-4">
      <ItemDetail v-for="item in usableItems" :key="item.id" :item="item" />
    </div>
    <TagDeleteModal
      :tag="tag"
      :show="tagDeleteModal"
      @close="tagDeleteModal = false"
    />
    <TagEditModal
      :tag="tag"
      :show="tagEditModal"
      @close="tagEditModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref } from "vue";
import { ITag } from "../global/types";
import { store } from "../global/store";
import PencilIcon from "../icons/PencilIcon.vue";
import TrashIcon from "../icons/TrashIcon.vue";
import TagDeleteModal from "./TagDeleteModal.vue";
import TagEditModal from "./TagEditModal.vue";
import ItemDetail from "./ItemDetail.vue";

const props = defineProps({
  tag: {
    type: Object as PropType<ITag>,
    default() {
      //
    },
  },
  search: {
    type: String,
    default() {
      //
    },
  },
});

const tagDeleteModal = ref(false);
const tagEditModal = ref(false);

const usableItems = computed(() => {
  return store.state.value.items.filter(
    (item) =>
      item.tagId === props.tag.id &&
      [item.name, item.description]
        .join("")
        .toLowerCase()
        .includes(props.search.toLowerCase())
  );
});
</script>

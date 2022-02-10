<template>
  <div>
    <InputListItem>
      <div class="flex items-center justify-between flex-1">
        <p>{{ tag.name }}</p>
        <div
          v-if="store.state.value.adminPassword"
          class="-mr-1 space-x-2 flex"
        >
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
    </InputListItem>
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
import { PropType, ref } from "vue";
import { ITag } from "../global/types";
import InputListItem from "./InputListItem.vue";
import { store } from "../global/store";
import PencilIcon from "../icons/PencilIcon.vue";
import TrashIcon from "../icons/TrashIcon.vue";
import TagDeleteModal from "./TagDeleteModal.vue";
import TagEditModal from "./TagEditModal.vue";

const tagDeleteModal = ref(false);
const tagEditModal = ref(false);

defineProps({
  tag: {
    type: Object as PropType<ITag>,
    default() {
      //
    },
  },
});
</script>

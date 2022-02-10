<template>
  <div class="flex flex-col items-center space-y-4 py-8 bg-gray-800">
    <img src="./assets/logo.png" class="w-32 h-32 rounded-full" />
    <p class="font-bold text-2xl">Atriplex Industries</p>
  </div>
  <div class="max-w-4xl w-full mx-auto py-4 space-y-4">
    <div
      v-if="store.state.value.adminPassword"
      class="flex justify-center space-x-4"
    >
      <div
        class="flex items-center space-x-2 p-2 bg-gray-800 rounded-md text-gray-300 hover:text-white cursor-pointer transition"
        @click="tagAddModal = true"
      >
        <PlusIcon class="w-5 h-5" />
        <p class="text-sm">Add tag</p>
      </div>
      <div
        class="flex items-center space-x-2 p-2 bg-gray-800 rounded-md text-gray-300 hover:text-white cursor-pointer transition"
        @click="itemAddModal = true"
      >
        <PlusIcon class="w-5 h-5" />
        <p class="text-sm">Add item</p>
      </div>
    </div>
    <ModalInput
      v-model="search"
      type="text"
      class="flex-1"
      placeholder="Search"
    />
    <div class="space-y-4">
      <TagDetail
        v-for="tag in store.state.value.tags"
        :key="tag.id"
        :tag="tag"
        :search="search"
      />
    </div>
  </div>
  <AdminLoginModal :show="adminLoginModal" @close="adminLoginModal = false" />
  <TagAddModal :show="tagAddModal" @close="tagAddModal = false" />
  <ItemAddModal :show="itemAddModal" @close="itemAddModal = false" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdminLoginModal from "./components/AdminLoginModal.vue";
import { store } from "./global/store";
import PlusIcon from "./icons/PlusIcon.vue";
import ItemAddModal from "./components/ItemAddModal.vue";
import ModalInput from "./components/ModalInput.vue";
import TagAddModal from "./components/TagAddModal.vue";
import TagDetail from "./components/TagDetail.vue";

const adminLoginModal = ref(false);
const tagAddModal = ref(false);
const itemAddModal = ref(false);
const search = ref("");

let keys: string[] = [];

addEventListener("keydown", ({ key }) => {
  keys.push(key);

  if (keys.length > 10) {
    keys = keys.slice(-10);
  }

  if (keys.join("").endsWith("admin")) {
    adminLoginModal.value = true;
  }
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  -webkit-tap-highlight-color: transparent;
}

* {
  @apply focus:outline-none;
}

::-webkit-scrollbar {
  @apply w-2;
}

::-webkit-scrollbar-thumb {
  @apply bg-white bg-opacity-10 rounded-sm;
}

body {
  @apply bg-gray-900 text-white selection:bg-primary-400 selection:text-black;
}
</style>

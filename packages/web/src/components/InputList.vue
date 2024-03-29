<template>
  <div ref="root" class="cursor-pointer" @click="open = !open">
    <div
      class="flex items-center justify-between px-4 py-2 text-gray-300 transition bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-gray-500"
    >
      <div class="flex items-center space-x-2">
        <slot name="selected" />
      </div>
      <ChevronDownIcon class="w-4 h-4 text-gray-400" />
    </div>
    <div class="relative z-20">
      <transition
        enter-active-class="transition transform ease-out duration-100 origin-top"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition transform ease-in duration-75 origin-top"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="open"
          class="absolute flex flex-col -mt-px space-y-1 bg-gray-800 border border-gray-600 rounded-md w-full max-h-32 overflow-auto shadow-lg"
        >
          <slot name="items" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChevronDownIcon from "../icons/ChevronDownIcon.vue";
import { onBeforeUnmount, ref, Ref } from "vue";

const open = ref(false);
const root: Ref<HTMLDivElement | null> = ref(null);

const close = ({ target }: { target: EventTarget | null }) => {
  let el = target as HTMLElement;

  let isFromRoot = false;

  while (el.parentElement) {
    if (el.parentElement === root.value) {
      isFromRoot = true;
    }

    el = el.parentElement;
  }

  if (!isFromRoot) {
    open.value = false;
  }
};

addEventListener("click", close);

onBeforeUnmount(() => {
  removeEventListener("click", close);
});
</script>

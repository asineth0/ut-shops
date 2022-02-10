import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./global/store";

await store.init();

createApp(App).mount("#app");

if (import.meta.env.DEV) {
  (window as unknown as { store: typeof store }).store = store;
}

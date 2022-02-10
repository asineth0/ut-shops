import { IState } from "./types";
import { ref } from "vue";
import axios from "axios";

export const store = {
  state: ref<IState>({
    tags: [],
    items: [],
  }),
  async init() {
    const { data } = await axios.get("/api/all");
    this.state.value.tags = data.tags;
    this.state.value.items = data.items;

    if (localStorage.adminPassword) {
      try {
        await axios.post("/api/admin", {
          password: localStorage.adminPassword,
        });

        this.state.value.adminPassword = localStorage.adminPassword;
      } catch {
        //
      }
    }
  },
};

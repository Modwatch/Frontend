import Vue from "vue";

export function modlists(state, value) {
  Vue.set(state.persistent, "modlists", value);
}

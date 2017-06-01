import Vue from "vue";

const { set } = Vue;

export function modlists(state, value) {
  set(state, "modlists", value);
}

export function modlist(state, value) {
  set(state, "modlist", value);
}

export function filetype(state, {type, value}) {
  set(state.modlist, type, value);
}

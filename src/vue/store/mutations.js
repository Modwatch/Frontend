import Vue from "vue";
import { state } from "./state";

const { set } = Vue;

export function modlists(state, value) {
  set(state, "modlists", value);
}

export function modlist(state, value) {
  set(state, "modlist", {...state.modlist, ...value});
}

export function filetype(state, {type, value}) {
  set(state.modlist, type, value);
}

export function modlistfilter(state, value = "") {
  set(state, "modlistfilter", value);
}

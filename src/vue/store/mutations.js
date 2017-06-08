import Vue from "vue";
import { state, user } from "./state";
import jwtDecode from "jwt-decode";

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

export function login(state, token) {
  set(state, "user", {
    token,
    authenticated: true,
    username: jwtDecode(token).sub
  });
}

export function logout(state) {
  set(state, "user", user);
}

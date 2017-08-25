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

export function toggleActiveMods(state, value) {
  set(state, "showInactiveMods", !state.showInactiveMods);
}

export function login(state, token) {
  const { sub, scopes } = jwtDecode(token);
  set(state, "user", {
    token,
    authenticated: true,
    username: sub,
    scopes
  });
}

export function pushNotification(state, notification) {
  set(state, "notifications", [...state.notifications, notification]);
}

export function popNotification({ notifications }) {
  if(notifications.length > 0) {
    set(state, "notifications", notifications.slice(1))
  }
}

export function logout(state) {
  set(state, "user", user);
}

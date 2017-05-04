import Vue from "vue";
import Vuex from "vuex";

import * as mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

const persistent = localStorage.getItem("modwatch.persistent");
const fallback = {
  modlists: []
};

export default new Vuex.Store({
  state: {
    persistent: (persistent ? JSON.parse(persistent) : fallback),
    modlist: {
      profile: {
        "timestamp": undefined,
        "tag": undefined,
        "game": undefined,
        "enb": undefined
      },
      files: []
    },
    user: {
      authenticated: false,
      username: undefined
    }
  },
  mutations,
  actions
})

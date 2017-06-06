import Vue from "vue";
import Vuex from "vuex";

import * as mutations from "./mutations";
import * as getters from "./getters";
import * as actions from "./actions";
import { state } from "./state";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

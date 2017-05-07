import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./home.jsx";
import Login from "./login.jsx";
import Modlist from "./modlist.jsx";

Vue.use(VueRouter);

const routes = [{
  path: "/",
  name: "Home",
  component: Home
}, {
  path: "/login",
  name: "Login",
  component: Login
}, {
  path: "/u/:username",
  name: "Modlist",
  component: Modlist
}];

export default new VueRouter({
  mode: "history",
  routes
});

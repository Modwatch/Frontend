import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./home.jsx";
import Login from "./login.jsx";
import Modlist from "./modlist/index.jsx";
  import PluginsFile from "./modlist/pluginsFile.jsx";
  import ModlistFile from "./modlist/modlistFile.jsx";
  import IniFile from "./modlist/iniFile.jsx";
  import PrefsIniFile from "./modlist/prefsIniFile.jsx";

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
  component: Modlist,
  children: [{
    path: "",
    redirect: "plugins"
  }, {
    path: "plugins",
    component: PluginsFile
  }, {
    path: "modlist",
    name: "modlist",
    component: ModlistFile
  }, {
    path: "ini",
    name: "ini",
    component: IniFile
  }, {
    path: "prefsini",
    name: "prefsini",
    component: PrefsIniFile
  }]
}];

export default new VueRouter({
  mode: "history",
  routes
});

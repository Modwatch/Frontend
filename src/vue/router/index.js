import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store/index.js";

import NotFound from "./notFound.jsx";

const Home = () =>
  import(/* webpackChunkName : "home" */ "./home.jsx").then(c => c.default);
const Oauth = () =>
  import(/* webpackChunkName : "oauth" */ "./oauth.jsx").then(c => c.default);
const Uploader = () =>
  import(/* webpackChunkName : "uploader" */ "./uploader.jsx").then(
    c => c.default
  );

const Modlist = () =>
  import(/* webpackChunkName : "modlist" */ "./modlist/index.jsx").then(
    c => c.default
  );
const PluginsFile = () =>
  import(/* webpackChunkName : "modlist" */ "./modlist/pluginsFile.jsx").then(
    c => c.default
  );
const ModlistFile = () =>
  import(/* webpackChunkName : "modlist" */ "./modlist/modlistFile.jsx").then(
    c => c.default
  );
const IniFile = () =>
  import(/* webpackChunkName : "modlist" */ "./modlist/iniFile.jsx").then(
    c => c.default
  );
const PrefsIniFile = () =>
  import(/* webpackChunkName : "modlist" */ "./modlist/prefsIniFile.jsx").then(
    c => c.default
  );

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: process.env.MODWATCH_ENV !== "local" ? Home : Uploader
  },
    {
      path: "/home",
      component: Home
    },
  {
    path:
      "/oauth/access_token/:access_token/token_type/:token_type/expires_in/:expires_in",
    component: Oauth
  },
  {
    path: "/u/:username",
    component: Modlist,
    beforeEnter(to, from, next) {
      store
        .dispatch("getModlist", to.params.username)
        .then(() => next())
        .catch(() => next("/404"));
    },
    children: [
      {
        path: "",
        redirect: "plugins"
      },
      {
        path: "plugins",
        component: PluginsFile
      },
      {
        path: "modlist",
        name: "modlist",
        component: ModlistFile
      },
      {
        path: "ini",
        name: "ini",
        component: IniFile
      },
      {
        path: "prefsini",
        name: "prefsini",
        component: PrefsIniFile
      }
    ]
  }
]
  .concat(
    process.env.MODWATCH_ENV !== "local"
      ? []
      : [
          {
            path: "/uploader",
            name: "Uploader",
            component: Uploader
          }
        ]
  )
  .concat([
    {
      path: "*",
      name: "Not Found",
      component: NotFound
    }
  ]);

export default new VueRouter({
  mode: "history",
  routes
});

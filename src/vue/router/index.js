import Router, { route } from "preact-router";
import { h, Component } from "preact";

// import Oauth from "./oauth.jsx";
import NotFound from "./notFound.jsx";
import Home from "./home.jsx";
import Modlist from "./modlist/index.jsx";
import PluginsFile from "./modlist/pluginsFile.jsx";
import ModlistFile from "./modlist/modlistFile.jsx";
import IniFile from "./modlist/iniFile.jsx";
import PrefsIniFile from "./modlist/prefsIniFile.jsx";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/u/:username",
    component: Modlist
    // beforeEnter(to, from, next) {
    //   store
    //     .dispatch("getModlist", to.params.username)
    //     .then(() => next())
    //     .catch(() => next("/404"));
  },
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
];

class Redirect extends Component {
  componentWillMount() {
    route(this.props.to, true);
  }

  render() {
    return null;
  }
}

export default () => (
  <Router>
    <Home path="/" />
    <Modlist path="/u/:username/:filetype" />
    {/* <PluginsFile path="/u/:username/plugins" />
    <IniFile path="/u/:username/ini" />
    <PrefsIniFile path="/u/:username/prefsini" />
    <Redirect path="u/:username" to="/u/:username/plugins" /> */}
  </Router>
);

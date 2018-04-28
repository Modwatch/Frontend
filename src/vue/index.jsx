import Vue from "vue";
import { mapState } from "vuex";

import store from "./store/index";
import router from "./router/index";

import modwatchNav from "./components/modwatch-nav.jsx";
import modwatchModlists from "./components/modwatch-modlists.jsx";
import modwatchFile from "./components/modwatch-file.jsx";
import modwatchNotifications from "./components/modwatch-notifications.jsx";

import styles from "../css/index.css";

Vue.component("modwatchModlists", modwatchModlists);
Vue.component("modwatchFile", modwatchFile);
Vue.component("modwatchNotifications", modwatchNotifications);

console.log(`Modwatch:
VERSION:\t${process.env.VERSION}
NODE_ENV:\t${process.env.NODE_ENV}`);

const pathname = window.location.pathname;

if (pathname.indexOf("/oauth/access_token/") === 0) {
  history.replaceState(null, null, "/");
  try {
    const [, , , access_token, , token_type, , expires_in] = pathname.split(
      "/"
    );
    if (access_token) {
      store.dispatch("verify", { access_token }).then(valid => {
        if (!valid) {
          store.dispatch("notification", { notification: "Invalid Token" });
          store.dispatch("logout");
        }
        store.dispatch("notification", {
          notification: "Successfully Logged In"
        });
        store.commit("login", access_token);
      });
    }
  } catch (e) {
    store.dispatch("notification", { notification: "Invalid Token" });
    store.dispatch("logout");
  }
}

new Vue({
  el: "#modwatch-app",
  computed: {
    ...mapState(["user", "notifications"])
  },
  methods: {
    logout() {
      return this.$store.dispatch("logout");
    }
  },
  render(h) {
    return (
      <div>
        <transition name="fade">
          {this.notifications.length > 0 && (
            <modwatch-notifications notifications={this.notifications} />
          )}
        </transition>
        <header>
          <h1 class="header">
            <router-link class="no-underline" to="/">
              MODWATCH
            </router-link>
          </h1>
        </header>
        <modwatch-nav
          authenticated={this.user.authenticated}
          user={this.user.username}
          logout={this.logout}
        />
        <div class="content-wrapper">
          <div class="view-wrapper">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
    );
  },
  components: {
    modwatchNav
  },
  store,
  router,
  created() {
    if (this.$store.state.user.authenticated) {
      this.$store.dispatch("verify").then(valid => {
        if (!valid) {
          this.$store.dispatch("logout");
        }
      });
    }
  }
});

if (process.env.NODE_ENV === "production") {
  import("./ga.js");
}

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

new Vue({
  el: "#modwatch-app",
  computed: {
    ...mapState([
      "user",
      "notifications"
    ])
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
          {this.notifications.length > 0 && <modwatch-notifications notifications={this.notifications}></modwatch-notifications>}
        </transition>
        <header>
          <h1 class="header"><router-link class="no-underline" to="/">MODWATCH</router-link></h1>
        </header>
        <modwatch-nav authenticated={this.user.authenticated} user={this.user.username} logout={this.logout}></modwatch-nav>
        <div class="content-wrapper">
          <div class="view-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
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
    if(this.$store.state.user.authenticated) {
      this.$store.dispatch("verify")
      .then(valid => {
        if(!valid) {
          this.$store.dispatch("logout");
        }
      });
    }
  }
});

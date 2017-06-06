import Vue from "vue";
import { mapState } from "vuex";

import store from "./store/index";
import router from "./router/index";

import modwatchNav from "./components/modwatch-nav.jsx";
import modwatchModlists from "./components/modwatch-modlists.jsx";
import modwatchFile from "./components/modwatch-file.jsx";

Vue.component("modwatchModlists", modwatchModlists);
Vue.component("modwatchFile", modwatchFile);

new Vue({
  el: "#modwatch-app",
  computed: {
    ...mapState([
      "user"
    ])
  },
  render(h) {
    return (
      <div>
        <header>
          <h1 id="header"><router-link to="/">MODWATCH</router-link></h1>
        </header>
        <modwatch-nav authenticated={this.user.authenticated} user={this.user.username}></modwatch-nav>
        <div class="content-wrapper">
          <article class="view-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </article>
        </div>
      </div>

    );
  },
  components: {
    modwatchNav
  },
  store,
  router
});

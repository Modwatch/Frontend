import { render, h, Component } from "preact";
import { Link } from "preact-router";
import Router from "./router";

// import store from "./store/index";
import { verify, logout, login } from "./auth";
import router from "./router/index";

import ModwatchNav from "./components/modwatch-nav.jsx";
import ModwatchModlists from "./components/modwatch-modlists.jsx";
import ModwatchNotifications from "./components/modwatch-notifications.jsx";

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
      verify({ access_token }).then(valid => {
        if (!valid) {
          logout();
          return;
        }
        login({ access_token });
      });
    }
  } catch (e) {
    // store.dispatch("notification", { notification: "Invalid Token" });
    logout();
    // store.dispatch("logout");
  }
}

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        authenticated: false
      },
      notifications: []
    };
  }
  render(props, state) {
    return <div>
        {/* <transition name="fade"> */}
          {state.notifications.length > 0 && (
            <ModwatchNotifications notifications={state.notifications} />
          )}
        {/* </transition> */}
        <header>
          <h1 class="header">
            <Link class="no-underline" to="/">
              MODWATCH
            </Link>
          </h1>
        </header>
        <ModwatchNav authenticated={state.user.authenticated} user={state.user.username} logout={logout} />
        <div class="content-wrapper">
          <div class="view-wrapper">
            {/* <transition name="fade" mode="out-in"> */}
              <Router />
            {/* </transition> */}
          </div>
        </div>
      </div>;
  }
}

const dom = document.getElementById("modwatch-app");
render(
  <Root />,
  dom,
  dom.lastElementChild
);

// new Vue({
//   el: "#modwatch-app",
//   computed: {
//     ...mapState(["user", "notifications"])
//   },
//   methods: {
//     logout() {
//       return this.$store.dispatch("logout");
//     }
//   },
//   render(h) {
//     return (
//       <div>
//         <transition name="fade">
//           {this.notifications.length > 0 && (
//             <modwatch-notifications notifications={this.notifications} />
//           )}
//         </transition>
//         <header>
//           <h1 class="header">
//             <router-link class="no-underline" to="/">
//               MODWATCH
//             </router-link>
//           </h1>
//         </header>
//         <modwatch-nav
//           authenticated={this.user.authenticated}
//           user={this.user.username}
//           logout={this.logout}
//         />
//         <div class="content-wrapper">
//           <div class="view-wrapper">
//             <transition name="fade" mode="out-in">
//               <router-view />
//             </transition>
//           </div>
//         </div>
//       </div>
//     );
//   },
//   components: {
//     modwatchNav
//   },
//   store,
//   router,
//   created() {
//     if (this.$store.state.user.authenticated) {
//       this.$store.dispatch("verify").then(valid => {
//         if (!valid) {
//           this.$store.dispatch("logout");
//         }
//       });
//     }
//   }
// });

// if (process.env.NODE_ENV === "production") {
//   // require("./ga.js");
// }

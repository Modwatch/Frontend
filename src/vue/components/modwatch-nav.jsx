import Login from "./modwatch-login.jsx";

export default {
  props: {
    authenticated: {
      type: Boolean,
      default: false
    },
    user: {
      type: String,
      default: ""
    },
    logout: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    profile() {
      if(this.$route.path.indexOf("/u/") === 0) {
        this.$store.dispatch("getModlist", this.user);
        this.$router.push(`/u/${this.user}`);
      } else {
        this.$router.push(`/u/${this.user}`);
      }
    },
    uploader() {
      this.$router.push("/uploader");
    }
  },
  render(h) {
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow}></div>
				<nav class={this.show ? "menu-main menu-active" : "menu-main"} onClick={this.toggleShow}>
          <router-link to="/" class="nav-block">Home</router-link>
          <Login user={this.user} linkClass="nav-block" />
          {/* {!this.authenticated ? <Login><a class="nav-block">Login</a></Login> : <a onClick={ this.logout } class="nav-block">Logout</a>} */}
          {this.authenticated && <a onClick={this.profile} class="nav-block">Profile</a>}
          <span class="nav-block">Close</span>
				</nav>
			</div>
    );
  }
}

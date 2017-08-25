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
      show: false,
      loginLink: `${process.env.MODWATCH_API_URL}/oauth/authorize`,
      redirect_uri: encodeURIComponent(`${window.location.protocol}//${window.location.host}/`)
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    login() {
      window.location.replace(`${this.loginLink}?client_id=modwatch&redirect_uri=${this.redirect_uri}&response_type=code`)
    },
    profile() {
      if(this.$route.path.indexOf("/u/") === 0) {
        this.$store.dispatch("getModlist", this.user);
        this.$router.push(`/u/${this.user}`);
      } else {
        this.$router.push(`/u/${this.user}`);
      }
    }
  },
  render(h) {
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow}></div>
				<nav class={this.show ? "menu-main menu-active" : "menu-main"} onClick={this.toggleShow}>
          <router-link to="/" class="nav-block">Home</router-link>
          {!this.authenticated ? <a onClick={this.login} class="nav-block">Login</a> : <a onClick={ this.logout } class="nav-block">Logout</a>}
          {this.authenticated && <a onClick={this.profile} class="nav-block">Profile</a>}
          <span class="nav-block">Close</span>
				</nav>
			</div>
    );
  }
}

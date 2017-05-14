export default {
  props: {
    authenticated: {
      type: Boolean,
      default: false
    },
    user: {
      type: String
    }
  },
  data() {
    return {
      show: false,
      loginLink: "http://localhost:3001/oauth/authorize",
      logoutLink: "http://localhost:30001/oauth/endsession"
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  },
  render(h) {
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow}></div>
				<nav class={this.show ? "menu-main active" : "menu-main"} onClick={this.toggleShow}>
          <router-link to={ {name: "Home"} } class="nav-block">Home</router-link>
          {!this.authenticated ? <a href={this.loginLink} class="nav-block">Login</a> : <a href={ this.logoutLink} class="nav-block">Logout</a>}
          {this.authenticated && <router-link to={ {name: this.user} } class="nav-block">Profile</router-link>}
          <span class="nav-block">Close</span>
				</nav>
			</div>
    );
  }
}

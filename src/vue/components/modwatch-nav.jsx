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
      show: false
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
        <div v-once class="menu-toggle" onClick={this.toggleShow}></div>
				<nav class={this.show ? "menu-main active" : "menu-main"} onClick={this.toggleShow}>
          <router-link to={ {name: "Home"} } class="nav-block">Home</router-link>
          {!this.authenticated ? <router-link to={ {name: "Login"} } class="nav-block">Login</router-link> : <router-link to={ {name: "Login"} } class="nav-block">Logout</router-link>}
          {this.authenticated && <router-link to={ {name: this.user} } class="nav-block">Profile</router-link>}
          <span v-once class="nav-block">Close</span>
				</nav>
			</div>
    );
  }
}

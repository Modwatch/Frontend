import Vue from "vue";
import { mapState } from "vuex";

Vue.component("modwatch-nav", {
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapState({
      authenticated: state => state.user.authenticated
    })
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    goto(r) {
      this.$router.push(r);
    }
  },
  render(h) {
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow}></div>
				<nav class={this.show ? "menu-main active" : "menu-main"} onClick={this.toggleShow}>
          <a onClick={this.goto({name: "Home"})} class="nav-block">Home</a>
          {!this.authenticated ? <a onClick={this.goto({name: "Login"})} class="nav-block">Login</a> : <a onClick={this.goto({name: "Login"})} class="nav-block">Logout</a>}
          {this.authenticated && <a onClick={this.goto({name: "Profile"})} class="nav-block">Profile</a>}
          <span class="nav-block">Close</span>
				</nav>
			</div>
    );
  }
});

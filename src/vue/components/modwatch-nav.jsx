import { h, Component } from "preact";
import { route } from "preact-router";
import { Link } from "preact-router/match";

export default class ModwatchNav extends Component {
  state = {
    show: false,
    loginLink: `${process.env.MODWATCH_API_URL}/oauth/authorize`,
    redirect_uri: encodeURIComponent(
      `${window.location.protocol}//${window.location.host}/`
    )
  };
  toggleShow() {
    this.setState(({ show }) => ({
      show: !show
    }));
  }
  login() {
    window.location.replace(
      `${this.state.loginLink}?client_id=modwatch&redirect_uri=${
        this.state.redirect_uri
      }&response_type=code`
    );
  }
  gotoProfile() {
    if (window.location.href.indexOf("/u/") === 0) {
      this.props.getModlist(this.props.user);
      route(`/u/${this.props.user}`);
    } else {
      route(`/u/${this.props.user}`);
    }
  }
  render(props, state) {
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow} />
        <nav
          class={state.show ? "menu-main menu-active" : "menu-main"}
          onClick={this.toggleShow}
        >
          <Link href="/" class="nav-block">
            Home
          </Link>
          {!props.authenticated ? (
            <a onClick={this.login} class="nav-block">
              Login
            </a>
          ) : (
            <a onClick={props.logout} class="nav-block">
              Logout
            </a>
          )}
          {props.authenticated && (
            <a onClick={this.gotoProfile} class="nav-block">
              Profile
            </a>
          )}
          <span class="nav-block">Close</span>
        </nav>
      </div>
    );
  }
}

import { h, Component } from "preact";
import { route } from "preact-router";
import { Link } from "preact-router";

import "./modwatch-nav.css";

import { StoreProps } from "../types";

export default class ModwatchNav extends Component<
  StoreProps,
  {
    show: boolean;
    loginLink: string;
    redirect_uri: string;
  }
> {
  state = {
    show: false,
    loginLink: `${process.env.API_URL}/oauth/authorize`,
    redirect_uri: encodeURIComponent(
      `${window.location.protocol}//${window.location.host}/`
    )
  };
  toggleShow = () => {
    this.setState(({ show }) => ({
      show: !show
    }));
  };
  login = () => {
    window.location.replace(
      `${this.state.loginLink}?client_id=modwatch&redirect_uri=${this.state.redirect_uri}&response_type=code`
    );
  };
  logout = () => {
    this.props.logout();
    this.props.addNotification("Logged Out");
  };
  gotoProfile = () => {
    if (this.props.user) {
      route(`/u/${this.props.user.username}`);
      this.props.addNotification("Viewing Your Profile");
    }
  };
  gotoHome = () => {
    route("/");
  };
  render() {
    const authenticated = this.props.user
      ? this.props.user.authenticated
      : false;
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow} />
        <nav
          class={this.state.show ? "menu-main menu-active" : "menu-main"}
          onClick={this.toggleShow}
        >
          <a onClick={this.gotoHome} class="nav-block">
            Home
          </a>
          {!authenticated ? (
            <a onClick={this.login} class="nav-block">
              Login
            </a>
          ) : (
            <a onClick={this.logout} class="nav-block">
              Logout
            </a>
          )}
          {authenticated && (
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

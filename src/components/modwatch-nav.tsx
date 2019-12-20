import { h, Component } from "preact";
import { route } from "preact-router";

import "@modwatch/core/src/components/modwatch-nav.css";
import ModwatchNav from "@modwatch/core/src/components/modwatch-nav";

import { StoreProps } from "../types";

export default class Nav extends Component<
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
      <ModwatchNav {...this.props}>
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
      </ModwatchNav>
    );
  }
}

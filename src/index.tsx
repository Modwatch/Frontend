// import "preact/debug"; ///DEV_ONLY
import { render, h, Component } from "preact";
import { Link } from "preact-router";
import { Provider, connect } from "unistore/preact";
import "unfetch/polyfill/index"; ///NOMODULE_ONLY

import "./global.css";

import Router from "./router";
import { rawState, store, actions } from "./store";
import { verify } from "./store/pure";

import Nav from "./components/modwatch-nav";
import Notifications from "./components/modwatch-notifications";

import { StoreProps } from "./types";

import "./ga"; ///PROD_ONLY

console.log(`Modwatch:
VERSION:\t${process.env.VERSION}
NODE_ENV:\t${process.env.NODE_ENV}`);

const pathname = window.location.pathname;

const token = (() => {
  if (pathname.indexOf("/oauth/access_token/") === 0) {
    history.replaceState(null, null, "/");
    try {
      const [, , , token, , token_type, , expires_in] = pathname.split("/");
      return token;
    } catch (e) {
      return "401";
    }
  }
  return undefined;
})();

class Root extends Component<StoreProps & { token: string }, {}> {
  componentDidMount = async () => {
    if (!this.props.token && this.props.user && this.props.user.authenticated) {
      setTimeout(
        () =>
          this.props.addNotification(
            `Welcome Back, ${this.props.user.username}`
          ),
        1
      );
    } else if (this.props.token === "401" || !(await verify(token))) {
      if(!this.props.user || !this.props.user.authenticated) {
        return;
      }
      this.props.logout();
      setTimeout(
        () =>
          this.props.addNotification("Login Failed", {
            type: "error"
          }),
        1
      );
    } else {
      this.props.login(token);
      setTimeout(() => this.props.addNotification("Login Successful"), 1);
    }
  };
  render() {
    return (
      <div>
        <Notifications {...this.props} />
        <header>
          <h1 class="header">
            <Link class="no-underline" href="/">
              MODWATCH
            </Link>
          </h1>
        </header>
        <Nav {...this.props} />
        <div class="content-wrapper">
          <div class="view-wrapper">
            <Router {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const Connector = connect(
  Object.keys(rawState),
  actions
)(props => (
  //@ts-ignore I don't know how to pass types to connect
  <Root {...props} token={token} />
));

render(
  <Provider store={store}>
    <Connector />
  </Provider>,
  document.getElementById("modwatch-app")
);

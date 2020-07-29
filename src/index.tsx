import "preact/debug"; ///DEV_ONLY
import "unfetch/polyfill/index"; ///NOMODULE_ONLY

import { render, h } from "preact";

import { useEffect } from "preact/hooks";
import { MDXProvider } from "@mdx-js/preact";
import { Link } from "wouter-preact";
import { Provider, connect } from "unistore/preact";

import "@modwatch/core/src/global.css";

import Router from "./router";
import { rawState, store, actions } from "./store";
import { verify } from "./store/pure";

import "@modwatch/core/src/components/modwatch-notifications.css";
import { ModwatchNotifications } from "@modwatch/core/src/components/modwatch-notifications";

import Nav from "./components/modwatch-nav";

import { StoreProps } from "./types";

import "./ga"; ///PROD_ONLY

console.log(`Modwatch:
VERSION:\t${process.env.VERSION}
NODE_ENV:\t${process.env.NODE_ENV}
ADSENSE_ENABLED:\t${process.env.ADSENSE_ENABLED}`);

const pathname = window.location.pathname;

const token = (function () {
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

const Root = (props: StoreProps & { token: string }) => {
  useEffect(() => {
    const asyncWrapper = async () => {
      if (!props.token && props.user && props.user.authenticated) {
        window.setTimeout(
          () => props.addNotification(`Welcome Back, ${props.user.username}`),
          1
        );
      } else if (props.token === "401" || (await verify(token))) {
        if (!props.user || !props.user.authenticated) {
          return;
        }
        props.logout();
        window.setTimeout(
          () =>
            props.addNotification("Login Failed", {
              type: "error",
            }),
          1
        );
      } else if (token) {
        props.login(token);
        window.setTimeout(() => props.addNotification("Login Successful"), 1);
      }
    };
    asyncWrapper();
  }, []);

  return (
    <div>
      <ModwatchNotifications {...props} />
      <header>
        <h1 class="header">
          <Link class="no-underline" href="/">
            MODWATCH
          </Link>
        </h1>
      </header>
      <Nav {...props} />
      <div class="content-wrapper">
        <div class="view-wrapper">
          <Router {...props} />
        </div>
      </div>
    </div>
  );
};

const mdxComponents = {
  wrapper: (props) => {
    const { metadata } = props;
    return (
      <section class="post-wrapper">
        <h1>{metadata.title}</h1>
        <div {...props} />
      </section>
    );
  },
};

const Connector = connect(
  Object.keys(rawState),
  actions
)(function (props) {
  return (
    <MDXProvider components={mdxComponents}>
      {/*@ts-ignore I don't know how to pass types to connect*/}
      <Root {...props} token={token} />
    </MDXProvider>
  );
});

render(
  <Provider store={store}>
    <Connector />
  </Provider>,
  document.getElementById("modwatch-app")
);

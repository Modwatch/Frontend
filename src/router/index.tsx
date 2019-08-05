import { h, Component } from "preact";
import Router, { route } from "preact-router";
import AsyncRoute from "../components/asyncRoute";

import NotFound from "./notFound";
import Post from "../components/post";
import { RouteProps, StoreProps } from "../types";

const ROUTE_TRANSITION_TIMEOUT = 150; // needs to match transition duration in src/global.css

export default class Routes extends Component<
  StoreProps,
  { fading: boolean; timeout: boolean }
> {
  state = {
    fading: false,
    timeout: false
  };
  cancelRouteChange = false;
  wrappedImport = importedComponent => {
    return importedComponent.then(() => {
      this.setState(() => ({
        fading: false
      }));
      return importedComponent;
    });
  };
  importPost = async (url, cb, props) => {
    const DynamicPost = await this.wrappedImport(import(`./${props.title}.js`));
    return <Post {...DynamicPost.metadata} content={DynamicPost.default} />;
  };
  routeChange = e => {
    if (this.cancelRouteChange) {
      this.cancelRouteChange = false;
      return;
    }
    if (this.state.fading || this.state.timeout) {
      return;
    }
    if (
      e.previous &&
      e.previous.indexOf("/u/") === 0 &&
      e.current.key === "modlist" &&
      e.current.props.matches.username ===
        e.previous.slice(3, e.current.props.matches.username.length + 3)
    ) {
      return;
    }
    e.previous && route(e.previous, true);
    setTimeout(() => {
      this.setState(
        () => ({
          timeout: false
        }),
        () => {
          if (e.previous) {
            this.cancelRouteChange = true;
            route(e.url, true);
          }
        }
      );
    }, ROUTE_TRANSITION_TIMEOUT);
    this.setState(() => ({
      fading: true,
      timeout: true
    }));
  };
  render() {
    return (
      <div
        class={`router-wrapper ${
          this.state.fading || this.state.timeout ? "fading" : ""
        }`}
      >
        <Router onChange={this.routeChange}>
          <AsyncRoute
            key={"home"}
            path="/"
            {...(this.props as RouteProps)}
            getComponent={() =>
              this.wrappedImport(import("./home").then(c => c.default))
            }
          />
          <AsyncRoute
            key="modlist"
            path="/u/:username/:filetype?"
            {...(this.props as RouteProps)}
            getComponent={() =>
              this.wrappedImport(
                import("./modlist").then(c => {
                  return c.default;
                })
              )
            }
          />
          <AsyncRoute
            key="posts"
            path="/posts"
            {...(this.props as RouteProps)}
            getComponent={() =>
              this.wrappedImport(import("./posts/index").then(c => c.default))
            }
          />
          <AsyncRoute
            key="post"
            path="/post/:title"
            {...(this.props as RouteProps)}
            getComponent={this.importPost}
          />
          <NotFound key="404" default {...(this.props as RouteProps)} />
        </Router>
      </div>
    );
  }
}

import { h, Component } from "preact";
import Router from "preact-router";
import AsyncRoute from "../components/asyncRoute";

import NotFound from "./notFound";
import Post from "../components/post";
import { RouteProps, StoreProps } from "../types";

async function importPost(url, cb, props) {
  const DynamicPost = await import(`./${props.title}.js`);
  return <Post {...DynamicPost.metadata} content={DynamicPost.default} />;
}

export default class Routes extends Component<StoreProps, {}> {
  render() {
    return (
      <Router>
        <AsyncRoute
          key={"home"}
          path="/"
          {...this.props as RouteProps}
          getComponent={() => import("./home").then(c => c.default)}
        />
        <AsyncRoute
          key="modlist"
          path="/u/:username/:filetype?"
          {...this.props as RouteProps}
          getComponent={() => import("./modlist").then(c => {
            return c.default;
          })}
        />
        <AsyncRoute key="posts" path="/posts" {...this.props as RouteProps} getComponent={() => import("./posts/index").then(c => c.default)} />
        <AsyncRoute key="post" path="/post/:title" {...this.props as RouteProps} getComponent={importPost} />
        <NotFound key="404" default {...this.props as RouteProps} />
      </Router>
    );
  }
};

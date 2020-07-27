import { h } from "preact";
import { Suspense, lazy } from "preact/compat";
import { Router, Route, Switch } from "wouter-preact";

import NotFound from "./notFound";
import { StoreProps } from "../types";

const Home = lazy(() => import("./home"));
const Modlist = lazy(() => import("./modlist"));
const Posts = lazy(() => import("./posts"));

process.env.LAZY_POST_INITIALIZERS;

export default (props: StoreProps) => {

  return <Router>
    <Switch>
      <Suspense path="/" fallback={<div />}>
        <Home {...props} />
      </Suspense>
      <Suspense path="/u/:username/:filetype?" fallback={<div />}>
        <Modlist {...props} />
      </Suspense>
      <Suspense path="/posts" fallback={<div />}>
        <Posts {...props} />
      </Suspense>
      {/*ROUTER_POST_SUSPENDERS*/}
      <Route>
        <NotFound {...props} />
      </Route>
    </Switch>
  </Router>
}

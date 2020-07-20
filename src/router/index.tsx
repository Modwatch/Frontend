import { h, Fragment } from "preact";
import { Suspense, lazy } from "preact/compat";
import { useState, useEffect, useCallback } from "preact/hooks";
// import Router, { route } from "preact-router";
import { Router, useRoute, Route, Switch } from "wouter-preact";

import NotFound from "./notFound";
import { RouteProps, StoreProps } from "../types";

const ROUTE_TRANSITION_TIMEOUT = 150; // needs to match transition duration in src/global.css

const Home = lazy(() => import("./home"));
const Modlist = lazy(() => import("./modlist"));
const Posts = lazy(() => import("./posts"));

process.env.LAZY_POST_INITIALIZERS;

export default (props: StoreProps) => {
  const [fading, setFading] = useState(false);
  const [fadeTimeout, setFadeTimeout] = useState(false);
  const [cancelRouteChange, setCancelRouteChange] = useState(false);

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

// export default (props: StoreProps) => {
//   const [fading, setFading] = useState(false);
//   const [fadeTimeout, setFadeTimeout] = useState(false);
//   const [cancelRouteChange, setCancelRouteChange] = useState(false);

//   const routeChange = (e) => {
//     if (cancelRouteChange) {
//       setCancelRouteChange(false);
//       return;
//     }
//     if (fading || fadeTimeout) {
//       return;
//     }
//     const decodedPrevious = e.previous
//       ? decodeURIComponent(e.previous)
//       : undefined;
//     const username = e.current.props.matches.username;
//     if (
//       e.previous &&
//       e.previous.indexOf("/u/") === 0 &&
//       e.current.key === "modlist" &&
//       username &&
//       username === decodedPrevious.slice(3, username.length + 3)
//     ) {
//       return;
//     }
//     e.previous && route(e.previous, true);
//     setTimeout(() => {
//       setFadeTimeout(false);
//       if (e.previous) {
//         setCancelRouteChange(true);
//         route(e.url, true);
//         window.scroll({
//           top: 0,
//           behavior: "smooth"
//         })
//       }
//     }, ROUTE_TRANSITION_TIMEOUT);
//     setFading(true);
//     setFadeTimeout(true);
//   };

//   const wrappedImport = async importedComponent => {
//     await importedComponent;
//     setFading(false);
//     return importedComponent;
//   }

//   const importPost = async (url, cb, props) => {
//     const DynamicPost = await wrappedImport(import(`./${props.title}.js`));
//     return <Post {...DynamicPost.metadata} content={DynamicPost.default} />;
//   }

//   return (
//     <div
//       class={`router-wrapper ${
//         fading || fadeTimeout ? "fading" : ""
//       }`}
//     >
//       <Router onChange={routeChange}>
//         <AsyncRoute
//           key={"home"}
//           path="/"
//           {...(props as RouteProps)}
//           getComponent={() =>
//             wrappedImport(import("./home").then(c => c.default))
//           }
//         />
//         <AsyncRoute
//           key="modlist"
//           path="/u/:username/:filetype?"
//           {...(props as RouteProps)}
//           getComponent={() =>
//             wrappedImport(
//               import("./modlist").then(c => {
//                 return c.default;
//               })
//             )
//           }
//         />
//         <AsyncRoute
//           key="posts"
//           path="/posts"
//           {...(props as RouteProps)}
//           getComponent={() =>
//             wrappedImport(import("./posts/index").then(c => c.default))
//           }
//         />
//         <AsyncRoute
//           key="post"
//           path="/post/:title"
//           {...(props as RouteProps)}
//           getComponent={importPost}
//         />
//         <NotFound key="404" {...(props as RouteProps)} />
//       </Router>
//     </div>
//   );
// }

// export default class Routes extends Component<
//   StoreProps,
//   { fading: boolean; timeout: boolean }
// > {
//   state = {
//     fading: false,
//     timeout: false
//   };
//   cancelRouteChange = false;
//   wrappedImport = importedComponent => {
//     return importedComponent.then(() => {
//       this.setState(() => ({
//         fading: false
//       }));
//       return importedComponent;
//     });
//   };
//   importPost = async (url, cb, props) => {
//     const DynamicPost = await this.wrappedImport(import(`./${props.title}.js`));
//     return <Post {...DynamicPost.metadata} content={DynamicPost.default} />;
//   };
//   routeChange = e => {
//     if (this.cancelRouteChange) {
//       this.cancelRouteChange = false;
//       return;
//     }
//     if (this.state.fading || this.state.timeout) {
//       return;
//     }
//     const decodedPrevious = e.previous
//       ? decodeURIComponent(e.previous)
//       : undefined;
//     const username = e.current.props.matches.username;
//     if (
//       e.previous &&
//       e.previous.indexOf("/u/") === 0 &&
//       e.current.key === "modlist" &&
//       username &&
//       username === decodedPrevious.slice(3, username.length + 3)
//     ) {
//       return;
//     }
//     e.previous && route(e.previous, true);
//     setTimeout(() => {
//       this.setState(
//         () => ({
//           timeout: false
//         }),
//         () => {
//           if (e.previous) {
//             this.cancelRouteChange = true;
//             route(e.url, true);
//             window.scroll({
//               top: 0,
//               behavior: "smooth"
//             })
//           }
//         }
//       );
//     }, ROUTE_TRANSITION_TIMEOUT);
//     this.setState(() => ({
//       fading: true,
//       timeout: true
//     }));
//   };
//   render() {
//     return (
//       <div
//         class={`router-wrapper ${
//           this.state.fading || this.state.timeout ? "fading" : ""
//         }`}
//       >
//         <Router onChange={this.routeChange}>
//           <AsyncRoute
//             key={"home"}
//             path="/"
//             {...(this.props as RouteProps)}
//             getComponent={() =>
//               this.wrappedImport(import("./home").then(c => c.default))
//             }
//           />
//           <AsyncRoute
//             key="modlist"
//             path="/u/:username/:filetype?"
//             {...(this.props as RouteProps)}
//             getComponent={() =>
//               this.wrappedImport(
//                 import("./modlist").then(c => {
//                   return c.default;
//                 })
//               )
//             }
//           />
//           <AsyncRoute
//             key="posts"
//             path="/posts"
//             {...(this.props as RouteProps)}
//             getComponent={() =>
//               this.wrappedImport(import("./posts/index").then(c => c.default))
//             }
//           />
//           <AsyncRoute
//             key="post"
//             path="/post/:title"
//             {...(this.props as RouteProps)}
//             getComponent={this.importPost}
//           />
//           <NotFound key="404" {...(this.props as RouteProps)} />
//         </Router>
//       </div>
//     );
//   }
// }

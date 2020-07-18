import { h } from "preact";
import { useState } from "preact/hooks";
import { useLocation, Link } from "wouter-preact";

import "@modwatch/core/src/components/modwatch-nav.css";
import ModwatchNav from "@modwatch/core/src/components/modwatch-nav";

import { StoreProps } from "../types";

const loginLink = `${process.env.API_URL}/oauth/authorize`;
const redirect_uri = encodeURIComponent(`${window.location.protocol}//${window.location.host}/`)

export default (props: StoreProps) => {
  const [location, setLocation] = useLocation();
  const [show, setShow] = useState(false);

  function logout() {
    props.logout();
    props.addNotification("Logged Out");
  }

  const authenticated = props.user
    ? props.user.authenticated
    : false;
  return (
    <ModwatchNav {...props}>
      <Link href="/" class="nav-block">
        Home
      </Link>
      {!authenticated ? (
        <Link class="nav-block" href={`${loginLink}?client_id=modwatch&redirect_uri=${redirect_uri}&response_type=code`}>
          Login
        </Link>
      ) : (
        <a onClick={logout} class="nav-block">
          Logout
        </a>
      )}
      <Link href="/posts" class="nav-block">
        Blog
      </Link>
      {authenticated && (
        <Link href={`/u/${props.user.username}`} class="nav-block">
          Profile
        </Link>
      )}
    </ModwatchNav>
  );
}

// export default class Nav extends Component<
//   StoreProps,
//   {
//     show: boolean;
//     loginLink: string;
//     redirect_uri: string;
//   }
// > {
//   state = {
//     show: false,
//     loginLink: `${process.env.API_URL}/oauth/authorize`,
//     redirect_uri: encodeURIComponent(
//       `${window.location.protocol}//${window.location.host}/`
//     )
//   };
//   toggleShow = () => {
//     this.setState(({ show }) => ({
//       show: !show
//     }));
//   };
//   login = () => {
//     window.location.replace(
//       `${this.state.loginLink}?client_id=modwatch&redirect_uri=${this.state.redirect_uri}&response_type=code`
//     );
//   };
//   logout = () => {
//     this.props.logout();
//     this.props.addNotification("Logged Out");
//   };
//   gotoProfile = () => {
//     if (this.props.user) {
//       // route(`/u/${this.props.user.username}`);
//       this.props.addNotification("Viewing Your Profile");
//     }
//   };
//   gotoHome = () => {
//     // route("/");
//   };
//   gotoBlog = () => {
//     // route("/posts");
//   };
//   render() {
    // const authenticated = this.props.user
    //   ? this.props.user.authenticated
    //   : false;
    // return (
    //   <ModwatchNav {...this.props}>
    //     <a onClick={this.gotoHome} class="nav-block">
    //       Home
    //     </a>
    //     {!authenticated ? (
    //       <a onClick={this.login} class="nav-block">
    //         Login
    //       </a>
    //     ) : (
    //       <a onClick={this.logout} class="nav-block">
    //         Logout
    //       </a>
    //     )}
    //     <a onClick={this.gotoBlog} class="nav-block">
    //       Blog
    //     </a>
    //     {authenticated && (
    //       <a onClick={this.gotoProfile} class="nav-block">
    //         Profile
    //       </a>
    //     )}
    //   </ModwatchNav>
    // );
//   }
// }

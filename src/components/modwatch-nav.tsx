import { h } from "preact";
import { Link } from "wouter-preact";

import "@modwatch/core/src/components/modwatch-nav.css";
import ModwatchNav from "@modwatch/core/src/components/modwatch-nav";

import { StoreProps } from "../types";

const loginLink = `${process.env.API_URL}/oauth/authorize`;
const redirect_uri = encodeURIComponent(`${window.location.protocol}//${window.location.host}/`)

export default (props: StoreProps) => {

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
        <a class="nav-block" href={`${loginLink}?client_id=modwatch&redirect_uri=${redirect_uri}&response_type=code`}>
          Login
        </a>
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

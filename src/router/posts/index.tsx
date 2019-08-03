import { h } from "preact";
import ModwatchPostList from "../../components/modwatch-postlist";

export const Header = props => (
  <header>
    <h1>{props.title}</h1>
    {props.subtitle && <p>{props.subtitle}</p>}
    <p>{props.timestamp.toDateString()}</p>
  </header>
);

export default ({ path }: { path?: string }) => (
  <ModwatchPostList title="All Blog Posts" unlimited={true} />
);

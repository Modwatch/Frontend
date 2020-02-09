import { h } from "preact";
import ModwatchPostList from "../../components/modwatch-postlist";

export const Header = function(props) {
  return (
    <header>
      <h1>{props.title}</h1>
      {props.subtitle && <p>{props.subtitle}</p>}
      <p>{props.timestamp.toDateString()}</p>
    </header>
  );
};

export default function({ path }: { path?: string }) {
  return <ModwatchPostList title="All Blog Posts" unlimited={true} />;
}

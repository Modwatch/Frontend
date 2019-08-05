import { h, Component } from "preact";
import { PostMetadata } from "../types";

const styles = {
  header: {
    marginBottom: "50px"
  },
  tagTimestampWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tags: {
    listStyle: "none",
    display: "flex",
    padding: 0,
    margin: 0
  },
  tag: {
    margin: "0 3px"
  },
  timestamp: {},
  content: {
    padding: "0 25px"
  }
};

export const Header = props => (
  <header style={styles.header}>
    <h1>{props.title}</h1>
    {props.subtitle && <p>{props.subtitle}</p>}
    <span style={styles.tagTimestampWrapper}>
      <p style={styles.timestamp}>{new Date(props.timestamp).toDateString()}</p>
      <ul style={styles.tags}>
        {props.tags.map(tag => (
          <li style={styles.tag}>{tag}</li>
        ))}
      </ul>
    </span>
  </header>
);

export default class Post extends Component<
  PostMetadata & { content: any },
  {}
> {
  render() {
    return (
      <div>
        <section>
          <Header {...this.props} content={undefined} />
          <span style={styles.content}>
            <this.props.content {...this.props} content={undefined} />
          </span>
        </section>
      </div>
    );
  }
}

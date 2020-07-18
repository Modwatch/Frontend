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
  section: {
    padding: "25px 10%"
  },
  timestamp: {
    color: "#d58717"
  },
  author: {
    color: "#d58717"
  },
  content: {
    textAlign: "left",
    fontSize: "16px"
  }
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const d = new Date();

export const Header = (props) => (
  <header style={styles.header}>
    <h1>{props.title}</h1>
    {props.subtitle && <p>{props.subtitle}</p>}
    <span style={styles.tagTimestampWrapper}>
      <p style={styles.author}>{props.author}</p>
      <p style={styles.timestamp} title={d.toUTCString()}>
        {months[d.getMonth()]} {d.getDate()}
        {", "}
        {d.getFullYear()}
      </p>
      {/* <ul style={styles.tags}>
        {props.tags.map(tag => (
          <li style={styles.tag}>{tag}</li>
        ))}
      </ul> */}
    </span>
  </header>
);

export default (props) => (
  <div class="post-wrapper">
    <section style={styles.section}>
      <Header {...props} content={undefined} />
      <span style={styles.content} class="post-content">
        <props.content {...props} content={undefined} />
      </span>
    </section>
  </div>
);

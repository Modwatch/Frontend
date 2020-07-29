import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Link } from "wouter-preact";
import { PostMetadata } from "../types";

import "./modwatch-postlist.css";

const MAX_POSTS = 3;

const styles = {
  div: {
    marginBottom: "25px",
  },
  h2: {
    marginBottom: "10px",
    boxSizing: "border-box",
    padding: "25px 10px",
    backgroundColor: "#d3d3d3",
    boxShadow: "3px 3px 6px 1px #000000",
  },
  ul: {
    listStyle: "none",
    // gridTemplateRows: "repeat(2, 150px)",
    gridAutoRows: "150px",
    gridColumnGap: "10px",
    gridRowGap: "10px",
    paddingLeft: "0",
    display: "grid",
    margin: 0,
  },
  li: {},
  link: {
    display: "flex",
    textAlign: "left",
    color: "#000000",
    backgroundColor: "#d3d3d3",
    padding: "25px 10px",
    boxShadow: "3px 3px 6px 1px",
  },
  img: {
    width: "100px",
    height: "100px",
    flexShrink: "0",
  },
  span: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: "10px",
  },
  more: {
    marginTop: "10px",
    boxSizing: "border-box",
    backgroundColor: "rgb(211, 211, 211)",
    boxShadow: "rgb(0, 0, 0) 3px 3px 6px 1px",
    padding: "10px 0",
  },
};

export default (props: { unlimited?: boolean; title?: string }) => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    import("../store/posts").then(({ metadata }) => {
      const allPosts = []
        .concat(metadata)
        .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
        .map((post) => ({
          ...post,
          _timestamp: new Date(post.timestamp).toDateString(),
        }));
      setPosts(allPosts.slice(0, !props.unlimited ? MAX_POSTS : undefined));
      setAllPosts(allPosts);
    });
  }, []);

  useEffect(() => {
    setPosts(allPosts.slice(0, !props.unlimited ? MAX_POSTS : undefined));
  }, [props.unlimited]);

  return (
    <div
      style={styles.div}
      class={`postlist${props.unlimited ? "" : " limited"}`}
    >
      <Link href="/posts" class="no-underline">
        <h2 style={styles.h2}>{props.title || "Latest Blog Posts"}</h2>
      </Link>
      <ul style={styles.ul}>
        {posts.map((post) => (
          <li style={styles.li}>
            <Link
              style={styles.link}
              class="no-underline"
              href={`/post/${post.id}`}
            >
              <img style={styles.img} alt={post.title} />
              <span style={styles.span}>
                <span>{post.title}</span>
                <span>{post._timestamp}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {!props.unlimited && (
        <div style={styles.more}>
          <Link class="no-underline" href="/posts">
            <button>More Posts</button>
          </Link>
        </div>
      )}
    </div>
  );
};

// export default class ModwatchPostList extends Component<
//   {
//     unlimited?: boolean;
//     title?: string;
//   },
//   {
//     posts: PostMetadata[];
//     allPosts: PostMetadata[];
//   }
// > {
//   state = {
//     posts: [],
//     allPosts: []
//   };
//   componentDidMount = async () => {
//     const { metadata } = await import("../store/posts");
//     const allPosts = []
//       .concat(metadata)
//       .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
//       .map(post => ({
//         ...post,
//         _timestamp: new Date(post.timestamp).toDateString()
//       }));
//     this.setState({
//       allPosts,
//       posts: allPosts
//         .slice(0, !this.props.unlimited ? MAX_POSTS : undefined)
//     });
//   };
//   componentWillReceiveProps(nextProps) {
//     if (this.props.unlimited !== nextProps.unlimited) {
//       this.setState(({ allPosts }) => ({
//         posts: allPosts.slice(0, !nextProps.unlimited ? MAX_POSTS : undefined)
//       }));
//     }
//   }
//   render() {
//     return (
//       <div
//         style={styles.div}
//         class={`postlist${this.props.unlimited ? "" : " limited"}`}
//       >
//         <Link href="/posts" class="no-underline">
//           <h2 style={styles.h2}>{this.props.title || "Latest Blog Posts"}</h2>
//         </Link>
//         <ul style={styles.ul}>
//           {this.state.posts.map(post => (
//             <li style={styles.li}>
//               <Link
//                 style={styles.link}
//                 class="no-underline"
//                 href={`/post/${post.id}`}
//               >
//                 <img style={styles.img} alt={post.title} />
//                 <span style={styles.span}>
//                   <span>{post.title}</span>
//                   <span>{post._timestamp}</span>
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//         {!this.props.unlimited && (
//           <div style={styles.more}>
//             <Link class="no-underline" href="/posts">
//               <button>More Posts</button>
//             </Link>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

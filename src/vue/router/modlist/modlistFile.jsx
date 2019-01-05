import { h, Component } from "preact";
import ModwatchFile from "./modwatch-file";
import { getModlistFileType } from "./api";

export default class ModlistFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      modlistMap: {
        "+": "enabled",
        "-": "disabled",
        "*": "unmanaged"
      }
    };
  }
  async componentDidMount() {
    const modlist = await getModlistFileType({
      username: this.props.username,
      filetype: "modlist"
    });
    this.setState(() => ({
      lines: modlist
    }));
  }
  render(props, state) {
    return (
      <ModwatchFile
        lines={
          state.showInactiveMods
            ? state.lines
            : state.lines.filter(line => line.descriptor !== "disabled")
        }
      />
    );
  }
}

// export default {
//   computed: {
//     ...mapState(["modlist", "modlistfilter", "showInactiveMods"]),
//     lines() {
//       return Array.prototype.slice
//         .call(
//           this.modlist.modlist
//             .filter(
//               l =>
//                 this.modlistfilter === "" ||
//                 l.toLowerCase().indexOf(this.modlistfilter.toLowerCase()) !== -1
//             )
//             .map((line, index, ref) => ({
//               content: line,
//               descriptor: this.modlistMap[line[0]],
//               index: ref.length - index
//             })),
//           0
//         )
//         .reverse();
//     }
//   },
//   data() {
//     return {
//       modlistMap: {
//         "+": "enabled",
//         "-": "disabled",
//         "*": "unmanaged"
//       }
//     };
//   },
//   created() {
//     this.$store.dispatch("getModlistFileType", {
//       username: this.$route.params.username,
//       filetype: "modlist"
//     });
//   },
//   render(h) {
//     return (
//       <modwatch-file
//         lines={
//           this.showInactiveMods
//             ? this.lines
//             : this.lines.filter(line => line.descriptor !== "disabled")
//         }
//       />
//     );
//   }
// };

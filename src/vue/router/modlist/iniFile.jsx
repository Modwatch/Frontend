import { h, Component } from "preact";
import { getModlistFileType } from "./api.js";
import { complexLines } from "./utils.js";
import ModwatchFile from "./modwatch-file.jsx";

export default class IniFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: []
    };
  }
  async componentDidMount() {
    const ini = await getModlistFileType({
      username: this.props.username,
      filetype: "ini"
    });
    this.setState(() => ({
      lines: complexLines({
        list: ini,
        filter: this.props.filter || ""
      })
    }));
  }
  render(props, state) {
    return <ModwatchFile lines={state.lines} complexLines={true} />
  }
}

// export default {
//   computed: {
//     ...mapState(["modlist"]),
//     lines() {
//       return this.$store.getters.complexlines({ filetype: "ini" });
//     }
//   },
//   created() {
//     this.$store.dispatch("getModlistFileType", {
//       username: this.$route.params.username,
//       filetype: "ini"
//     });
//   },
//   render(h) {
//     return <modwatch-file lines={this.lines} complex-lines />;
//   }
// };

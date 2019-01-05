import { h, Component } from "preact";
import { getModlistFileType } from "./api";
import { complexLines } from "./utils";
import ModwatchFile from "./modwatch-file";

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
      filetype: "prefsini"
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

// import { mapState } from "vuex";

// export default {
//   computed: {
//     ...mapState(["modlist"]),
//     lines() {
//       return this.$store.getters.complexlines({ filetype: "prefsini" });
//     }
//   },
//   created() {
//     this.$store.dispatch("getModlistFileType", {
//       username: this.$route.params.username,
//       filetype: "prefsini"
//     });
//   },
//   render(h) {
//     return <modwatch-file lines={this.lines} complex-lines />;
//   }
// };

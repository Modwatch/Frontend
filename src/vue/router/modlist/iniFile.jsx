import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "modlist"
    ]),
    lines() {
      return this.$store.getters.complexlines({filetype: "ini"});
    }
  },
  created() {
    this.$store.dispatch("getModlistFileType", { username: this.$route.params.username, filetype: "ini"});
  },
  render(h) {
    return (<modwatch-file lines={this.lines} complex-lines></modwatch-file>);
  }
}

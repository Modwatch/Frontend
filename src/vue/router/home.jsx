import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      modlists: state => state.modlists
    })
  },
  created() {
    this.$store.dispatch("getModlists");
  },
  methods: {
    goto(ev) {
      this.$router.push({name: ev.target.dataset.routeName, path: ev.target.dataset.routePath});
    }
  },
  render(h) {
    return (
      <div>
        <section>
          <h2>What is Modwatch</h2>
          <p>
            This is a modlist-hosting site for Skyrim, Skyrim SE, and Fallout 4. If you've ever had your game crash and asked for help on the internet,
            you've probably had someone ask you for what mods you're using. So you could go find those file and copy them into a comment, or into pastebin,
            or a google doc, etc. Or you could <a href="http://www.nexusmods.com/skyrim/mods/56640">download Modwatch</a>, choose a username, upload your files here,
            and have an easy link (<i>modwat.ch/u/your_username_here</i>) to give out. This site is also used by streamers, youtubers, or anyone else that might want
            to show people what mods they're using.
          </p>
        </section>
        <section>
          <h2>Updates</h2>
          <p>
            If you'd like to read about how I made this site, the uploader, the API behind it, or anything else web-related, I'll be writing short posts at <a href="https://medium.com/@ansballard">https://medium.com/@ansballard</a>!
          </p>
        </section>
        <transition name="fade" appear>
          {this.modlists.length > 0 && <section>
            <h2>Latest Modlists</h2>
            <modwatch-modlists modlists={this.modlists}></modwatch-modlists>
          </section>}
        </transition>
      </div>
    );
  }
}

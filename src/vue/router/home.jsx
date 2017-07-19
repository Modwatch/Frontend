import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      modlists: state => state.modlists,
      blogposts: state => state.blog.posts.map(({ title, author, createdTS, prettyURL }) => ({
        title,
        author,
        description,
        prettyURL,
        createdTS: new Date(createdTS).toLocaleDateString()
      }))
    })
  },
  created() {
    this.$store.dispatch("getModlists");
    this.$store.dispatch("getBlogPosts");
  },
  methods: {
    goto(ev) {
      this.$router.push({name: ev.target.dataset.routeName, path: ev.target.dataset.routePath});
    },
    addTempUser() {
      return this.$store.dispatch("addTempUser", {
        username: "Peanut",
        password: "password"
      });
    }
  },
  render(h) {
    return (
      <div>
        <section>
          <h2>What is Modwatch</h2>
          <p>
            Modwatch is a site for uploading and sharing modlists for Skyrim (and eventually other games).
            If you want to view some of the 5000+ modlists, you can look through the dropdown to the right.
            Or if you have one in mind, you can view it at modwat.ch/u/username.
          </p>
        </section>
        <section>
          <h2>Uploading Your Mods</h2>
          <p>
            If you want to upload your own modlist, you can download the uploader via the gigantic orange button at the top of the page.
            Instructions for uploading are detailed on the nexus page.
          </p>
        </section>
        <section class="home-blog">
          <h2>Blog!</h2>
          <ul>
            {this.blogposts.map(b => (
              <li>
                <div class="blog-title-wrapper">
                  <router-link class="title" to={`/blog/post/${b.prettyURL}`}>{b.title}</router-link>
                  <span class="author">{b.author}</span>
                  <span class="timestamp">{b.createdTS}</span>
                </div>
                <span>{b.description}</span>
              </li>
            ))}
          </ul>
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

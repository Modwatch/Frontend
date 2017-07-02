import snarkdown from "snarkdown";
import { mapState } from "vuex";

export default {
  data() {
    return {
      editMode: false,
      changes: {
        title: undefined,
        content: undefined
      }
    };
  },
  computed: {
    ...mapState({
      post: state => state.blog.currentpost
    }),
    content() {
      return snarkdown(this.changes.content || this.post.content);
    },
    title() {
      return this.changes.title || this.post.title;
    },
    admin() {
      return this.$store.state.user.scopes.indexOf("admin") !== -1
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    override({ target }) {
      this.changes[target.dataset.field] = target.value;
    }
  },
  render(h) {
    return (
      <article>
        <section>
          <h1>{!this.editMode ?
            (this.changes.title || this.post.title) :
            (<input class="filter-override-title" value={this.changes.title || this.post.title} data-field="title" onChange={this.override}/>)
          }</h1>
          {this.admin && <button onClick={this.toggleEditMode}>Toggle Edit Mode</button>}
          <div class="blog-override-content-wrapper">
            <div domPropsInnerHTML={this.content}></div>
            {this.editMode &&<textarea data-field="content" onChange={this.override}>
              {this.changes.content || this.post.content}
            </textarea>}
          </div>
        </section>
      </article>
    );
  }
}

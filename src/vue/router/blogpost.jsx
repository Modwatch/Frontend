import snarkdown from "snarkdown";
import { debounce } from "decko";
import { mapState } from "vuex";

export default {
  data() {
    return {
      editMode: false,
      changes: {
        title: undefined,
        description: undefined,
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
    @debounce(500)
    override({ target }) {
      this.changes[target.dataset.field] = target.value;
    }
  },
  render(h) {
    return (
      <article>
        <section>
          <h1>
            {!this.editMode ?
              (<span>{this.changes.title || this.post.title}</span>) :
              (<input class="filter-override-input" value={this.changes.title || this.post.title} data-field="title" onInput={this.override}/>)
            }
          </h1>
          <h3>
            {!this.editMode ?
              (<span>{this.changes.description || this.post.description}</span>) :
              (<input class="filter-override-input" value={this.changes.description || this.post.description} data-field="title" onInput={this.override}/>)
            }
          </h3>
          {this.admin && <button onClick={this.toggleEditMode}>Toggle Edit Mode</button>}
          <div class="blog-override-content-wrapper">
            <div domPropsInnerHTML={this.content}></div>
            {this.editMode && <textarea data-field="content" onInput={this.override}>
              {this.changes.content || this.post.content}
            </textarea>}
          </div>
        </section>
      </article>
    );
  }
}

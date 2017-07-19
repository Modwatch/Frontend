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
        content: undefined,
        draft: undefined,
        authorname: undefined
      }
    };
  },
  computed: {
    ...mapState({
      post: state => state.blog.currentpost,
      timestamp: state => new Date(state.blog.currentpost.createdTS).toDateString().slice(4)
    }),
    content() {
      return snarkdown(this.changes.content || this.post.content);
    },
    title() {
      return this.changes.title || this.post.title;
    },
    admin() {
      return this.$store.state.user.scopes.indexOf("admin") !== -1
    },
    unsavedChanges() {
      return Object.keys(this.changes).map(key => ({key, value: this.changes[key]})).filter(({key, value}) => typeof value !== "undefined").map(({key}) => key);
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    @debounce(1000)
    override({ target }) {
      this.changes[target.dataset.field] = target.value !== "on" ? target.value : target.checked;
    },
    save() {
      this.$store.dispatch("updateBlogpost", { ...this.changes, _id: this.post._id})
      .then(() => this.$store.dispatch("getBlogPost", { postid: this.post.prettyURL }))
      .then(() => {
        this.changes = {};
      });
    },
    remove() {
      if(window.confirm("Are you sure you want to delete this post? (No recovery)")) {
        this.$store.dispatch("deleteBlogpost", { id: this.post._id });
      }
    }
  },
  render(h) {
    return (
      <article>
        <header>
          <div>
            <h1>{this.changes.title || this.post.title}</h1>
            <h3>{this.changes.description || this.post.description}</h3>
          </div>
          <div>
            <h4>{this.post.authorname || this.post.author}</h4>
            <h4>{this.timestamp}</h4>
          </div>
          {this.admin && (
            <div>
              <div class="blogpost-admin-actions">
                <button onClick={this.toggleEditMode}>Toggle Edit Mode</button>
                <button onClick={this.save}>Save</button>
              </div>
              {this.editMode && (
                <div class="blogpost-edit-overrides">
                  <label for="override-title">Title</label>
                  <input id="override-title" data-field="title" value={this.changes.title || this.post.title} onInput={this.override}/>
                  <label for="override-description">Description</label>
                  <input id="override-description" data-field="description" value={this.changes.description || this.post.description} onInput={this.override}/>
                  <label for="override-authorname">Author Name (Display)</label>
                  <input id="override-authorname" data-field="authorname" value={this.changes.authorname || this.post.authorname} onInput={this.override}/>
                  <label for="override-checkbox">Draft</label>
                  <input id="override-checkbox" data-field="draft" type="checkbox" checked={typeof this.changes.draft === "undefined" ? this.post.draft : this.changes.draft} onChange={this.override}/>
                </div>
              )}
            </div>
          )}
          {this.unsavedChanges.length > 0 && (
            <div>
              <h4>Unsaved Changes</h4>
              <ul>
                {this.unsavedChanges.map(li => (
                  <li>{li}</li>
                ))}
              </ul>
            </div>
          )}
        </header>
        <div class="blog-override-content-wrapper">
          <div domPropsInnerHTML={this.content}></div>
          {this.editMode && <textarea data-field="content" onInput={this.override}>
            {this.changes.content || this.post.content}
          </textarea>}
        </div>
      </article>
    );
  }
}

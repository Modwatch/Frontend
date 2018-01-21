import Vue from "vue";

export default {
  props: {
    lines: {
      type: Array,
      default: []
    },
    showDescriptor: {
      type: Boolean,
      default: false
    },
    complexLines: {
      type: Boolean,
      default: false
    }
  },
  render(h) {
    return (
      <div>
        <ul>
          {this.lines.map(line => (
            <li
              class={`modlist-item ${line.descriptor ? line.descriptor : ""} ${
                line.type ? line.type : ""
              }`}
            >
              <span class="modlist-item-index unselectable">{line.index}.</span>
              <span class="modlist-item-content-wrapper">
                <span class="modlist-item-content">
                  {!this.complexLines
                    ? line.content
                    : line.content.map(chunk => (
                        <span class={chunk.class}>{chunk.display}</span>
                      ))}
                </span>
                <span class="modlist-item-descriptor">
                  {this.showDescriptor && line.descriptor !== "comment"
                    ? line.descriptor
                    : ""}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

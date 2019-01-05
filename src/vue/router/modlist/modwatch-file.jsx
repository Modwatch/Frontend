import { h } from "preact";

export default ({ lines, showDescriptor, complexLines }) => (
  <div>
    <ul>
      {lines.map(line => (
        <li
          class={`modlist-item ${line.descriptor ? line.descriptor : ""} ${
            line.type ? line.type : ""
          }`}
        >
          <span class="modlist-item-index unselectable">{line.index}.</span>
          <span class="modlist-item-content">
            {!complexLines
              ? line.content
              : line.content.map(chunk => (
                  <span class={chunk.class}>{chunk.display}</span>
                ))}
          </span>
          <span class="modlist-item-descriptor">
            {showDescriptor && line.descriptor !== "comment"
              ? line.descriptor
              : ""}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

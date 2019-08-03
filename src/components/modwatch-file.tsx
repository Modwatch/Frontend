import { h } from "preact";

import "./modwatch-file.css";

import { Line } from "../types";

export default (
  {
    lines = [],
    complexLines,
    showDescriptor,
    filetype,
    filter,
    showInactiveMods
  }: {
    lines: string[];
    complexLines: boolean;
    showDescriptor: boolean;
    filetype?: string;
    filter: string;
    showInactiveMods: boolean;
  } = {
    lines: [],
    complexLines: false,
    showDescriptor: false,
    filter: "",
    showInactiveMods: false
  }
) => (
  <div>
    <ul>
      {(!complexLines
        ? lines.map((line, index) =>
            stringToSimpleLine(
              line,
              index,
              filetype,
              filter.toLowerCase(),
              showInactiveMods
            )
          )
        : lines.map((line, index) =>
            stringToComplexLine(line, index, filter.toLowerCase())
          )
      ).map(
        line =>
          !line.hide && (
            <li
              class={`modlist-item ${line.descriptor ? line.descriptor : ""} ${
                line.type ? line.type : ""
              }`}
            >
              <span class="modlist-item-index unselectable">{line.index}.</span>
              <span class="modlist-item-content">
                {line.content.map(chunk => (
                  <span class={chunk.class}>{chunk.display}</span>
                ))}
              </span>
              <span class="modlist-item-descriptor">
                {showDescriptor && line.descriptor !== "comment"
                  ? line.descriptor
                  : ""}
              </span>
            </li>
          )
      )}
    </ul>
  </div>
);

const typeMap = {
  b: "type-boolean",
  s: "type-string",
  i: "type-integer",
  u: "type-unsigned",
  f: "type-float",
  r: "type-color"
};

const modlistMap = {
  "*": "unmanaged",
  "+": "enabled",
  "-": "disabled"
};

function stringToSimpleLine(
  originalLine: string,
  index: number,
  filetype: string,
  filter: string,
  showInactiveMods: boolean
): Line {
  const hide =
    (filter === "" ? false : !originalLine.toLowerCase().includes(filter)) ||
    (filetype === "modlist" && !showInactiveMods && originalLine[0] === "-");
  return hide
    ? {
        hide: true,
        index: index + 1
      }
    : {
        descriptor:
          filetype === "plugins"
            ? originalLine.slice(-3)
            : modlistMap[originalLine[0]],
        index: index + 1,
        content: [
          {
            class: "",
            display: originalLine
          }
        ]
      };
}

function stringToComplexLine(
  originalLine: string,
  index: number,
  filter: string
): Line {
  const hide =
    filter === ""
      ? false
      : !originalLine.toLowerCase().includes(filter.toLowerCase());
  if (hide) {
    return {
      hide: true,
      index: index + 1
    };
  }
  const descriptor =
    originalLine[0] !== ";"
      ? originalLine[0] !== "["
        ? "setting"
        : "section"
      : "comment";
  const commentIndex = originalLine.indexOf(";");
  if (
    (descriptor === "setting" && commentIndex === -1) ||
    commentIndex > originalLine.indexOf("=")
  ) {
    const [key, value, comment] = originalLine.split(/[=;]/g, 3);
    return {
      descriptor,
      type: typeMap[originalLine[0]],
      index: index + 1,
      content: [
        {
          class: "key",
          display: key
        },
        {
          class: "assign",
          display: "="
        },
        {
          class: "value",
          display: value
        }
      ].concat(
        comment
          ? {
              class: "comment",
              display: comment
            }
          : []
      )
    };
  } else {
    return {
      descriptor,
      index: index + 1,
      content: [
        {
          class: "",
          display: originalLine
        }
      ]
    };
  }
}

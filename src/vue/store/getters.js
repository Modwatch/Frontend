const typeMap = {
  b: "type-boolean",
  s: "type-string",
  i: "type-integer",
  u: "type-unsigned",
  f: "type-float",
  r: "type-color"
};

export function complexlines({ modlist, modlistfilter }, getters) {
  return ({ filetype }) =>
    modlist[filetype]
      .filter(
        l =>
          modlistfilter === "" ||
          l.toLowerCase().indexOf(modlistfilter.toLowerCase()) !== -1
      )
      .map((line, index) => ({
        // needs more logic for trailing comments and splitting settings
        content: line,
        descriptor:
          line[0] !== ";"
            ? line[0] !== "["
              ? "setting"
              : "section"
            : "comment",
        index: index + 1
      }))
      .map(({ content, descriptor, index }) => {
        if (descriptor === "setting" && content.indexOf("=") !== -1) {
          // if this is a valid setting line
          const commentIndex = content.indexOf(";");
          let key,
            value,
            comment = "";
          if (commentIndex !== -1) {
            // trailing comment
            comment = content.slice(commentIndex);
            [key, value] = content.slice(0, commentIndex).split("=");
          } else {
            [key, value] = content.split("=");
          }
          return {
            descriptor,
            index,
            type: typeMap[content[0]],
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
              },
              {
                class: "comment",
                display: comment
              }
            ]
          };
        } else {
          return {
            descriptor,
            index,
            content: [
              {
                class: "",
                display: content
              }
            ]
          };
        }
      });
}

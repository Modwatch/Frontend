export default Checked;

function Checked () {
  return (input, toggle) => {
    if (!toggle) {
      return input;
    } else {
      let filtered = [];
      for (let i = 0; i < input.length; i++) {
        if (input[i].display.indexOf("-") !== 0) {
          filtered.push(input[i]);
        }
      }
      return filtered;
    }
  };
}

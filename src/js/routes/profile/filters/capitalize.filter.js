export default Capitalize;

function Capitalize() {
  return (input) => {
    return input ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
  };
}

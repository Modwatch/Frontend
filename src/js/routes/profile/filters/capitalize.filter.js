export default Capitalize;

function Capitalize() {
  return input => input ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
}

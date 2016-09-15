export default Checked;

function Checked () {
  return (input = [], toggle) =>
    !toggle ? input : input.filter(item => item.display.indexOf("-") !== 0)
  ;
}

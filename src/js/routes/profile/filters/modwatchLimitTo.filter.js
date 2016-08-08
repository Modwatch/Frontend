export default ModwatchLimitTo;

function ModwatchLimitTo() {
  return (input, limit) =>
    (input && input.length > limit) ? (input.substr(0, limit) + "...") : input
  ;
}
